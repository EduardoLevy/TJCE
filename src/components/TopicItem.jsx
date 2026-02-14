import React, { useState } from 'react';
import { Save, CheckCircle, Clock, Target } from 'lucide-react';

const TopicItem = ({ topic, subject, progress, registerStudySession }) => {
    const data = progress[topic.id] || {};
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState(60);
    const [qTotal, setQTotal] = useState(0);
    const [qCorrect, setQCorrect] = useState(0);

    const performance = data.totalQuestions > 0
        ? Math.round((data.correctQuestions / data.totalQuestions) * 100)
        : 0;

    return (
        <div className={`group transition-all duration-300 border-l-4 p-5 mb-4 rounded-xl shadow-sm bg-white hover:shadow-md ${data.studied ? 'border-green-500' : 'border-slate-200'}`}>
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-wider mb-1">{subject}</h4>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{topic.title}</h3>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3 font-medium">
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${data.studied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            <CheckCircle size={14} /> {data.studied ? 'Teoria Concluída' : 'Pendente'}
                        </span>
                        {data.totalQuestions > 0 && (
                            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${performance >= 80 ? 'bg-green-100 text-green-700' : performance >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                <Target size={14} /> {performance}% ({data.correctQuestions}/{data.totalQuestions})
                            </span>
                        )}
                        {data.timesStudied > 0 && (
                            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                                <Clock size={14} /> {data.timesStudied}x estudado
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`shrink-0 ml-4 p-2 rounded-xl transition-all ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg shadow-blue-600/20'}`}
                >
                    {isEditing ? <Clock size={20} /> : <Save size={20} />}
                </button>
            </div>

            {isEditing && (
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h5 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Registrar Nova Sessão</h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tempo (minutos)</label>
                            <input
                                type="number"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3 outline-none transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Total de Questões</label>
                            <input
                                type="number"
                                value={qTotal}
                                onChange={(e) => setQTotal(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3 outline-none transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Qtd. de Acertos</label>
                            <input
                                type="number"
                                value={qCorrect}
                                onChange={(e) => setQCorrect(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3 outline-none transition-all font-semibold"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all border border-transparent"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                registerStudySession(topic.id, topic.title, subject, minutes, qTotal, qCorrect);
                                setIsEditing(false);
                                setMinutes(60);
                                setQTotal(0);
                                setQCorrect(0);
                            }}
                            className="flex-[2] btn-primary flex justify-center items-center gap-2"
                        >
                            <Save size={18} /> Salvar & Agendar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopicItem;
