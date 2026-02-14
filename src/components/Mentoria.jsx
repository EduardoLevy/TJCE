import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    Calendar,
    Target,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Zap,
    X
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';

import { MENTORIA_DATA } from '../data/mentoria';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

const Mentoria = ({ completedDays, onToggleDay }) => {
    const [subTab, setSubTab] = useState('dashboard');
    const [currentCycle, setCurrentCycle] = useState(1);
    const [selectedDay, setSelectedDay] = useState(null);

    const progressPercent = useMemo(() => {
        const total = MENTORIA_DATA.schedule.length;
        const done = completedDays.length;
        return Math.round((done / total) * 100);
    }, [completedDays]);

    const currentDaySuggested = useMemo(() => {
        const firstIncomplete = MENTORIA_DATA.schedule.find(d => !completedDays.includes(d.day));
        return firstIncomplete ? firstIncomplete.day : 40;
    }, [completedDays]);

    const timeChartData = {
        labels: ['Matéria Nova (1.5h)', 'Questões (1h)', 'Revisão/Lei (0.5h)'],
        datasets: [{
            data: [90, 60, 30],
            backgroundColor: ['#2d3748', '#8da399', '#d97757'],
            borderWidth: 0
        }]
    };

    const priorityChartData = {
        labels: Object.keys(MENTORIA_DATA.priorityTopics),
        datasets: [{
            label: 'Tópicos "Top 5"',
            data: Object.values(MENTORIA_DATA.priorityTopics).map(arr => arr.length),
            backgroundColor: '#8da399',
            borderRadius: 8
        }]
    };

    return (
        <div className="fade-in pb-12">
            {/* Header / Sub-nav */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 italic">
                        PAINEL <span className="text-orange-600">TÁTICO</span>
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Mentoria Especializada • Reta Final</p>
                </div>

                <nav className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setSubTab('dashboard')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${subTab === 'dashboard' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <LayoutDashboard size={18} />
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setSubTab('cronograma')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${subTab === 'cronograma' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Calendar size={18} />
                        Cronograma
                    </button>
                    <button
                        onClick={() => setSubTab('radar')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${subTab === 'radar' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Target size={18} />
                        Radar
                    </button>
                </nav>
            </div>

            {/* DASHBOARD VIEW */}
            {subTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Progress */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Progresso do Plano</p>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-6xl font-black tracking-tighter text-slate-900 italic">{progressPercent}%</span>
                                    <span className="text-sm font-bold text-slate-400 uppercase pb-2">Conclúido</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-terracotta transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%`, backgroundColor: '#d97757' }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Baseado nos 40 dias de planejamento intensivo para o TJCE.
                            </p>
                        </div>

                        {/* Methodology */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Divisão do Tempo (3h Diárias)</p>
                            <div className="h-48">
                                <Doughnut
                                    data={timeChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'right', labels: { boxWidth: 10, font: { weight: 'bold', size: 10 } } }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Current Status */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-[28px] flex items-center justify-center text-3xl font-black italic mb-6 shadow-xl shadow-orange-600/10 border-2 border-orange-100/50">
                                {currentDaySuggested}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 italic">Dia Sugerido</h3>
                            <p className="text-sm text-slate-500 font-medium px-4">
                                {currentDaySuggested <= 10 ? 'Ciclo 1: Base das Matérias' :
                                    currentDaySuggested <= 20 ? 'Ciclo 2: Aprofundamento' :
                                        currentDaySuggested <= 30 ? 'Ciclo 3: Ajuste Fino' : 'Ciclo 4: Reta Final'}
                            </p>
                            <button
                                onClick={() => setSubTab('cronograma')}
                                className="mt-8 px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
                            >
                                Ver Hoje
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                            <Zap className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-black mb-6 italic flex items-center gap-2">
                                <Zap size={24} /> Regras de Ouro
                            </h3>
                            <ul className="space-y-4 text-sm font-medium text-blue-50">
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-xs font-black shrink-0">1</div>
                                    <p><strong>Matérias Dominadas:</strong> Nada de videoaula. Vá direto para questões e comentários.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-xs font-black shrink-0">2</div>
                                    <p><strong>Matérias Novas:</strong> Videoaula em 1.5x apenas para entender a lógica principal.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-xs font-black shrink-0">3</div>
                                    <p><strong>Redação:</strong> Treino sagrado aos domingos. É o que separa os aprovados.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-orange-500 rounded-[32px] p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group">
                            <AlertCircle className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-black mb-6 italic flex items-center gap-2">
                                <AlertCircle size={24} /> Radar FCC
                            </h3>
                            <p className="text-sm font-medium text-orange-50 leading-relaxed mb-8">
                                O conteúdo do <strong>Anexo 2 (Heron Lemos)</strong> indicou os assuntos mais quentes para este concurso. Tópicos no Radar merecem foco total.
                            </p>
                            <button
                                onClick={() => setSubTab('radar')}
                                className="px-8 py-3 bg-white text-orange-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-orange-50 transition-all active:scale-95"
                            >
                                Ver Prioritários
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CRONOGRAMA VIEW */}
            {subTab === 'cronograma' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        {[1, 2, 3, 4].map(c => (
                            <button
                                key={c}
                                onClick={() => setCurrentCycle(c)}
                                className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentCycle === c ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Ciclo {c} <span className="hidden md:inline">(Dia {(c - 1) * 10 + 1}-{c * 10})</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MENTORIA_DATA.schedule.filter(d => d.cycle === currentCycle).map(day => {
                            const isDone = completedDays.includes(day.day);
                            return (
                                <div
                                    key={day.day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`group p-6 rounded-[28px] border-2 transition-all cursor-pointer flex justify-between items-center ${isDone ? 'bg-green-50 border-green-200 shadow-sm shadow-green-200/20' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40'} ${day.isSunday ? 'ring-2 ring-purple-100' : ''}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center font-black leading-none italic text-lg transition-transform group-hover:scale-110 ${isDone ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-slate-100 text-slate-900 shadow-sm'}`}>
                                            {day.day}
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-sm uppercase tracking-tight italic ${isDone ? 'text-green-800' : 'text-slate-900'}`}>
                                                {day.isSunday ? 'Domingo Tático' : 'Plano de Estudo'}
                                            </h4>
                                            <p className={`text-xs font-bold truncate w-48 md:w-64 ${isDone ? 'text-green-600' : 'text-slate-400'}`}>
                                                {day.b1}
                                            </p>
                                        </div>
                                    </div>
                                    {isDone ? (
                                        <CheckCircle2 size={24} className="text-green-600 fill-green-50" />
                                    ) : (
                                        <ChevronRight size={20} className="text-slate-200 group-hover:text-slate-400" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* RADAR VIEW */}
            {subTab === 'radar' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-center min-h-[400px]">
                        <h3 className="text-xl font-black text-slate-900 mb-8 italic text-center uppercase tracking-tighter">Frequência por Disciplina</h3>
                        <div className="max-w-md mx-auto w-full">
                            <Bar
                                data={priorityChartData}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true, max: 6, grid: { color: '#f8fafc' } }, x: { grid: { display: false } } }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 overflow-y-auto max-h-[600px] custom-scroll">
                        <h3 className="text-xl font-black text-slate-900 mb-8 italic uppercase tracking-tighter">Assuntos "Top 5" FCC</h3>
                        <div className="space-y-8">
                            {Object.entries(MENTORIA_DATA.priorityTopics).map(([subject, topics]) => (
                                <div key={subject}>
                                    <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        {subject}
                                    </h4>
                                    <ul className="space-y-3">
                                        {topics.map(t => (
                                            <li key={t} className="flex items-center gap-4 text-sm font-bold text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {selectedDay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[48px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="bg-slate-900 p-10 text-white relative">
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="absolute right-8 top-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Plano de Ação</p>
                            <h3 className="text-4xl font-black italic tracking-tighter">Dia {selectedDay.day}</h3>
                        </div>

                        <div className="p-10 space-y-10">
                            {[
                                { time: '1h 30m', title: 'Matéria Nova / Foco', desc: selectedDay.b1, color: 'text-blue-600', bg: 'bg-blue-50', note: 'Videoaula em 1.5x + Grifos' },
                                { time: '1h 00m', title: 'Manutenção', desc: selectedDay.b2, color: 'text-indigo-600', bg: 'bg-indigo-50', note: 'Bateria de Questões ou Lei Seca' },
                                { time: '30 min', title: 'Revisão Turbo', desc: selectedDay.b3, color: 'text-orange-600', bg: 'bg-orange-50', note: 'Leitura de Erros ou Mapas Mentais' }
                            ].map((block, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-2">{block.time}</div>
                                        <div className="w-1 bg-slate-100 flex-1 rounded-full group-last:hidden"></div>
                                    </div>
                                    <div className="pb-4">
                                        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${block.color}`}>{block.title}</h4>
                                        <p className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2 italic">{block.desc}</p>
                                        <div className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${block.bg} ${block.color} border border-current/10`}>
                                            {block.note}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-10 pb-10 flex flex-col items-center">
                            <button
                                onClick={() => {
                                    onToggleDay(selectedDay.day);
                                    setSelectedDay(prev => ({ ...prev })); // Force re-render if needed
                                }}
                                className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl ${completedDays.includes(selectedDay.day) ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-slate-900 text-white shadow-slate-900/30'}`}
                            >
                                {completedDays.includes(selectedDay.day) ? (
                                    <> <CheckCircle2 size={24} /> Concluído com Sucesso </>
                                ) : (
                                    <> <Zap size={24} /> Finalizar Dia </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentoria;
