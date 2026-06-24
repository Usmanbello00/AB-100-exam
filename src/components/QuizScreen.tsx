import React, { useEffect, useState } from 'react';
import { QuizSession, UserAnswer } from '../types';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, LayoutGrid } from 'lucide-react';
import { QuestionDisplay } from './QuestionDisplay';
import { cn } from '../utils';

interface QuizScreenProps {
  session: QuizSession;
  tickTimer: () => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  submitAnswer: (questionId: string, answer: any) => void;
  endQuiz: () => void;
  quitSession: () => void;
}

export function QuizScreen({
  session, tickTimer, goToNextQuestion, goToPreviousQuestion, jumpToQuestion, submitAnswer, endQuiz, quitSession
}: QuizScreenProps) {
  
  useEffect(() => {
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  const [localAnswer, setLocalAnswer] = useState<any>(undefined);
  const [pendingAnswers, setPendingAnswers] = useState<Record<string, any>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showGrid, setShowGrid] = useState(false);

  const question = session.questions[session.currentQuestionIndex];
  const existingAnswerObj = session.answers[question.id];
  const answered = existingAnswerObj !== undefined;

  // Sync local answer state when switching questions
  useEffect(() => {
    if (answered) {
      setLocalAnswer(existingAnswerObj.answer);
    } else {
      if (pendingAnswers[question.id] !== undefined) {
        setLocalAnswer(pendingAnswers[question.id]);
      } else {
        // Default initial states based on type
        if (question.type === 'multiple-choice') {
          setLocalAnswer(undefined);
        } else if (question.type === 'hotspot' || question.type === 'drag-drop') {
          setLocalAnswer({});
        }
      }
    }
  }, [session.currentQuestionIndex, question.id, answered, existingAnswerObj, question.type]); // Intentionally not including pendingAnswers to avoid loop

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
  };

  const handleCheckAnswer = () => {
    if (localAnswer !== undefined) {
      submitAnswer(question.id, localAnswer);
    }
  };

  const commitCurrentAnswer = () => {
    if (session.config.mode === 'study' && !answered && localAnswer !== undefined) {
      if (typeof localAnswer !== 'object' || Object.keys(localAnswer).length > 0) {
        submitAnswer(question.id, localAnswer);
      }
    }
  };

  const handleEndQuiz = () => {
    commitCurrentAnswer();
    endQuiz();
  };

  const handleAnswerChange = (val: any) => {
    setLocalAnswer(val);
    setPendingAnswers(prev => ({ ...prev, [question.id]: val }));
    if (session.config.mode === 'exam') {
      submitAnswer(question.id, val);
    }
  };

  const handleNext = () => {
    commitCurrentAnswer();
    if (session.currentQuestionIndex === session.questions.length - 1) {
      endQuiz();
    } else {
      goToNextQuestion();
    }
  };

  const handlePrevious = () => {
    commitCurrentAnswer();
    goToPreviousQuestion();
  };

  const handleJump = (idx: number) => {
    commitCurrentAnswer();
    jumpToQuestion(idx);
    if (window.innerWidth < 1024) setShowGrid(false);
  };

  const toggleRevealAnswer = () => {
    setRevealedAnswers(prev => ({ ...prev, [question.id]: !prev[question.id] }));
  };

  const showFeedback = session.config.mode === 'study' && (answered || revealedAnswers[question.id]);
  
  // Progress
  const progressPercent = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 p-4 lg:p-6 overflow-hidden relative font-sans">
      
      {/* Header */}
      <header className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 md:p-4 md:mb-4 shadow-sm shrink-0 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-xl shrink-0">MS</div>
          <div className="shrink-0">
            <h1 className="text-slate-800 font-bold text-base md:text-lg leading-tight hidden sm:block">Exam AB-100: Microsoft’s Agentic AI Business Solutions Architect</h1>
            <h1 className="text-slate-800 font-bold text-base leading-tight sm:hidden">AB-100 Prep</h1>
            <p className="text-slate-600 text-[10px] md:text-xs font-medium uppercase tracking-wider">Certification Standard • {session.config.mode === 'study' ? 'Study Mode' : 'Exam Mode'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 flex-wrap shrink-0 ml-auto">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:block">Remaining Time</span>
            <span className={cn(
              "text-sm md:text-2xl font-mono font-bold",
              session.timeRemaining < 300 ? "text-rose-600" : "text-slate-800"
            )}>
              {formatTime(session.timeRemaining)}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-slate-300/50 hidden md:block"></div>
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Progress</span>
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-lg font-bold text-slate-800">{session.currentQuestionIndex + 1}/{session.questions.length}</span>
              <div className="w-20 md:w-32 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: progressPercent + '%' }}></div>
              </div>
            </div>
          </div>
          <button onClick={() => setShowGrid(!showGrid)} className="flex items-center gap-1 md:gap-2 text-slate-600 hover:text-slate-800 lg:hidden p-1.5 md:p-2 rounded-lg bg-slate-100 border border-slate-200" title="Question Navigator">
             <LayoutGrid size={16} className="md:w-5 md:h-5" />
          </button>
          {session.config.mode === 'study' && (
             <button onClick={quitSession} className="text-xs md:text-sm font-bold px-2 py-1.5 md:px-3 md:py-2 text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all">Quit</button>
          )}
          <button onClick={handleEndQuiz} className="bg-sky-600 hover:bg-sky-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-xl font-bold transition-all text-xs md:text-sm shadow-md shrink-0">
             Finish
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 h-full overflow-hidden">
        
        <div className="flex-[2.5] flex flex-col gap-4 min-h-0 w-full overflow-hidden">
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col relative overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full border border-slate-200 mr-2 uppercase tracking-wide">
                    Question {session.currentQuestionIndex + 1}
                  </span>
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                    {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Use Case / Hotspot'}
                  </span>
               </div>
               
               {/* Mobile progress indicator since it's hidden in header */}
               <div className="md:hidden flex items-center gap-2">
                 <span className="text-sm font-bold text-slate-800">{session.currentQuestionIndex + 1}/{session.questions.length}</span>
                 <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                   <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: progressPercent + '%' }}></div>
                 </div>
               </div>
            </div>

            <QuestionDisplay 
              question={question} 
              value={localAnswer} 
              onChange={handleAnswerChange} 
              readonly={session.config.mode === 'study' && (answered || revealedAnswers[question.id])} // Freeze only in study mode
              showCorrectAnswers={showFeedback}
            />

            {showFeedback && (
              <div className={cn(
                "mt-8 p-6 rounded-2xl border-2 backdrop-blur-md",
                existingAnswerObj 
                  ? (existingAnswerObj.isCorrect ? "bg-emerald-50/80 border-emerald-200" : "bg-rose-50/80 border-rose-200")
                  : "bg-slate-50 border-slate-200"
              )}>
                 <div className="flex items-start gap-4">
                   {existingAnswerObj ? (
                     existingAnswerObj.isCorrect ? (
                       <CheckCircle2 className="text-emerald-600 shrink-0" size={28} />
                     ) : (
                       <XCircle className="text-rose-600 shrink-0" size={28} />
                     )
                   ) : (
                     <div className="w-7 h-7 rounded-full bg-slate-300 shrink-0 flex items-center justify-center text-slate-600 font-bold">i</div>
                   )}
                   <div>
                     {existingAnswerObj && (
                       <h3 className={cn(
                         "text-lg font-bold",
                         existingAnswerObj.isCorrect ? "text-emerald-800" : "text-rose-800"
                       )}>
                         {existingAnswerObj.isCorrect ? "Correct!" : "Incorrect"}
                       </h3>
                     )}
                     <div className={cn("text-slate-700 leading-relaxed font-medium", existingAnswerObj ? "mt-2" : "")}>
                       {question.explanation ? (
                          <div className="whitespace-pre-wrap">{question.explanation}</div>
                        ) : (
                          <div className="text-sm">
                            <span className="font-bold text-slate-800">Explanation & Answers:</span>
                            <ul className="list-disc pl-5 mt-1">
                               {(() => {
                                  if (question.type === 'multiple-choice') {
                                    const correctIds = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
                                    const correctTexts = correctIds.map(id => question.options?.find(o => o.id === id)?.text || id);
                                    return correctTexts.map((text, i) => <li key={i} className="text-slate-700 font-semibold">{text}</li>);
                                  } else if (question.type === 'hotspot' || question.type === 'drag-drop') {
                                    return Object.entries(question.correctAnswer).map(([label, val], i) => (
                                      <li key={i} className="text-slate-700">
                                        <span className="font-bold">{label}:</span> <span className="font-semibold">{val as string}</span>
                                      </li>
                                    ));
                                  }
                                  return null;
                               })()}
                            </ul>
                            <p className="mt-3 text-slate-500 italic">This is the expected correct selection for this scenario. Always verify with official documentation.</p>
                          </div>
                        )}
                     </div>
                   </div>
                 </div>
              </div>
            )}
            
            <div className="mt-auto pt-8 flex items-center justify-between gap-2">
               <button 
                 onClick={handlePrevious}
                 disabled={session.currentQuestionIndex === 0}
                 className="px-4 md:px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 transition-all disabled:opacity-50 text-sm md:text-base shrink-0"
               >
                 Prev
               </button>
               
                <div className="flex gap-2 md:gap-3 flex-wrap justify-end">
                  {session.config.mode === 'study' && !answered && (
                    <button 
                      onClick={toggleRevealAnswer}
                      className="px-4 md:px-6 py-2.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-300 shadow-sm active:scale-95 hover:bg-slate-50 transition-all text-sm md:text-base shrink-0"
                    >
                      {revealedAnswers[question.id] ? "Hide Answer" : "Show Answer"}
                    </button>
                  )}

                  <button 
                    onClick={handleNext}
                    className="px-6 md:px-8 py-2.5 rounded-xl font-bold bg-sky-600 text-white shadow-sm hover:bg-sky-700 active:scale-95 transition-all text-sm md:text-base shrink-0"
                  >
                    {session.currentQuestionIndex === session.questions.length - 1 ? (session.config.mode === 'exam' ? 'Submit' : 'Finish') : 'Next'}
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={cn(
          "flex-1 flex flex-col gap-4 min-w-[300px] overflow-hidden lg:flex transition-all",
           !showGrid && "hidden"
        )}>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col flex-1 min-h-[300px]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Question Navigator ({session.questions.length})</h3>
            <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 flex-1 overflow-y-auto pr-2 content-start">
              {session.questions.map((q, idx) => {
                const ans = session.answers[q.id];
                let bgCls = "bg-white border border-slate-200 text-slate-600";
                
                if (ans) {
                  if (session.config.mode === 'study') {
                    bgCls = ans.isCorrect ? "bg-emerald-500 text-white font-bold border-transparent" : "bg-rose-400 text-white font-bold border-transparent";
                  } else {
                    bgCls = "bg-sky-600 text-white font-bold border-transparent";
                  }
                } else if (session.config.mode === 'study' && pendingAnswers[q.id] !== undefined) {
                  bgCls = "bg-slate-200 text-slate-800 font-bold border-transparent";
                }
                const isCurrent = session.currentQuestionIndex === idx;
                
                return (
                  <button 
                    key={q.id}
                    onClick={() => handleJump(idx)}
                    className={cn(
                      "aspect-square rounded-[4px] text-[10px] font-bold flex items-center justify-center transition-all",
                      bgCls,
                      isCurrent && !ans && "border border-sky-600 bg-sky-50 text-sky-700 animate-pulse"
                    )}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            
            {session.config.mode === 'study' ? (
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div> Correct</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-400 rounded-full"></div> Wrong</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-white border border-slate-300 rounded-full"></div> Unvisited</div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-sky-600 rounded-full"></div> Answered</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-white border border-slate-300 rounded-full"></div> Unanswered</div>
              </div>
            )}
          </div>
          
          {/* Quick Analytics Block */}
          {session.config.mode === 'study' && (
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-sm shrink-0 flex flex-col text-white">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Session Stats</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-white">
                    {Object.values(session.answers).length}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Questions Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">
                    {Object.values(session.answers).filter(a => a.isCorrect).length}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Correct Answers</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
