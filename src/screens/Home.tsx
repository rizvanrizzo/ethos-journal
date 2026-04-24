/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useJournals } from '../hooks/useJournals';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Plus, Search, LogOut, Filter, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Mood } from '../types';

export default function Home() {
  const { journals, loading } = useJournals();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | 'all'>('all');

  const filtered = journals.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                         j.content.toLowerCase().includes(search.toLowerCase());
    const matchesMood = selectedMood === 'all' || j.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const moods: { type: Mood; emoji: string }[] = [
    { type: 'peaceful', emoji: '🌿' },
    { type: 'reflective', emoji: '✨' },
    { type: 'excited', emoji: '🔥' },
    { type: 'tense', emoji: '⚡' },
    { type: 'gloomy', emoji: '☁️' },
    { type: 'neutral', emoji: '🔘' },
  ];

  const handleLogout = () => auth.signOut();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-brand-light pb-32">
      {/* Header */}
      <header className="px-6 pt-16 pb-8 sticky top-0 bg-brand-light/80 backdrop-blur-md z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-end mb-8">
          <div>
            <p className="label-caps mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
            <h1 className="text-4xl title-serif">{getTimeGreeting()}, {auth.currentUser?.email?.split('@')[0] || 'Soul'}.</h1>
          </div>
          <button onClick={handleLogout} className="p-3 bg-brand-muted rounded-2xl text-brand-text-muted hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search thoughts..."
              className="w-full pl-14 pr-6 py-4 bg-brand-muted border-none rounded-full shadow-sm focus:ring-1 focus:ring-brand outline-none transition-all placeholder-brand-text-muted"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button 
              onClick={() => setSelectedMood('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedMood === 'all' ? 'bg-brand text-white' : 'bg-white text-brand border border-brand-border'}`}
            >
              All Entries
            </button>
            {moods.map(m => (
              <button 
                key={m.type}
                onClick={() => setSelectedMood(m.type)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${selectedMood === m.type ? 'bg-brand text-white border-brand' : 'bg-white text-brand border border-brand-border'}`}
              >
                <span>{m.emoji}</span>
                <span>{m.type}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-brand-text-muted font-serif italic">Restoring memories...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-brand-muted/30 border-2 border-dashed border-brand-border rounded-[40px]">
            <div className="text-5xl mb-6 opacity-30">✍️</div>
            <p className="text-brand-text-muted italic title-serif">Quiet today. Maybe it's time to reflect?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((j, idx) => (
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
                    <span className="label-caps text-brand">
                      {format(j.createdAt, 'HH:mm a')}
                    </span>
                    <span className="text-[10px] text-brand-text-muted font-medium mt-1">
                      {format(j.createdAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-brand-light rounded-lg text-xs font-medium border border-brand-border">
                    {moods.find(m => m.type === j.mood)?.emoji} {j.mood}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-brand-dark mb-3 group-hover:text-brand transition-colors">{j.title}</h3>
                <p className="text-brand-text-body text-sm line-clamp-3 leading-relaxed mb-6 italic">{j.content}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-brand"></div>
                    <span className="text-[10px] text-brand-text-muted font-bold tracking-widest uppercase">Ethos AI</span>
                  </div>
                  {j.summary && (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-border"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
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
