import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Player, Question } from '../types';
import { gameService } from '../services/gameService';
import { quizService } from '../services/quizService';
import { useSound } from '../hooks/useSound';
import { getRandomName, getAvailableName } from '../utils/nameGenerator';

interface GameContextType {
  sessionId: string | null;
  gameCode: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  status: 'lobby' | 'playing' | 'results' | 'home';
  currentPlayer: Player | null;
  createGame: (name: string, categories: string[]) => Promise<string>;
  joinGame: (code: string, name: string) => Promise<{ success: boolean; error?: string; name?: string }>;
  startGame: () => Promise<void>;
  submitAnswer: (index: number, timeLeft: number) => void;
  nextQuestion: () => Promise<void>;
  resetGame: () => void;
  playRematch: () => Promise<void>;
  syncWithRoom: (code: string) => Promise<void>;
  // Feedback states
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  pointsEarned: number;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [status, setStatus] = useState<'lobby' | 'playing' | 'results' | 'home'>('home');
  
  // Feedback / Game Loop states
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const { playSound } = useSound();

  // Helper: Get identity from session storage
  const getStoredIdentity = () => {
    const id = sessionStorage.getItem('kapoww_player_id');
    const name = sessionStorage.getItem('kapoww_player_name');
    return id && name ? { id, name } : null;
  };

  const currentPlayerId = sessionStorage.getItem('kapoww_player_id') || '';
  const currentPlayer = players.find(p => p.id === currentPlayerId) || null;

  const currentQuestionIdsRef = React.useRef<string[]>([]);
  const playedQuestionIdsRef = React.useRef<string[]>([]);
  const selectedCategoriesRef = React.useRef<string[]>(['All']);

  // Real-time Subscriptions logic
  useEffect(() => {
    if (!sessionId) return;

    const loadInitialData = async () => {
      try {
        const initialPlayers = await gameService.getPlayers(sessionId);
        setPlayers(initialPlayers);

        const session = await gameService.getSessionById(sessionId);
        if (session) {
          setGameCode(session.code);
          if (session.status === 'playing') setStatus('playing');
          if (session.status === 'results') setStatus('results');
          if (session.status === 'lobby') setStatus('lobby');
          
          if (session.question_ids && session.question_ids.length > 0 && currentQuestionIdsRef.current.length === 0) {
            currentQuestionIdsRef.current = session.question_ids;
            const syncedQuestions = await quizService.getQuestionsByIds(session.question_ids);
            setQuestions(syncedQuestions);
          }
        }
      } catch (err) {
        console.error("Context load error:", err);
      }
    };
    loadInitialData();

    const channel = gameService.subscribeToSession(sessionId, (payload) => {
      const { current_question_index, status: newStatus, question_ids } = payload.new;
      
      if (question_ids && question_ids.length > 0) {
        const oldIds = currentQuestionIdsRef.current;
        const isDifferent = oldIds.length !== question_ids.length || oldIds.some((id, i) => id !== question_ids[i]);
        if (isDifferent) {
          currentQuestionIdsRef.current = question_ids;
          quizService.getQuestionsByIds(question_ids).then(setQuestions);
        }
      }

      setCurrentQuestionIndex(current_question_index);
      if (newStatus === 'playing') setStatus('playing');
      if (newStatus === 'results') setStatus('results');
      if (newStatus === 'lobby') setStatus('lobby');
    });

    const playerChannel = gameService.subscribeToPlayers(sessionId, (payload) => {
      if (payload.eventType === 'INSERT') {
        const newPlayer = payload.new;
        setPlayers(prev => {
          if (prev.find(p => p.id === newPlayer.external_id)) return prev;
          playSound('join');
          return [...prev, {
            id: newPlayer.external_id,
            name: newPlayer.name,
            score: newPlayer.score,
            isHost: newPlayer.is_host,
            lastAnswerCorrect: newPlayer.last_answer_correct
          }];
        });
      } else if (payload.eventType === 'UPDATE') {
        const updatedPlayer = payload.new;
        setPlayers(prev => prev.map(p => 
          p.id === updatedPlayer.external_id 
            ? { ...p, score: updatedPlayer.score, lastAnswerCorrect: updatedPlayer.last_answer_correct }
            : p
        ));
      }
    });

    return () => {
      channel.unsubscribe();
      playerChannel.unsubscribe();
    };
  }, [sessionId, playSound, questions.length]);

  const createGame = async (name: string, categories: string[]) => {
    playSound('join');
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id = `player-${Math.random().toString(36).substring(2, 6)}`;
    const finalName = name.trim() || getRandomName();
    
    // Store categories for future rematches
    selectedCategoriesRef.current = categories;

    try {
      const filteredQuestions = await quizService.getQuestions(categories);
      if (filteredQuestions.length === 0) throw new Error("No questions found");
      
      const qIds = filteredQuestions.map(q => q.id);
      
      // Track initial questions as played
      playedQuestionIdsRef.current = [...qIds];

      const session = await gameService.createSession(code, id, qIds);
      const host: Player = { id, name: `${finalName} (Host)`, score: 0, lastAnswerCorrect: null, isHost: true };
      
      await gameService.joinSession(session.id, host);
      
      // Persist identity
      sessionStorage.setItem('kapoww_player_id', id);
      sessionStorage.setItem('kapoww_player_name', host.name);
      
      setSessionId(session.id);
      setGameCode(code);
      setQuestions(filteredQuestions);
      setPlayers([host]);
      setStatus('lobby');
      return code;
    } catch (err) {
      console.error("Critical error during game creation:", err);
      throw err;
    }
  };

