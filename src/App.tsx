/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { StudyGuideScreen } from './components/StudyGuideScreen';

export default function App() {
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const {
    session,
    startQuiz,
    endQuiz,
    tickTimer,
    goToNextQuestion,
    goToPreviousQuestion,
    jumpToQuestion,
    submitAnswer,
    quitSession
  } = useQuiz();

  if (showStudyGuide) {
    return <StudyGuideScreen onBack={() => setShowStudyGuide(false)} />;
  }

  if (!session) {
    return <SetupScreen onStart={startQuiz} onOpenStudyGuide={() => setShowStudyGuide(true)} />;
  }

  if (session.isFinished) {
    return <ResultScreen session={session} onRestart={quitSession} onHome={quitSession} />;
  }

  return (
    <QuizScreen 
      session={session}
      tickTimer={tickTimer}
      goToNextQuestion={goToNextQuestion}
      goToPreviousQuestion={goToPreviousQuestion}
      jumpToQuestion={jumpToQuestion}
      submitAnswer={submitAnswer}
      endQuiz={endQuiz}
      quitSession={quitSession}
    />
  );
}
