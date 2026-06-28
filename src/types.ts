export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  difficulty: string;
  points: number;
  timeLimit: number; // in seconds
}

export interface Player {
  id: string;
  name: string;
  score: number;
  lastAnswerCorrect: boolean | null;
  isHost: boolean;
}

export interface GameSession {
  id: string;
  code: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'results' | 'finished';
  currentQuestionIndex: number;
  questionIds: string[];
  createdAt: string;
  updatedAt: string;
}
