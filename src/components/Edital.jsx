import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import TopicItem from './TopicItem';
import { INITIAL_DATA } from '../data/syllabus';

const Edital = ({ progress, registerStudySession }) => {
    const [expandedSubjects, setExpandedSubjects] = useState({});

    const toggleSubject = (subject) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subject]: !prev[subject]
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edital Verticalizado</h2>
                    <p className="text-slate-500 font-medium">Controle seu progresso por cada tópico do edital.</p>
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                    <BookOpen size={24} />
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mb-8 flex gap-4 items-start shadow-sm">
                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-amber-900 leading-tight">Dica de Estudo</p>
                    <p className="text-sm text-amber-800 opacity-90 leading-relaxed font-medium">Marque aqui os tópicos ao finalizar a <b>teoria</b>. O sistema agendará automaticamente revisões em ciclos de 1, 3, 7, 15 e 30 dias para garantir a memorização.</p>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(INITIAL_DATA).map(([subject, topics]) => {
                    const completedCount = topics.filter(t => progress[t.id]?.studied).length;
                    const percent = Math.round((completedCount / topics.length) * 100);
                    const isExpanded = expandedSubjects[subject];

                    return (
                        <div key={subject} className={`bg-white rounded-3xl shadow-xl shadow-slate-200/40 border transition-all duration-300 ${isExpanded ? 'border-blue-200' : 'border-slate-100'}`}>
                            <button
                                onClick={() => toggleSubject(subject)}
                                className={`w-full flex justify-between items-center p-6 transition-all rounded-3xl ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex-1 text-left">
                                    <span className="font-black text-slate-800 text-lg tracking-tight block mb-1">{subject}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-full transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{percent}% Concluído</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-tighter">Status</span>
                                        <span className="text-sm font-black text-slate-700">{completedCount} de {topics.length}</span>
                                    </div>
                                    <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-blue-600 text-white rotate-180 shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="p-6 bg-white space-y-4 border-t border-slate-100 rounded-b-3xl">
                                    {topics.map(topic => (
                                        <TopicItem
                                            key={topic.id}
                                            topic={topic}
                                            subject={subject}
                                            progress={progress}
                                            registerStudySession={registerStudySession}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Edital;
