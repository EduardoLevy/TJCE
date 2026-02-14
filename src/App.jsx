import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    BarChart2,
    Award,
    ChevronRight
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Edital from './components/Edital';
import Stats from './components/Stats';
import { INITIAL_DATA, REVISION_INTERVALS } from './data/syllabus';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [progress, setProgress] = useState({});
    const [studyLog, setStudyLog] = useState([]);
    const [revisions, setRevisions] = useState([]);

    // Load data from local storage
    useEffect(() => {
        const savedProgress = localStorage.getItem('tjce_progress');
        const savedLog = localStorage.getItem('tjce_log');
        const savedRevisions = localStorage.getItem('tjce_revisions');

        if (savedProgress) setProgress(JSON.parse(savedProgress));
        if (savedLog) setStudyLog(JSON.parse(savedLog));
        if (savedRevisions) setRevisions(JSON.parse(savedRevisions));
    }, []);

    // Save data to local storage
    useEffect(() => {
        localStorage.setItem('tjce_progress', JSON.stringify(progress));
        localStorage.setItem('tjce_log', JSON.stringify(studyLog));
        localStorage.setItem('tjce_revisions', JSON.stringify(revisions));
    }, [progress, studyLog, revisions]);

    const registerStudySession = (topicId, topicTitle, subject, minutes, questionsTotal, questionsCorrect) => {
        const today = new Date().toISOString().split('T')[0];

        // 1. Update Progress stats for the topic
        setProgress(prev => ({
            ...prev,
            [topicId]: {
                studied: true,
                lastStudied: today,
                totalQuestions: (prev[topicId]?.totalQuestions || 0) + parseInt(questionsTotal || 0),
                correctQuestions: (prev[topicId]?.correctQuestions || 0) + parseInt(questionsCorrect || 0),
                timesStudied: (prev[topicId]?.timesStudied || 0) + 1
            }
        }));

        // 2. Add to Study Log (for daily goal tracking)
        setStudyLog(prev => [...prev, {
            id: Date.now(),
            date: today,
            topicId,
            topicTitle,
            subject,
            minutes: parseInt(minutes)
        }]);

        // 3. Schedule Revisions (Spaced Repetition)
        const newRevisions = [];
        REVISION_INTERVALS.forEach(interval => {
            const revDate = new Date();
            revDate.setDate(revDate.getDate() + interval);
            newRevisions.push({
                id: Date.now() + interval,
                topicId,
                topicTitle,
                subject,
                dueDate: revDate.toISOString().split('T')[0],
                completed: false,
                interval: interval
            });
        });

        setRevisions(prev => {
            const filtered = prev.filter(r => r.topicId !== topicId || r.completed);
            return [...filtered, ...newRevisions];
        });

        // Custom success message could be added here instead of standard alert for "Wow" factor
    };

    const completeRevision = (revId) => {
        setRevisions(prev => prev.map(r => r.id === revId ? { ...r, completed: true } : r));
    };

    const getTodayMinutes = () => {
        const today = new Date().toISOString().split('T')[0];
        return studyLog
            .filter(l => l.date === today)
            .reduce((acc, curr) => acc + curr.minutes, 0);
    };

    const getDueRevisions = () => {
        const today = new Date().toISOString().split('T')[0];
        return revisions
            .filter(r => !r.completed && r.dueDate <= today)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    };

    const getTotalProgress = () => {
        const totalTopics = Object.values(INITIAL_DATA).flat().length;
        const studiedTopics = Object.values(progress).filter(p => p.studied).length;
        return Math.round((studiedTopics / totalTopics) * 100);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-28 md:pb-0 md:pl-72">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-white fixed h-full left-0 top-0 overflow-y-auto border-r border-slate-800 shadow-2xl z-20">
                <div className="p-10">
                    <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
                        TJCE
                        <span className="text-slate-500 text-[10px] block font-black mt-2 uppercase tracking-[0.3em] not-italic">Técnico Judiciário</span>
                    </h1>
                </div>

                <nav className="flex-1 px-6 space-y-4">
                    <div className="space-y-1">
                        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Menu Principal</p>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`nav-item w-full group ${activeTab === 'dashboard' ? 'nav-item-active' : 'nav-item-inactive'}`}
                        >
                            <BarChart2 size={22} className={activeTab === 'dashboard' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
                            <span className="font-bold tracking-tight">Dashboard</span>
                            {activeTab === 'dashboard' && <ChevronRight size={16} className="ml-auto opacity-50" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('edital')}
                            className={`nav-item w-full group ${activeTab === 'edital' ? 'nav-item-active' : 'nav-item-inactive'}`}
                        >
                            <BookOpen size={22} className={activeTab === 'edital' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
                            <span className="font-bold tracking-tight">Edital</span>
                            {activeTab === 'edital' && <ChevronRight size={16} className="ml-auto opacity-50" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`nav-item w-full group ${activeTab === 'stats' ? 'nav-item-active' : 'nav-item-inactive'}`}
                        >
                            <Award size={22} className={activeTab === 'stats' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
                            <span className="font-bold tracking-tight">Desempenho</span>
                            {activeTab === 'stats' && <ChevronRight size={16} className="ml-auto opacity-50" />}
                        </button>
                    </div>
                </nav>

                <div className="p-8 border-t border-slate-800/50">
                    <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-center">Versão Atualizada</p>
                        <p className="text-xs text-slate-300 text-center font-medium">Edital de Técnico Judiciário TJCE</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900/90 backdrop-blur-xl text-white p-6 sticky top-0 z-30 shadow-2xl border-b border-slate-800 flex justify-between items-center">
                <h1 className="font-black text-2xl tracking-tighter italic bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">TJCE</h1>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-400/30 font-black px-3 py-1 rounded-full uppercase tracking-wider">Técnico</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-6 md:p-12 max-w-6xl mx-auto">
                {activeTab === 'dashboard' && (
                    <Dashboard
                        getTodayMinutes={getTodayMinutes}
                        getDueRevisions={getDueRevisions}
                        completeRevision={completeRevision}
                        getTotalProgress={getTotalProgress}
                    />
                )}
                {activeTab === 'edital' && (
                    <Edital
                        progress={progress}
                        registerStudySession={registerStudySession}
                    />
                )}
                {activeTab === 'stats' && (
                    <Stats
                        progress={progress}
                    />
                )}
            </main>

            {/* Mobile Nav */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 flex justify-around items-center px-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110 -translate-y-2' : 'text-slate-500 hover:text-slate-300'}`}>
                    <BarChart2 size={24} />
                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Início</span>
                </button>
                <button onClick={() => setActiveTab('edital')} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${activeTab === 'edital' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110 -translate-y-2' : 'text-slate-500 hover:text-slate-300'}`}>
                    <BookOpen size={24} />
                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Edital</span>
                </button>
                <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110 -translate-y-2' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Award size={24} />
                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Estatísticas</span>
                </button>
            </nav>
        </div>
    );
}

export default App;
