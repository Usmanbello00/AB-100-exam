import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, BrainCircuit, ListTodo, Search } from 'lucide-react';
import allQuestions from '../data/questions.json';
import conceptsData from '../data/concepts.json';

interface StudyGuideScreenProps {
  onBack: () => void;
}

export function StudyGuideScreen({ onBack }: StudyGuideScreenProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'concepts'>('questions');
  const [activeTopic, setActiveTopic] = useState<string>('Topic 1');
  const [searchQuery, setSearchQuery] = useState('');

  const groupedQuestions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const q of allQuestions) {
      if (!groups[q.topic]) {
        groups[q.topic] = [];
      }
      groups[q.topic].push(q);
    }
    return groups;
  }, []);

  const topics = useMemo(() => Object.keys(groupedQuestions).sort(), [groupedQuestions]);

  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return conceptsData;
    const lowerQuery = searchQuery.toLowerCase();
    return conceptsData.filter(c => 
      c.concept.toLowerCase().includes(lowerQuery) || 
      c.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const renderCorrectAnswer = (question: any) => {
    if (question.type === 'multiple-choice') {
      if (Array.isArray(question.correctAnswer)) {
        return (
          <ul className="list-disc ml-5 mt-2 space-y-1 text-slate-700">
            {question.correctAnswer.map((ansId: string) => {
              const opt = question.options?.find((o: any) => o.id === ansId);
              return <li key={ansId} className="font-medium">{opt ? opt.text : ansId}</li>;
            })}
          </ul>
        );
      } else {
        const opt = question.options?.find((o: any) => o.id === question.correctAnswer);
        return <p className="font-medium text-slate-700 mt-2">{opt ? opt.text : question.correctAnswer}</p>;
      }
    } else if (question.type === 'drag-drop' || question.type === 'hotspot') {
      return (
        <div className="mt-2 space-y-2">
          {Object.entries(question.correctAnswer).map(([key, val]) => (
            <div key={key} className="flex flex-col text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium mb-1">{key}</span>
              <span className="text-slate-700 font-bold">{String(val)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <header className="w-full flex flex-col bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">Master Study Guide</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Exam AB-100 Reference</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center px-4 gap-6 border-t border-slate-100">
          <button 
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 py-4 px-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'questions' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <ListTodo size={18} />
            Questions & Answers
          </button>
          <button 
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center gap-2 py-4 px-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'concepts' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <BrainCircuit size={18} />
            Concepts & Explanations
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
          
          {activeTab === 'concepts' && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800">Key Concepts & Definitions</h2>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search concepts..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 min-w-[250px]"
                  />
                </div>
              </div>
              <div className="space-y-6">
                {filteredConcepts.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No concepts found matching "{searchQuery}"</p>
                ) : (
                  filteredConcepts.map((concept: any, idx) => (
                    <div key={idx} className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100 flex flex-col gap-3">
                      <h3 className="text-lg font-bold text-sky-900">{concept.concept}</h3>
                      <p className="text-slate-700 leading-relaxed font-medium">{concept.description}</p>
                      {concept.examClues && (
                        <div className="mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Exam Detection Clues</p>
                          <p className="text-emerald-900 text-sm font-medium">{concept.examClues}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                {topics.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTopic(t)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTopic === t ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    {t} <span className="ml-2 opacity-70 font-normal">({groupedQuestions[t].length})</span>
                  </button>
                ))}
              </div>
              
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-800">{activeTopic}</h2>
                  <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{groupedQuestions[activeTopic].length} Questions</span>
                </div>
                <div className="space-y-8">
                  {groupedQuestions[activeTopic].map((q, idx) => (
                    <div key={q.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-start gap-4">
                      <span className="bg-slate-200 text-slate-600 font-bold rounded-lg px-3 py-1 text-sm shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <div className="flex-1">
                        {q.context && (
                          <div className="mb-4 p-4 bg-slate-100 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Context / Scenario</p>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{q.context}</p>
                          </div>
                        )}
                        <p className="text-slate-800 font-medium whitespace-pre-wrap">{q.text}</p>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Correct Answer
                          </p>
                          {renderCorrectAnswer(q)}
                        </div>
                        {q.explanation && (
                          <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">Explanation</p>
                            <p className="text-sky-900 text-sm whitespace-pre-wrap leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
