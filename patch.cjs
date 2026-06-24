const fs = require('fs');
let c = fs.readFileSync('src/components/QuizScreen.tsx', 'utf8');
c = c.replace(
  `{question.explanation || "No explanation provided."}`,
  `{question.explanation ? (
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
                        )}`
);
fs.writeFileSync('src/components/QuizScreen.tsx', c);
