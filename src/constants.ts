import { Question } from './types';

export const MOCK_QUIZ_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
    points: 1000,
    timeLimit: 20,
  },
  {
    id: '2',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswerIndex: 2,
    points: 1000,
    timeLimit: 15,
  },
  {
    id: '3',
    text: 'Which element has the chemical symbol "O"?',
    options: ['Gold', 'Silver', 'Oxygen', 'Iron'],
    correctAnswerIndex: 2,
    points: 1000,
    timeLimit: 10,
  },
  {
    id: '4',
    text: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
    correctAnswerIndex: 2,
    points: 1000,
    timeLimit: 25,
  }
];
