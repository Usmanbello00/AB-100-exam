export type QuestionType = 'multiple-choice' | 'drag-drop' | 'hotspot';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topic: string;
  type: QuestionType;
  text: string;
  context?: string; 
  options?: Option[]; // For multiple-choice
  dragItems?: string[]; // For drag-drop
  dropZones?: { id: string; label: string }[]; // For drag-drop
  hotspotAreas?: { id: string; label: string; options: string[] }[]; // For hotspots mapping
  correctAnswer: any; // e.g. 'A', or ['A', 'B'], or { zone1: 'item', zone2: 'item' }
  explanation: string;
}

export type Mode = 'study' | 'exam';

export interface SessionConfig {
  mode: Mode;
  questionCount: number;
}

export interface UserAnswer {
  questionId: string;
  answer: any;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface QuizSession {
  id: string;
  config: SessionConfig;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, UserAnswer>;
  startTime: number;
  timeRemaining: number;
  isFinished: boolean;
}
