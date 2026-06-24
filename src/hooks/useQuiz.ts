import { useState, useMemo } from 'react';
import { Question, QuizSession, SessionConfig, UserAnswer } from '../types';
import allQuestions from '../data/questions.json';

export function useQuiz() {
  const [session, setSession] = useState<QuizSession | null>(null);

  const startQuiz = (config: SessionConfig) => {
    // Select N questions from the pool.
    // For consistency per session, randomly select N questions out of 112.
    // Since the prompt asks for "the same different questions for each session for consistent",
    // we'll just slice the first N for simplicity, or shuffle them.
    // Let's implement a random shuffle.
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, config.questionCount);

    const newSession: QuizSession = {
      id: Math.random().toString(36).substring(7),
      config,
      questions: selected as Question[],
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeRemaining: config.questionCount * 120, // 2 minutes per question
      isFinished: false,
    };
    setSession(newSession);
  };

  const endQuiz = () => {
    setSession(prev => prev ? { ...prev, isFinished: true } : prev);
  };

  const tickTimer = () => {
    setSession(prev => {
      if (!prev || prev.isFinished) return prev;
      if (prev.timeRemaining <= 1) {
        return { ...prev, timeRemaining: 0, isFinished: true };
      }
      return { ...prev, timeRemaining: prev.timeRemaining - 1 };
    });
  };

  const goToNextQuestion = () => {
    setSession(prev => {
      if (!prev) return prev;
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      } else {
        return { ...prev, isFinished: true };
      }
    });
  };

  const goToPreviousQuestion = () => {
    setSession(prev => {
      if (!prev) return prev;
      if (prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      return prev;
    });
  };

  const jumpToQuestion = (index: number) => {
    setSession(prev => {
      if (!prev) return prev;
      if (index >= 0 && index < prev.questions.length) {
        return { ...prev, currentQuestionIndex: index };
      }
      return prev;
    });
  };

  const submitAnswer = (questionId: string, answer: any) => {
    setSession(prev => {
      if (!prev) return prev;
      const question = prev.questions.find(q => q.id === questionId);
      if (!question) return prev;

      let isCorrect = false;
      
      // Evaluate correctness based on type
      if (question.type === 'multiple-choice') {
        if (Array.isArray(question.correctAnswer)) {
          const correctArray = question.correctAnswer as string[];
          const answerArray = Array.isArray(answer) ? answer : [answer].filter(Boolean);
          if (correctArray.length === answerArray.length) {
            isCorrect = correctArray.every(val => answerArray.includes(val));
          } else {
            isCorrect = false;
          }
        } else {
          isCorrect = answer === question.correctAnswer;
        }
      } else if (question.type === 'drag-drop') {
        const correctMap = question.correctAnswer as Record<string, string>;
        const userMap = answer as Record<string, string>;
        isCorrect = true;
        for (const key of Object.keys(correctMap)) {
          if (correctMap[key] !== userMap[key]) {
            isCorrect = false;
            break;
          }
        }
      } else if (question.type === 'hotspot') {
        const correctMap = question.correctAnswer as Record<string, string>;
        const userMap = answer as Record<string, string>;
        isCorrect = true;
        for (const key of Object.keys(correctMap)) {
          if (correctMap[key] !== userMap[key]) {
            isCorrect = false;
            break;
          }
        }
      }

      const userAnswer: UserAnswer = {
        questionId,
        answer,
        isCorrect,
        timeSpent: 0, // Not explicitly tracked per question here easily, can be derived later if needed
      };

      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: userAnswer },
      };
    });
  };

  const reviewExam = () => {
    // Reset to start and flip mode or something? 
    // Usually it just shows the answers and results.
  }

  const quitSession = () => {
    setSession(null);
  }

  return {
    session,
    startQuiz,
    endQuiz,
    tickTimer,
    goToNextQuestion,
    goToPreviousQuestion,
    jumpToQuestion,
    submitAnswer,
    quitSession,
  };
}
