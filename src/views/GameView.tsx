import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightning, SpeakerHigh, SpeakerSlash, HourglassMedium } from '@phosphor-icons/react';
import { useGame } from '../contexts/GameContext';
import { useSoundSettings } from '../contexts/SoundContext';
import { useSound } from '../hooks/useSound';
import ChoiceButton from '../components/ChoiceButton';
import Card from '../components/Card';

const GameView: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const { 
    questions, currentQuestionIndex, submitAnswer, timeLeft, setTimeLeft,
    selectedAnswer, isCorrect, pointsEarned, currentPlayer, nextQuestion, players
  } = useGame();
  
  const { isSoundEnabled, toggleSound } = useSoundSettings();
  const { playSound } = useSound();

  const question = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  const getDisplayName = (player: typeof players[0]) => {
    if (currentPlayer && player.id === currentPlayer.id && !player.isHost) {
      return `${player.name} (YOU)`;
    }
    return player.name;
  };

  const hasAutoProgressed = React.useRef(false);
  const hasTimerStarted = React.useRef(false);

  useEffect(() => {
    hasAutoProgressed.current = false;
    hasTimerStarted.current = false;
  }, [currentQuestionIndex]);

  useEffect(() => {
    let lastTime = Date.now();
    const timer = setInterval(() => {
      hasTimerStarted.current = true;
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      setTimeLeft(prev => {
        const next = prev - delta;
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [currentQuestionIndex, setTimeLeft]);


  // Host-only auto-progression
  useEffect(() => {
    if (timeLeft === 0 && currentPlayer?.isHost && !hasAutoProgressed.current && hasTimerStarted.current) {
      hasAutoProgressed.current = true;
      nextQuestion();
    }
  }, [timeLeft, currentPlayer?.isHost, nextQuestion]);

  useEffect(() => {
    if (isCorrect === true) {
      if (timeLeft > (question?.timeLimit || 0) * 0.8) playSound('perfect');
      else playSound('correct');
    } else if (isCorrect === false) {
      playSound('bad');
    }
  }, [isCorrect, playSound, timeLeft, question?.timeLimit]);

  const hasShownFeedback = React.useRef(false);

  // Reset feedback state when a new question starts
  useEffect(() => {
    hasShownFeedback.current = false;
    if (isCorrect === null && selectedAnswer === null) {
      setShowFeedback(false);
    }
  }, [currentQuestionIndex, isCorrect, selectedAnswer]);

  // Trigger feedback overlay when state changes (exactly once per question)
  useEffect(() => {
    if (!hasShownFeedback.current) {
      if (isCorrect !== null || (timeLeft === 0 && selectedAnswer === null && hasTimerStarted.current)) {
        hasShownFeedback.current = true;
        setShowFeedback(true);
        const timer = setTimeout(() => {
          setShowFeedback(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isCorrect, timeLeft === 0, selectedAnswer]);



  if (!question) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-kapoww-purple">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-12 animate-pulse border-8 border-white/20">
             <Lightning className="text-kapoww-warning w-16 h-16 md:w-20 md:h-20" weight="fill" />
          </div>
          <h2 className="text-6xl md:text-8xl font-heading text-white italic italic-none drop-shadow-heavy animate-bounce">
            GET <span className="text-kapoww-warning">READY!</span>
          </h2>
          <p className="font-heading text-white/40 text-2xl uppercase tracking-[0.5em] mt-8">Synchronizing the squad...</p>
        </motion.div>
      </div>
    );
  }

  const progress = (timeLeft / question.timeLimit) * 100;
  
  return (
    <div className="relative min-h-[80vh] flex flex-col pt-8 pb-20">
      
      {/* Top HUD */}
      <div className="fixed top-0 left-0 w-full z-50 pt-2">
        {/* Progress Bar Container */}
        <div className="max-w-7xl mx-auto px-6 mb-2">
            <div className="w-full h-8 bg-black/20 rounded-full border-4 border-white shadow-heavy overflow-hidden relative">
              <motion.div 
                className="h-full bg-kapoww-warning shadow-[0_0_20px_rgba(255,234,0,0.5)]"
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
              <div className="absolute inset-x-0 top-0 h-4 bg-white/20 pointer-events-none" />
            </div>
        </div>
        
        {/* HUD Stats */}
        <div className="max-w-7xl mx-auto px-4 xs:px-6 flex justify-between items-start pt-2">
            <div className="flex items-center gap-2 sm:gap-4 bg-white border-4 border-white rounded-2xl sm:rounded-[2rem] px-3 py-1.5 sm:px-6 sm:py-3 shadow-heavy">
               <div className="w-8 h-8 sm:w-12 sm:h-12 bg-kapoww-orange text-white font-heading text-lg sm:text-2xl flex items-center justify-center rounded-lg sm:rounded-[1.25rem] border-2 sm:border-4 border-white shadow-heavy rotate-6">
                  {currentPlayer?.name.charAt(0) || '?'}
               </div>
               <div className="flex flex-col pr-2 sm:pr-4">
                  <span className="text-[8px] sm:text-[10px] font-heading text-kapoww-purple/40 tracking-widest uppercase mb-0.5">Player</span>
                  <span className="font-heading text-xs sm:text-base text-kapoww-purple line-clamp-1 max-w-[80px] sm:max-w-none">{currentPlayer ? getDisplayName(currentPlayer) : 'Loading...'}</span>
               </div>
               <div className="h-6 sm:h-10 w-[2px] sm:w-[4px] bg-kapoww-purple/10 rounded-full" />
               <div className="flex flex-col pl-1 sm:pl-2">
                  <span className="text-[8px] sm:text-[10px] font-heading text-kapoww-purple/40 tracking-widest uppercase mb-0.5">Score</span>
                  <span className="font-heading text-base sm:text-2xl text-kapoww-orange italic">{currentPlayer?.score || 0}</span>
               </div>
            </div>
 
            <button 
                onClick={toggleSound}
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border-2 sm:border-4 border-white shadow-heavy ${isSoundEnabled ? 'bg-kapoww-warning text-black' : 'bg-white text-kapoww-purple opacity-60'}`}
            >
                {isSoundEnabled ? <SpeakerHigh className="w-5 h-5 sm:w-8 sm:h-8" weight="fill" /> : <SpeakerSlash className="w-5 h-5 sm:w-8 sm:h-8" weight="bold" />}
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 flex flex-col flex-1 z-10 pt-12 md:pt-16">
        {/* Question Info Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-8 mb-4 md:mb-6">
           <div className="flex flex-col">
              <span className="font-heading text-white/60 uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-2 sm:mb-3 italic drop-shadow-md">CURRENT BATTLE</span>
              <div className="flex items-baseline gap-2 sm:gap-4">
                 <span className="font-heading text-5xl sm:text-7xl text-white italic drop-shadow-lg leading-none">{questionNumber}</span>
                 <span className="font-heading text-2xl sm:text-3xl text-white/40 italic">/</span>
                 <span className="font-heading text-3xl sm:text-4xl text-white/50 italic">{totalQuestions}</span>
              </div>
           </div>

           <div className="flex items-center gap-3 sm:gap-6">
              <div className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 sm:border-4 border-white bg-white/10 font-heading text-[10px] sm:text-xs text-white uppercase tracking-widest shadow-heavy">
                 {question.difficulty || 'MEDIUM'}
              </div>
              <div className="bg-kapoww-orange px-4 py-2 sm:px-8 sm:py-3 rounded-xl sm:rounded-[2rem] border-2 sm:border-4 border-white shadow-heavy flex items-center gap-2 sm:gap-4 -rotate-3">
                 <Lightning className="w-5 h-5 sm:w-8 sm:h-8 text-white" weight="fill" />
                 <span className="font-heading text-xl sm:text-3xl text-white italic">{question.points}</span>
              </div>
           </div>
        </div>

        {/* Question Card */}
        <Card variant="yellow" className="min-h-[140px] sm:min-h-[220px] md:min-h-[240px] flex items-center justify-center text-center p-4 sm:p-8 md:p-10 lg:p-12 mb-4 md:mb-8">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-kapoww-purple leading-tight tracking-tighter drop-shadow-xl break-words italic">
              {question.text}
            </h2>
          </motion.div>
        </Card>

        {/* Choices Grid OR Leaderboard */}
        <div className="mt-auto">
          <AnimatePresence mode="wait">
            {selectedAnswer === null ? (
              <motion.div 
                key="choices"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              >
                {question.options.map((choice, idx) => (
                  <ChoiceButton
                    key={idx}
                    choice={choice}
                    index={idx}
                    selected={selectedAnswer === idx}
                    correct={null}
                    disabled={false}
                    onClick={() => submitAnswer(idx, timeLeft)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-[3rem] p-6 sm:p-8 border-4 border-white/20 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 text-center sm:text-left">
                  <h3 className="text-3xl sm:text-4xl font-heading text-white italic uppercase tracking-tighter">Squad Rankings</h3>
                  <div className="bg-kapoww-orange px-6 py-2 rounded-full border-2 border-white flex items-center gap-3">
                    <HourglassMedium size={24} className="text-white animate-spin" />
                    <span className="font-heading text-white text-lg sm:text-xl uppercase italic">Next in {Math.ceil(timeLeft)}s</span>
                  </div>
                </div>

                <div className="mb-6 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-kapoww-success/20 border-4 border-white/20 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                  <div className="px-4 py-1.5 rounded-full bg-kapoww-success text-white font-heading text-xs sm:text-sm uppercase tracking-widest shadow-heavy -rotate-2">
                    CORRECT ANSWER
                  </div>
                  <p className="text-white font-heading text-xl sm:text-2xl italic tracking-tight text-center sm:text-left">
                    {question.options[question.correctAnswerIndex]}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[...players].sort((a, b) => b.score - a.score).slice(0, 5).map((player, rank) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rank * 0.1 }}
                      className={`flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl border-2 ${player.id === currentPlayer?.id ? 'bg-kapoww-purple border-white shadow-heavy scale-105 z-10 relative' : 'bg-white/5 border-white/10'}`}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex shrink-0 items-center justify-center font-heading text-kapoww-purple text-xl sm:text-2xl">
                        {rank + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-heading text-xl sm:text-2xl italic truncate ${player.id === currentPlayer?.id ? 'text-white' : 'text-white/60'}`}>
                          {getDisplayName(player)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-heading text-2xl sm:text-3xl italic ${player.id === currentPlayer?.id ? 'text-kapoww-orange' : 'text-white'}`}>
                          {player.score}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedback(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-kapoww-purple/95 backdrop-blur-2xl cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100, rotate: -15 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              className="text-center"
            >
              <div className="relative mb-16">
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0]
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="w-56 h-56 sm:w-80 sm:h-80 mx-auto relative"
                >
                  <div className={`absolute inset-0 blur-[60px] rounded-full opacity-60 ${isCorrect ? 'bg-kapoww-success' : 'bg-kapoww-error'}`} />
                  
                  <img 
                    src={`/assets/status-${isCorrect ? (timeLeft > question.timeLimit * 0.8 ? 'perfect' : 'good') : 'bad'}.svg`} 
                    alt={isCorrect ? 'Correct' : 'Wrong'} 
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
                </motion.div>
              </div>

              <h4 className={`text-6xl sm:text-8xl lg:text-[10rem] font-heading tracking-tighter uppercase italic leading-none mb-6 select-none ${isCorrect ? 'text-kapoww-success' : 'text-kapoww-error'} drop-shadow-2xl`}>
                {isCorrect ? (timeLeft > question.timeLimit * 0.8 ? 'BOOM!' : 'NICE!') : 'OOPS!'}
              </h4>
              
              <p className="text-3xl sm:text-6xl font-heading text-white italic drop-shadow-lg">
                {isCorrect ? `+${pointsEarned} POINTS` : 'WRONG CHOICE!'}
              </p>

              {isCorrect === null && timeLeft === 0 && (
                 <p className="text-4xl sm:text-5xl font-heading text-kapoww-error mt-12 drop-shadow-xl italic">TIME'S UP!</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GameView;
