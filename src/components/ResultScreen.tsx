import React, { useMemo, useState } from 'react';
import { QuizSession } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, AlertTriangle, RefreshCcw, Home, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../utils';
import { QuestionDisplay } from './QuestionDisplay';

interface ResultScreenProps {
  session: QuizSession;
  onRestart: () => void;
  onHome: () => void;
}

export function ResultScreen({ session, onRestart, onHome }: ResultScreenProps) {
  const [showReview, setShowReview] = useState(false);
  
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    const topicStats: Record<string, { correct: number, total: number }> = {};

    session.questions.forEach(q => {
      const ans = session.answers[q.id];
      if (!ans) {
        unanswered++;
      } else if (ans.isCorrect) {
        correct++;
      } else {
        incorrect++;
      }

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0 };
      }
      topicStats[q.topic].total++;
      if (ans && ans.isCorrect) {
        topicStats[q.topic].correct++;
      }
    });

    const score = Math.round((correct / session.questions.length) * 100) || 0;
    const passed = score >= 70;

    return { correct, incorrect, unanswered, score, passed, topicStats };
  }, [session]);

  const pieData = [
    { name: 'Correct', value: stats.correct, color: '#10b981' },
    { name: 'Incorrect', value: stats.incorrect, color: '#f43f5e' },
    { name: 'Unanswered', value: stats.unanswered, color: '#cbd5e1' }
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex py-12 px-6 justify-center overflow-auto font-sans">
      <div className="max-w-4xl w-full">
        {/* Header Summary */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 mb-8 text-center relative overflow-hidden">
           <div className={cn(
             "absolute top-0 inset-x-0 h-4 border-b border-slate-100",
             stats.passed ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
           )} />
           <div className="flex justify-center mb-6 mt-4">
             {stats.passed ? (
                <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-200">
                  <Award size={48} />
                </div>
             ) : (
                <div className="h-24 w-24 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-lg border border-rose-200">
                  <AlertTriangle size={48} />
                </div>
             )}
           </div>
           
           <h1 className="text-4xl font-bold tracking-tight text-slate-800 mb-2">
             {stats.passed ? "Congratulations, you passed!" : "Score too low, keep practicing"}
           </h1>
           <p className="text-slate-600 mb-8 text-xl font-medium">
             You scored <span className={cn("font-bold text-3xl align-middle", stats.passed ? "text-emerald-600" : "text-rose-600")}>{stats.score}%</span>. 
             (Passing score is 70%)
           </p>

           <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
             <button onClick={onRestart} className="flex items-center gap-2 bg-sky-600 text-white px-5 sm:px-8 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-sm active:scale-95 text-sm sm:text-lg">
                <RefreshCcw size={18} className="sm:w-5 sm:h-5" /> Retake
             </button>
             <button onClick={() => setShowReview(!showReview)} className="flex items-center gap-2 bg-slate-800 text-white px-5 sm:px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-sm active:scale-95 text-sm sm:text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] sm:w-5 sm:h-5">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                {showReview ? "Hide Answers" : "Review Answers"}
             </button>
             <button onClick={onHome} className="flex items-center gap-2 bg-white text-slate-700 px-5 sm:px-8 py-3 rounded-xl font-bold border border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm sm:text-lg">
                <Home size={18} className="sm:w-5 sm:h-5" /> Home
             </button>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
           {/* Chart */}
           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
             <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-6">Performance Breakdown</h2>
             <div className="h-64 mb-6 flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={'cell-' + index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-around text-sm font-bold bg-slate-50 rounded-xl p-4 border border-slate-200">
               <div className="text-center">
                 <div className="text-2xl text-emerald-600">{stats.correct}</div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Correct</div>
               </div>
               <div className="text-center border-l border-r border-slate-200 w-full px-4">
                 <div className="text-2xl text-rose-600">{stats.incorrect}</div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Incorrect</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl text-slate-600">{stats.unanswered}</div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Skipped</div>
               </div>
             </div>
           </div>

           {/* Topic Breakdown */}
           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
             <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-6">Areas for Improvement</h2>
             <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                {Object.entries(stats.topicStats as Record<string, {correct: number, total: number}>).map(([topic, counts]) => {
                  const p = (counts.correct / counts.total) * 100;
                  return (
                    <div key={topic} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="font-bold text-slate-700 truncate mr-4">{topic}</span>
                        <span className={cn("font-bold text-lg shrink-0 leading-none", p >= 70 ? "text-emerald-600" : "text-rose-600")}>
                           {Math.round(p)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white border border-slate-200/50 w-full rounded-full overflow-hidden shadow-inner">
                         <div 
                           className={cn("h-full rounded-full shadow-sm", p >= 70 ? "bg-emerald-500" : "bg-rose-500")}
                           style={{ width: p + '%' }}
                         />
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-2">
                        {counts.correct} / {counts.total} correct
                      </div>
                    </div>
                  )
                })}
             </div>
           </div>
        </div>
        
        {showReview && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-6">Review Questions</h2>
            {session.questions.map((q, idx) => {
              const ans = session.answers[q.id];
              return (
                <div key={q.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg text-sm border border-slate-200">
                      Question {idx + 1}
                    </span>
                    {ans ? (
                      ans.isCorrect ? (
                        <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-lg text-sm border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 size={16} /> Correct
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-lg text-sm border border-rose-200 flex items-center gap-1.5">
                          <XCircle size={16} /> Incorrect
                        </span>
                      )
                    ) : (
                      <span className="bg-slate-50 text-slate-500 font-bold px-3 py-1 rounded-lg text-sm border border-slate-200 flex items-center gap-1.5">
                        Skipped
                      </span>
                    )}
                  </div>
                  <QuestionDisplay
                    question={q}
                    value={ans?.answer}
                    onChange={() => {}}
                    showCorrectAnswers={true}
                    readonly={true}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
