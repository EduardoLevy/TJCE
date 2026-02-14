import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    BarChart2,
    Award,
    ChevronRight,
    LogOut,
    User,
    Cloud,
    Loader2,
    Zap
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Edital from './components/Edital';
import Stats from './components/Stats';
import Auth from './components/Auth';
import Mentoria from './components/Mentoria';
import { supabase } from './lib/supabase';
import { INITIAL_DATA, REVISION_INTERVALS } from './data/syllabus';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [progress, setProgress] = useState({});
    const [studyLog, setStudyLog] = useState([]);
    const [revisions, setRevisions] = useState([]);
    const [completedDays, setCompletedDays] = useState([]);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check for active session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) console.error('Supabase Session Error:', error);
            setSession(session);
            if (session) fetchUserData(session.user.id);
            else setLoading(false);
        }).catch(err => {
            console.error('Session Catch:', err);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchUserData(session.user.id);
            else {
                setProgress({});
                setStudyLog([]);
                setRevisions([]);
                setCompletedDays([]);
                setLoading(false);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        setLoading(true);
        try {
            // Fetch Progress
            const { data: progressData } = await supabase
                .from('topic_progress')
                .select('*')
                .eq('user_id', userId);

            const progressMap = {};
            progressData?.forEach(p => {
                progressMap[p.topic_id] = {
                    studied: p.studied,
                    lastStudied: p.last_studied,
                    totalQuestions: p.total_questions,
                    correctQuestions: p.correct_questions,
                    timesStudied: p.times_studied
                };
            });
            setProgress(progressMap);

            // Fetch Log
            const { data: logData } = await supabase
                .from('study_log')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });
            setStudyLog(logData || []);

            setRevisions((revisionData || []).map(r => ({
                id: r.id,
                topicId: r.topic_id,
                topicTitle: r.topic_title,
                subject: r.subject,
                dueDate: r.due_date,
                completed: r.completed,
                interval: r.interval
            })));

            // Fetch Mentoria Progress (Safe Fetch)
            try {
                const { data: mentoriaData, error: mError } = await supabase
                    .from('mentoria_progress')
                    .select('completed_days')
                    .eq('user_id', userId);

                if (!mError && mentoriaData && mentoriaData.length > 0) {
                    setCompletedDays(mentoriaData[0].completed_days || []);
                }
            } catch (mErr) {
                console.warn('Mentoria table might not exist yet:', mErr);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const registerStudySession = async (topicId, topicTitle, subject, minutes, questionsTotal, questionsCorrect) => {
        if (!session) return;
        const today = new Date().toISOString().split('T')[0];
        const userId = session.user.id;

        // 1. Update Progress in Supabase
        const currentProgress = progress[topicId] || {};
        const newProgress = {
            user_id: userId,
            topic_id: topicId,
            studied: true,
            last_studied: today,
            total_questions: (currentProgress.totalQuestions || 0) + parseInt(questionsTotal || 0),
            correct_questions: (currentProgress.correctQuestions || 0) + parseInt(questionsCorrect || 0),
            times_studied: (currentProgress.timesStudied || 0) + 1
        };

        const { error: pError } = await supabase
            .from('topic_progress')
            .upsert(newProgress, { onConflict: 'user_id,topic_id' });

        if (!pError) {
            setProgress(prev => ({
                ...prev,
                [topicId]: {
                    studied: true,
                    lastStudied: today,
                    totalQuestions: newProgress.total_questions,
                    correctQuestions: newProgress.correct_questions,
                    timesStudied: newProgress.times_studied
                }
            }));
        }

        // 2. Add to Study Log
        const newLogEntry = {
            user_id: userId,
            date: today,
            topic_id: topicId,
            topic_title: topicTitle,
            subject: subject,
            minutes: parseInt(minutes)
        };

        const { data: logData, error: lError } = await supabase
            .from('study_log')
            .insert(newLogEntry)
            .select();

        if (!lError && logData) {
            setStudyLog(prev => [logData[0], ...prev]);
        }

        // 3. Schedule Revisions
        const newRevisions = [];
        REVISION_INTERVALS.forEach(interval => {
            const revDate = new Date();
            revDate.setDate(revDate.getDate() + interval);
            newRevisions.push({
                user_id: userId,
                topic_id: topicId,
                topic_title: topicTitle,
                subject,
                due_date: revDate.toISOString().split('T')[0],
                completed: false,
                interval: interval
            });
        });

        // Remove old pending revisions for same topic and insert new ones
        await supabase.from('revisions').delete().eq('user_id', userId).eq('topic_id', topicId).eq('completed', false);
        const { data: revData, error: rError } = await supabase.from('revisions').insert(newRevisions).select();

        if (!rError && revData) {
            setRevisions(prev => {
                const filtered = prev.filter(r => r.topicId !== topicId || r.completed);
                return [...filtered, ...revData.map(r => ({
                    id: r.id,
                    topicId: r.topic_id,
                    topicTitle: r.topic_title,
                    subject: r.subject,
                    dueDate: r.due_date,
                    completed: r.completed,
                    interval: r.interval
                }))];
            });
        }
    };

    const completeRevision = async (revId) => {
        if (!session) return;
        const { error } = await supabase
            .from('revisions')
            .update({ completed: true })
            .eq('id', revId);

        if (!error) {
            setRevisions(prev => prev.map(r => r.id === revId ? { ...r, completed: true } : r));
        }
    };

    const toggleMentoriaDay = async (day) => {
        if (!session) return;
        const userId = session.user.id;
        let newCompletedDays;

        if (completedDays.includes(day)) {
            newCompletedDays = completedDays.filter(d => d !== day);
        } else {
            newCompletedDays = [...completedDays, day];
        }

        const { error } = await supabase
            .from('mentoria_progress')
            .upsert({ user_id: userId, completed_days: newCompletedDays }, { onConflict: 'user_id' });

        if (!error) {
            setCompletedDays(newCompletedDays);
        } else {
            console.error('Error updating mentoria progress:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 size={40} className="text-blue-600 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando Nuvem...</p>
            </div>
        );
    }

    if (!session) {
        if (!supabase) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
                    <div className="max-w-md bg-white p-10 rounded-[32px] shadow-2xl border border-red-100">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Cloud size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Configuração Pendente</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            As chaves do Supabase não foram encontradas. Isso acontece porque:<br />
                            <span className="font-bold text-slate-700">1. Local:</span> O arquivo <code className="bg-slate-100 px-2 rounded">.env</code> não foi lido.<br />
                            <span className="font-bold text-slate-700">2. Vercel:</span> Você esqueceu de adicionar as variáveis de ambiente no painel da Vercel.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-2xl text-left font-mono text-[10px] space-y-1 mb-6 border border-slate-200">
                            <p className="text-blue-600 font-bold">VITE_SUPABASE_URL</p>
                            <p className="text-blue-600 font-bold">VITE_SUPABASE_ANON_KEY</p>
                        </div>
                        <p className="text-xs text-slate-400 font-medium italic">
                            Adicione estas chaves e reinicie o servidor/deploy.
                        </p>
                    </div>
                </div>
            );
        }
        return <Auth />;
    }

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
                        <button
                            onClick={() => setActiveTab('mentoria')}
                            className={`nav-item w-full group ${activeTab === 'mentoria' ? 'nav-item-active' : 'nav-item-inactive'}`}
                        >
                            <Zap size={22} className={activeTab === 'mentoria' ? 'text-white' : 'group-hover:text-orange-400 transition-colors'} />
                            <span className="font-bold tracking-tight">Mentoria</span>
                            {activeTab === 'mentoria' && <ChevronRight size={16} className="ml-auto opacity-50" />}
                        </button>

                        <div className="pt-8 mt-8 border-t border-slate-800/50 space-y-1">
                            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Minha Conta</p>
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/30 rounded-2xl border border-slate-700/20 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                    <User size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{session.user.email.split('@')[0]}</p>
                                    <div className="flex items-center gap-1">
                                        <Cloud size={10} className="text-blue-400" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Nuvem Ativa</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="nav-item w-full group nav-item-inactive hover:bg-red-500/10 hover:text-red-400 transition-all"
                            >
                                <LogOut size={22} className="group-hover:text-red-400 transition-colors" />
                                <span className="font-bold tracking-tight">Sair da Conta</span>
                            </button>
                        </div>
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
                {activeTab === 'mentoria' && (
                    <Mentoria
                        completedDays={completedDays}
                        onToggleDay={toggleMentoriaDay}
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
                <button onClick={() => setActiveTab('mentoria')} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${activeTab === 'mentoria' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40 scale-110 -translate-y-2' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Zap size={24} />
                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Mentor</span>
                </button>
                <button onClick={handleLogout} className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl text-slate-500 hover:text-red-400 transition-all">
                    <LogOut size={24} />
                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Sair</span>
                </button>
            </nav>
        </div>
    );
}

export default App;
