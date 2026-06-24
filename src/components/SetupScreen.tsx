import React, { useState } from 'react';
import { SessionConfig } from '../types';
import { BookOpen, GraduationCap, Clock, PieChart, ShieldCheck } from 'lucide-react';
import { cn } from '../utils';

interface SetupScreenProps {
  onStart: (config: SessionConfig) => void;
  onOpenStudyGuide?: () => void;
}

export function SetupScreen({ onStart, onOpenStudyGuide }: SetupScreenProps) {
  const [mode, setMode] = useState<SessionConfig['mode']>('study');
  const [questionCount, setQuestionCount] = useState<number>(30);

  const handleStart = () => {
    onStart({ mode, questionCount });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-6 text-slate-800">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        <header className="w-full flex items-center justify-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center flex-col mb-4">
          <div className="h-16 w-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 mb-4">
            Exam AB-100: Microsoft’s Agentic AI Business Solutions Architect certification
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Master the material with realistic scenarios, varied question formats, and detailed analytics. Configure your practice session below.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mode Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight mb-6">Select Assessment Mode</h2>
            <div className="space-y-4">
              <label className={cn(
                "flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all bg-white",
                mode === 'study' ? "border-sky-500 shadow-sm bg-sky-50" : "border-slate-200 hover:border-slate-400"
              )}>
                <input type="radio" name="mode" className="mt-1 accent-sky-600" checked={mode === 'study'} onChange={() => setMode('study')} />
                <div className="ml-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <BookOpen size={18} className={mode === 'study' ? "text-sky-600" : "text-slate-500"} />
                    Study Mode
                  </div>
                  <p className="text-sm text-slate-600 mt-1 font-medium">Instant feedback on each question. View explanations to deepen understanding.</p>
                </div>
              </label>

              <label className={cn(
                "flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all bg-white",
                mode === 'exam' ? "border-sky-500 shadow-sm bg-sky-50" : "border-slate-200 hover:border-slate-400"
              )}>
                <input type="radio" name="mode" className="mt-1 accent-sky-600" checked={mode === 'exam'} onChange={() => setMode('exam')} />
                <div className="ml-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <GraduationCap size={18} className={mode === 'exam' ? "text-sky-600" : "text-slate-500"} />
                    Exam Mode
                  </div>
                  <p className="text-sm text-slate-600 mt-1 font-medium">Timed simulation without instant feedback. Detailed results and scoring at the end.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
             <h2 className="text-xl font-bold tracking-tight mb-6">Number of Questions</h2>
             <div className="grid grid-cols-2 gap-4 flex-1">
               {[30, 60, 90, 110].map(count => (
                 <label key={count} className={cn(
                   "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all bg-white",
                   questionCount === count ? "border-sky-500 bg-sky-50 shadow-sm transform scale-[1.02]" : "border-slate-200 hover:border-slate-400"
                 )}>
                   <input type="radio" name="count" className="sr-only" checked={questionCount === count} onChange={() => setQuestionCount(count)} />
                   <span className={cn("text-3xl font-bold mb-1", questionCount === count ? "text-sky-600" : "text-slate-800")}>{count}</span>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions</span>
                 </label>
               ))}
             </div>
             <div className="mt-6 flex items-center justify-between text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 font-bold">
               <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-600" /> 
                  <span>Est. Time: {Math.round((questionCount * 120) / 60)} mins</span>
               </div>
               <div className="flex items-center gap-2">
                  <PieChart size={16} className="text-slate-600" />
                  <span>Pass mark: 70%</span>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={handleStart}
            className="px-10 py-4 rounded-2xl font-bold bg-sky-600 text-white shadow-sm hover:bg-sky-700 active:scale-95 text-lg transition-transform w-full sm:w-auto"
          >
            Start Session
          </button>
          {onOpenStudyGuide && (
            <button 
              onClick={onOpenStudyGuide}
              className="px-10 py-4 rounded-2xl font-bold bg-white text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200 active:scale-95 text-lg transition-transform w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              View Study Guide
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
