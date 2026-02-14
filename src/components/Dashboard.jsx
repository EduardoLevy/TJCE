import React from 'react';
import { Target, Clock, CheckCircle, Award, TrendingUp, Calendar } from 'lucide-react';
import { DAILY_GOAL_MINUTES } from '../data/syllabus';

const Dashboard = ({ getTodayMinutes, getDueRevisions, completeRevision, getTotalProgress }) => {
    const todayMinutes = getTodayMinutes();
    const progressPercent = (todayMinutes / DAILY_GOAL_MINUTES) * 100;
    const dueRevisions = getDueRevisions();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Goal Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Target className="text-rose-500" size={16} /> Meta Diária
                            </h2>
                            <p className="text-2xl font-extrabold text-slate-800">Seu Progresso de Hoje</p>
                        </div>
                        <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-4">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-4xl font-black text-slate-900">
                                {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
                            </span>
                            <span className="text-slate-400 font-bold mb-1">/ 3h 00m</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-rose-500/20"
                                style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-slate-500 text-sm mt-4 font-medium italic text-center">
                            {progressPercent >= 100 ? "Incrível! Você superou sua meta hoje! 🚀" : "Cada minuto conta. Mantenha o foco e a constância!"}
                        </p>
                    </div>
                </div>

                {/* Stats Summary Area */}
                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-200/50 text-white relative overflow-hidden group">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Award size={18} /> Conclusão do Edital
                                </h3>
                                <p className="text-5xl font-black tracking-tighter">{getTotalProgress()}%</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                <TrendingUp size={32} />
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Award size={180} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6">
                        <div className="bg-emerald-50 p-5 rounded-2xl text-emerald-600">
                            <Calendar size={32} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status de Estudo</p>
                            <p className="text-slate-900 text-xl font-extrabold line-clamp-1">Firme nos Objetivos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revisions Section */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        Revisões Prioritárias
                    </h2>
                    <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        {dueRevisions.length} Pendentes
                    </span>
                </div>

                {dueRevisions.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-lg shadow-emerald-500/10">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Tudo em Dia!</h3>
                        <p className="text-slate-500 font-medium">Você concluiu todas as revisões agendadas para hoje.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dueRevisions.map(rev => (
                            <div key={rev.id} className="group flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                                <div className="flex-1 mr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{rev.subject}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-slate-400 opacity-80 uppercase">{rev.interval} dias</span>
                                    </div>
                                    <p className="text-slate-900 font-bold leading-tight line-clamp-1">{rev.topicTitle}</p>
                                </div>
                                <button
                                    onClick={() => completeRevision(rev.id)}
                                    className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all border border-slate-100 group-hover:border-transparent"
                                    title="Marcar como revisado"
                                >
                                    <CheckCircle size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