  const joinGame = async (code: string, name: string) => {
    try {
      const session = await gameService.getSessionByCode(code);
      if (!session) {
        return { success: false, error: "Room not found!" };
      }

      const existingPlayers = await gameService.getPlayers(session.id);
      const currentPlayerId = sessionStorage.getItem('kapoww_player_id');
      
      // Check if this player is already in the room (Reconnection)
      const existingPlayer = existingPlayers.find(p => p.id === currentPlayerId);
      
      if (existingPlayer) {
        setSessionId(session.id);
        setGameCode(session.code);
        
        // Sync status from DB
        setStatus(session.status as any);

        // Refresh questions if missing
        if (session.question_ids && session.question_ids.length > 0 && currentQuestionIdsRef.current.length === 0) {
          currentQuestionIdsRef.current = session.question_ids;
          const syncedQuestions = await quizService.getQuestionsByIds(session.question_ids);
          setQuestions(syncedQuestions);
        }

        playSound('join');
        return { success: true, name: existingPlayer.name };
      }

      // If NOT a reconnection, check if the room belongs to a lobby
      if (session.status !== 'lobby') {
        return { success: false, error: "Game already started!" };
      }

      // New Join logic
      const existingNames = existingPlayers.map(p => p.name);
      const finalName = getAvailableName(name.trim() || getRandomName(), existingNames);
      const id = currentPlayerId || `player-${Math.random().toString(36).substring(2, 6)}`;
      
      const joiner: Player = { id, name: finalName, score: 0, lastAnswerCorrect: null, isHost: false };
      await gameService.joinSession(session.id, joiner);
      
      sessionStorage.setItem('kapoww_player_id', id);
      sessionStorage.setItem('kapoww_player_name', finalName);
      
      setSessionId(session.id);
      setGameCode(session.code);
      setStatus('lobby');
      
      playSound('join');
      return { success: true, name: finalName };
    } catch (err) {
      console.error("Critical error during join flow:", err);
      return { success: false, error: "Connection error!" };
    }
  };

  const startGame = async () => {
    if (!sessionId) return;
    playSound('start');
    await gameService.updateGameState(sessionId, { status: 'playing', current_question_index: 0 });
  };

  const submitAnswer = (index: number, currentTimeLeft: number) => {
    if (selectedAnswer !== null || !questions[currentQuestionIndex]) return;
    
    const question = questions[currentQuestionIndex];
    const correct = index === question.correctAnswerIndex;
    
    setSelectedAnswer(index);
    setIsCorrect(correct);

    if (correct) {
      const timeBonus = Math.floor((currentTimeLeft / question.timeLimit) * 500);
      const totalPointsAdded = question.points + timeBonus;
      setPointsEarned(totalPointsAdded);

      if (sessionId && currentPlayerId) {
        gameService.updatePlayerScore(sessionId, currentPlayerId, { 
          score: (currentPlayer?.score || 0) + totalPointsAdded, 
          last_answer_correct: true 
        });
      }
    } else if (sessionId && currentPlayerId) {
      gameService.updatePlayerScore(sessionId, currentPlayerId, { 
        last_answer_correct: false 
      });
    }
  };

  const nextQuestion = useCallback(async () => {
    if (!sessionId) return;
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      await gameService.updateGameState(sessionId, { current_question_index: nextIndex });
    } else {
      await gameService.updateGameState(sessionId, { status: 'results' });
      if (currentPlayer) {
        await quizService.pushLeaderboardScore(currentPlayer.name, currentPlayer.score);
      }
    }
  }, [currentQuestionIndex, questions.length, sessionId, currentPlayer]);

  // Sync internal state when question index changes
  useEffect(() => {
    if (status === 'playing' && questions[currentQuestionIndex]) {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPointsEarned(0);
      setTimeLeft(questions[currentQuestionIndex].timeLimit);
    }
  }, [currentQuestionIndex, status, questions]);

  const resetGame = () => {
    setSessionId(null);
    setGameCode('');
    setStatus('home');
    setPlayers([]);
    setQuestions([]);
  };

  const playRematch = async () => {
    if (!sessionId || !currentPlayer?.isHost) return;
    playSound('join');
    
    try {
      // Get a fresh set of questions based on initially selected categories, excluding played ones
      const newQuestions = await quizService.getQuestions(
        selectedCategoriesRef.current,
        playedQuestionIdsRef.current
      );
      const qIds = newQuestions.map(q => q.id);

      // Add the new questions to our tracked list of played questions
      playedQuestionIdsRef.current = [...playedQuestionIdsRef.current, ...qIds];

      // Reset the game session back to lobby with new questions
      await gameService.updateGameState(sessionId, { 
        status: 'lobby', 
        current_question_index: 0,
        question_ids: qIds
      });

      // Reset all player scores to 0
      await Promise.all(players.map(p => 
        gameService.updatePlayerScore(sessionId, p.id, { score: 0, last_answer_correct: null })
      ));
    } catch (err) {
      console.error("Error setting up rematch:", err);
    }
  };

  const syncWithRoom = async (code: string) => {
    if (sessionId || !code) return;
    try {
      const session = await gameService.getSessionByCode(code);
      if (session) {
        setSessionId(session.id);
        setGameCode(session.code);
        if (session.status === 'playing') setStatus('playing');
        if (session.status === 'results') setStatus('results');
        if (session.status === 'lobby') setStatus('lobby');
      }
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  return (
    <GameContext.Provider value={{
      sessionId, gameCode, players, questions, currentQuestionIndex, status, currentPlayer,
      createGame, joinGame, startGame, submitAnswer, nextQuestion, resetGame, playRematch, syncWithRoom,
      selectedAnswer, isCorrect, pointsEarned, timeLeft, setTimeLeft
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
