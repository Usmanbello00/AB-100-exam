import React from 'react';
import { Question } from '../types';
import { cn } from '../utils';

interface QuestionDisplayProps {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  readonly: boolean;
  showCorrectAnswers: boolean;
}

export function QuestionDisplay({ question, value, onChange, readonly, showCorrectAnswers }: QuestionDisplayProps) {
  
  if (question.type === 'multiple-choice') {
    const isMultiSelect = Array.isArray(question.correctAnswer);
    const selectedValues = isMultiSelect ? (Array.isArray(value) ? value : []) : (value || null);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-xl leading-relaxed text-slate-800 font-semibold mb-8">
          {question.text}
        </h3>
        {isMultiSelect && <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-widest">Select all that apply:</p>}
        
        <div className="space-y-3">
          {question.options?.map(opt => {
            const isSelected = isMultiSelect ? selectedValues.includes(opt.id) : value === opt.id;
            const isCorrect = showCorrectAnswers && (isMultiSelect ? question.correctAnswer.includes(opt.id) : question.correctAnswer === opt.id);
            const isWrongSelection = showCorrectAnswers && isSelected && !isCorrect;

            return (
              <label 
                key={opt.id}
                className={cn(
                  "flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer bg-white",
                  !readonly && isSelected ? "border-sky-600 bg-sky-50 shadow-sm" : (!readonly && "border-slate-200 hover:border-slate-400"),
                  readonly && !isCorrect && !isWrongSelection ? "border-slate-200 opacity-50 cursor-default bg-transparent" : "",
                  isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm" : "",
                  isWrongSelection ? "border-rose-500 bg-rose-50 text-rose-900 shadow-sm" : ""
                )}
              >
                <input 
                  type={isMultiSelect ? "checkbox" : "radio"} 
                  name={isMultiSelect ? `${question.id}-${opt.id}` : question.id} 
                  className="mt-1.5 accent-sky-600" 
                  disabled={readonly}
                  checked={isSelected}
                  onChange={() => {
                    if (!readonly) {
                      if (isMultiSelect) {
                        if (isSelected) {
                          onChange(selectedValues.filter((v: any) => v !== opt.id));
                        } else {
                          onChange([...selectedValues, opt.id]);
                        }
                      } else {
                        onChange(opt.id);
                      }
                    }
                  }} 
                />
                <span className="ml-4 font-semibold text-slate-700 leading-normal">{opt.text}</span>
              </label>
            )
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'hotspot') {
    const valObj = value || {};
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {question.context && (
           <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-800 shadow-sm">
             <h4 className="font-bold text-slate-900 mb-2">Scenario / Context:</h4>
             <p className="text-sm font-medium leading-relaxed">{question.context}</p>
           </div>
        )}
        <h3 className="text-xl leading-relaxed text-slate-800 font-semibold mb-8">
          {question.text}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-widest">Select the correct options below:</p>
        
        <div className="space-y-6">
          {question.hotspotAreas?.map(area => {
            const hVal = valObj[area.id] || '';
            const correctVal = question.correctAnswer[area.id];
            const isCorrect = showCorrectAnswers && hVal === correctVal;
            const isWrong = showCorrectAnswers && hVal !== correctVal;

            return (
              <div key={area.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="font-bold text-slate-800 mb-3 text-sm">{area.label}</div>
                 <select 
                   disabled={readonly}
                   value={hVal}
                   onChange={e => onChange({ ...valObj, [area.id]: e.target.value })}
                   className={cn(
                     "w-full p-3 rounded-lg border-2 bg-white font-semibold transition-colors focus:outline-none appearance-none cursor-pointer",
                     !readonly && "border-slate-300 hover:border-slate-400 focus:border-sky-600 text-slate-800",
                     isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900",
                     isWrong && "border-rose-500 bg-rose-50 text-rose-900"
                   )}
                 >
                   <option value="" disabled>Select an option...</option>
                   {area.options.map(opt => (
                     <option key={opt} value={opt}>{opt}</option>
                   ))}
                 </select>
                 {isWrong && (
                   <div className="mt-3 text-sm text-rose-600 font-bold bg-rose-50 border border-rose-200 inline-block px-3 py-1 rounded-md">
                     Correct Answer: {correctVal}
                   </div>
                 )}
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'drag-drop') {
    const valObj = value || {};
    
    // Very simple click-based assign for drag & drop
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

    const handleDrop = (zoneId: string) => {
      if (readonly || !selectedItem) return;
      onChange({ ...valObj, [zoneId]: selectedItem });
      setSelectedItem(null);
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {question.context && (
           <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-800 shadow-sm">
             <h4 className="font-bold text-slate-900 mb-2">Scenario / Context:</h4>
             <p className="text-sm font-medium leading-relaxed">{question.context}</p>
           </div>
        )}
        <h3 className="text-xl leading-relaxed text-slate-800 font-semibold mb-8">
          {question.text}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Options Bank */}
          <div>
            <h4 className="text-[10px] text-slate-500 mb-4 font-bold uppercase tracking-widest">Available Items</h4>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[200px] content-start shadow-inner">
               {question.dragItems?.map(item => {
                  const isUsed = Object.values(valObj).includes(item);
                  if (isUsed) return null; // hide used items
                  const isS = selectedItem === item;
                  return (
                    <button
                      key={item}
                      disabled={readonly}
                      onClick={() => setSelectedItem(isS ? null : item)}
                      className={cn(
                        "text-left px-5 py-2.5 rounded-lg border-2 font-bold text-sm transition-all shadow-sm",
                        isS ? "border-sky-600 bg-sky-600 text-white transform scale-[1.02]" : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                      )}
                    >
                      {item}
                    </button>
                  )
               })}
               {!readonly && !selectedItem && Object.keys(valObj).length < (question.dropZones?.length || 0) && (
                 <div className="w-full text-center p-4 text-slate-500 text-sm font-bold border-2 border-dashed border-slate-300 bg-slate-100 rounded-lg">
                   Click an item to select it, then click a target zone.
                 </div>
               )}
            </div>
          </div>

          {/* Drop Zones */}
          <div>
             <h4 className="text-[10px] text-slate-500 mb-4 font-bold uppercase tracking-widest">Target Areas</h4>
             <div className="space-y-4">
                {question.dropZones?.map(zone => {
                  const zVal = valObj[zone.id];
                  const correctVal = question.correctAnswer[zone.id];
                  const isCorrect = showCorrectAnswers && zVal === correctVal;
                  const isWrong = showCorrectAnswers && !!zVal && zVal !== correctVal;

                  return (
                    <div key={zone.id} className="flex flex-col gap-2">
                       <span className="font-bold text-slate-800 text-xs">{zone.label}</span>
                       <button
                         disabled={readonly && !zVal}
                         onClick={() => {
                           if (selectedItem) {
                             handleDrop(zone.id);
                           } else if (zVal && !readonly) {
                             // remove item
                             const newVal = { ...valObj };
                             delete newVal[zone.id];
                             onChange(newVal);
                           }
                         }}
                         className={cn(
                           "min-h-[50px] w-full px-5 py-3 rounded-xl border-2 text-left transition-all text-sm font-bold",
                           zVal ? "bg-white border-slate-200 text-slate-800 shadow-sm" : "bg-slate-50 border-dashed border-slate-300 text-slate-500 shadow-inner",
                           selectedItem && !zVal && "hover:border-slate-400 hover:bg-slate-100 cursor-pointer border-solid",
                           zVal && !readonly && "hover:border-rose-300 hover:bg-rose-50 cursor-pointer line-through decoration-rose-400 decoration-2",
                           isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900 border-solid",
                           isWrong && "border-rose-500 bg-rose-50 text-rose-900 border-solid"
                         )}
                       >
                         {zVal || "Click selected item here"}
                       </button>
                       {isWrong && (
                         <div className="mt-1 text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 inline-block self-start px-2 py-1 rounded">
                           Correct Answer: {correctVal}
                         </div>
                       )}
                    </div>
                  )
                })}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Unsupported question type.</div>;
}
