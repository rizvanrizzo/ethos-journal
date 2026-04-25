/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useJournals } from '../hooks/useJournals';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Plus, Search, LogOut, Settings, Book, Sparkles, LineChart, Library, Moon, CloudRain, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Mood } from '../types';

export default function Home() {
  const { user } = useAuth();
  const { journals, loading } = useJournals();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'journal' | 'assistant' | 'insights' | 'library'>('journal');

  const isGuest = !user || user.uid === 'anonymous-guest-user';
  const userName = user?.email?.split('@')[0] || 'Soul';

  const moods: { type: Mood; emoji: string; icon?: React.ReactNode }[] = [
    { type: 'peaceful', emoji: '🌿', icon: <Moon size={16} /> },
    { type: 'reflective', emoji: '✨' },
    { type: 'excited', emoji: '🔥' },
    { type: 'tense', emoji: '⚡' },
    { type: 'gloomy', emoji: '☁️', icon: <CloudRain size={16} /> },
    { type: 'neutral', emoji: '🔘' },
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth', { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full bg-brand-light overflow-y-auto scrollbar-none pb-40">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 sticky top-0 bg-brand-light/80 backdrop-blur-xl z-40">
        <div className="max-w-xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center p-2.5">
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/test-account.png" alt="user" className="w-full h-full opacity-80" />
                </div>
                <h2 className="font-bold text-[#1F2133] text-lg">Sanctuary</h2>
            </div>
            <button className="text-[#8C9EFF]">
                <Settings size={22} />
            </button>
        </div>
      </header>

      <main className="px-6 max-w-xl mx-auto">
        {/* Personlized Greeting */}
        <section className="mt-8 mb-10">
            <h1 className="text-4xl font-bold text-[#1F2133] mb-2">{getTimeGreeting()}, {userName}</h1>
            <p className="text-[#8E91B2] font-medium">Your sanctuary is ready for your thoughts.</p>
        </section>

        {/* AI Insight Card */}
        <section className="mb-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="insight-card"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#1A1C3E] rounded-lg text-white">
                        <Sparkles size={14} />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#1F2133] opacity-80">Evening Reflection</span>
                </div>
                <p className="text-brand text-lg font-serif italic italic leading-relaxed">
                    "You've recorded three entries about focus this week. Perhaps tonight is a good time to reflect on what clarity feels like for you?"
                </p>
                
                {/* Subtle cosmic background flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl -z-10 rounded-full" />
            </motion.div>
        </section>

        {/* Entry List */}
        <section className="space-y-6">
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-pulse text-brand font-serif italic">Restoring memories...</div>
                </div>
            ) : journals.length === 0 ? (
                <div className="text-center py-24 bg-brand-muted/30 border-2 border-dashed border-brand-border rounded-[40px]">
                    <p className="text-brand-text-muted italic title-serif">Quiet today. Maybe it's time to reflect?</p>
                </div>
            ) : (
                journals.map((j, idx) => (
                    <motion.div
                        key={j.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate(`/journal/${j.id}`)}
                        className="journal-card group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col">
                                <span className="label-caps text-brand-text-muted">
                                    {format(j.createdAt, 'MMMM d, yyyy')}
                                </span>
                            </div>
                            <span className="text-2xl">
                                {j.moodEmoji || moods.find(m => m.type === j.mood)?.emoji}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#1F2133] mb-3 group-hover:text-brand transition-colors">
                            {j.title}
                        </h3>
                        <p className="text-brand-text-body text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
                            {j.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-brand-muted text-brand-text-muted text-[10px] font-bold rounded-full">#Peaceful</span>
                            <span className="px-3 py-1 bg-brand-muted text-brand-text-muted text-[10px] font-bold rounded-full">#Morning</span>
                        </div>
                    </motion.div>
                ))
            )}
        </section>
      </main>

      {/* Persistent Bottom Nav Bar */}
      <nav className="glass-nav">
          <button 
            onClick={() => setActiveTab('journal')}
            className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'journal' ? 'nav-item-active' : 'text-brand-text-muted'}`}
          >
              <Book size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Journal</span>
          </button>
          <button 
            onClick={() => setActiveTab('assistant')}
            className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'assistant' ? 'nav-item-active' : 'text-brand-text-muted'}`}
          >
              <Sparkles size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Assistant</span>
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'insights' ? 'nav-item-active' : 'text-brand-text-muted'}`}
          >
              <LineChart size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Insights</span>
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'library' ? 'nav-item-active' : 'text-brand-text-muted'}`}
          >
              <Library size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Library</span>
          </button>
      </nav>

      {/* FAB - Adjusted position to be above nav */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/new')}
        className="fab"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
}
