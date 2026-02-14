import React from 'react';
import { Award, BarChart3, PieChart, TrendingUp, HelpCircle } from 'lucide-react';
import { INITIAL_DATA } from '../data/syllabus';

const Stats = ({ progress }) => {
    // Calculate subject performance
    const subjectStats = Object.entries(INITIAL_DATA).map(([subject, topics]) => {
        let correct = 0;
        let total = 0;
        topics.forEach(t => {
            if (progress[t.id]) {
                correct += progress[t.id].correctQuestions || 0;
                total += progress[t.id].totalQuestions || 0;
            }
        });
        return { subject, correct, total, percent: total > 0 ? Math.round((correct / total) * 100) : 0 };
    }).sort((a, b) => b.percent - a.percent);

    const bestSubject = subjectStats[0];
    const worstSubject = subjectStats[subjectStats.length - 1];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Desempenho Geral</h2>
                    <p className="text-slate-500 font-medium">Análise detalhada de seus acertos por matéria.</p>
                </div>
                <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                    <BarChart3 size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6">
                    <div className="bg-emerald-50 p-5 rounded-2xl text-emerald-600 shrink-0">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Melhor Matéria</p>
                        <p className="text-slate-900 text-xl font-extrabold line-clamp-1">{bestSubject?.percent > 0 ? bestSubject.subject : "Sem dados"}</p>
                        {bestSubject?.percent > 0 && <span className="text-emerald-600 text-sm font-black">{bestSubject.percent}% de acertos</span>}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6">
                    <div className="bg-rose-50 p-5 rounded-2xl text-rose-600 shrink-0">
                        <PieChart size={32} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Atenção Necessária</p>
                        <p className="text-slate-900 text-xl font-extrabold line-clamp-1">{worstSubject?.total > 0 ? worstSubject.subject : "Sem dados"}</p>
                        {worstSubject?.total > 0 && <span className="text-rose-600 text-sm font-black">{worstSubject.percent}% de acertos</span>}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                    Porcentagem de Acertos
                </h3>
                <div className="space-y-6">
                    {subjectStats.map(stat => (
                        <div key={stat.subject} className="space-y-2">
                            <div className="flex justify-between items-end mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-700 tracking-tight">{stat.subject}</span>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{stat.correct}/{stat.total} qtas</span>
                                </div>
                                <span className={`text-lg font-black ${stat.percent >= 80 ? 'text-emerald-600' : stat.percent >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                                    {stat.percent}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${stat.percent >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : stat.percent >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-red-400'}`}
                                    style={{ width: `${stat.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-indigo-400">
                        <HelpCircle size={20} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Critérios da Prova Discursiva</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 shrink-0">
                                    <Award size={18} />
                                </div>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed">Apresentação, Estrutura e Tema (NC): Máximo de <span className="text-white font-bold">10,00 pontos</span>.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-rose-500/20 p-2 rounded-lg text-rose-400 shrink-0">
                                    <HelpCircle size={18} />
                                </div>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed">Cada erro gramatical (NE) deduz nota proporcionalmente.</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fórmula Oficial</p>
                            <p className="text-2xl font-black text-white tracking-widest mb-2">NPD = NC - 1 * (NE / TL)</p>
                            <p className="text-xs text-indigo-300 font-medium">Nota Mínima para Aprovação: <span className="text-white font-bold">6,00</span></p>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -top-20 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <BarChart3 size={300} />
                </div>
            </div>
        </div>
    );
};

export default Stats;
