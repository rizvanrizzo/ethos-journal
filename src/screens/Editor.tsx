/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournals, useJournal } from '../hooks/useJournals';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, Save, Settings, Wand2, X, BrainCircuit } from 'lucide-react';
import { format } from 'date-fns';
import { Mood } from '../types';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addJournal, updateJournal } = useJournals();
  const { journal, loading: loadingJournal } = useJournal(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [saving, setSaving] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (journal) {
      setTitle(journal.title);
      setContent(journal.content);
      setMood(journal.mood);
    }
  }, [journal]);

  const moods: { type: Mood; emoji: string }[] = [
    { type: 'peaceful', emoji: '🌿' },
    { type: 'reflective', emoji: '✨' },
    { type: 'excited', emoji: '🔥' },
    { type: 'tense', emoji: '⚡' },
    { type: 'gloomy', emoji: '☁️' },
    { type: 'neutral', emoji: '🔘' },
  ];

  const handleSave = async () => {
    if (!title || !content) return;
    setSaving(true);
    try {
      const emoji = moods.find(m => m.type === mood)?.emoji || '🔘';
      if (id) {
        await updateJournal(id, { title, content, mood, moodEmoji: emoji });
      } else {
        await addJournal(title, content, mood, emoji);
      }
      navigate('/', { replace: true });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAiContinue = async () => {
    if (!content) return;
    setAiProcessing(true);
    try {
      const result = await geminiService.continueWriting(content);
      if (result) {
        setContent(prev => prev + '\n\n' + result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiProcessing(false);
      setShowAiPanel(false);
    }
  };

  if (id && loadingJournal) return null;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center p-2.5">
                <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/test-account.png" alt="user" className="w-full h-full opacity-80" />
            </div>
            <h2 className="font-bold text-[#1F2133] text-lg">Sanctuary</h2>
        </div>
        
        <div className="flex items-center gap-4">
            <Settings className="text-[#8E91B2]" size={22} />
            <button 
                onClick={handleSave}
                disabled={saving || !title || !content}
                className="px-6 py-2 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 disabled:opacity-50 transition-all"
            >
                {saving ? '...' : 'Save'}
            </button>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 overflow-y-auto px-8 py-10 pb-32">
        <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E91B2]">
                    {format(new Date(), 'EEEE, MMMM d')}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Reflection
                </span>
            </div>

            <input 
                type="text" 
                placeholder="Untitled Entry" 
                className="w-full text-4xl font-bold text-[#1F2133] border-none outline-none mb-8 placeholder:text-[#E5E9FF]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea 
                ref={contentRef}
                placeholder="Begin your reflection here..."
                className="w-full h-[60vh] text-lg text-[#4A4D70] border-none outline-none resize-none leading-relaxed placeholder:text-[#8E91B2] font-medium"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
      </main>

      {/* Floating Assistant Trigger */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
        <button 
            onClick={() => setShowAiPanel(true)}
            className="w-full bg-[#E5E9FF]/40 backdrop-blur-xl border border-white/50 p-4 rounded-3xl flex items-center justify-between group overflow-hidden relative"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-brand text-white rounded-2xl shadow-lg shadow-brand/20">
                    <BrainCircuit size={20} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand opacity-80">Assistant</p>
                    <p className="text-sm font-bold text-[#1F2133]">Deepen this thought</p>
                </div>
            </div>
            
            {/* Pulsing glow */}
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-brand/10 blur-xl rounded-full" />
        </button>
      </div>

      {/* AI Panel Bottom Sheet */}
      <AnimatePresence>
        {showAiPanel && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiPanel(false)}
              className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[48px] p-10 z-50 shadow-2xl border-t border-brand-border"
            >
              <div className="w-16 h-1 bg-brand-muted rounded-full mx-auto mb-10" />
              <div className="flex items-center gap-3 mb-10">
                <div className="w-2 h-2 rounded-full bg-brand"></div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#1F2133]">Assistant Actions</h2>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleAiContinue}
                  disabled={aiProcessing}
                  className="w-full flex items-center gap-5 p-6 bg-brand-muted/30 rounded-[32px] group hover:bg-brand-muted transition-all text-left"
                >
                  <div className="p-4 bg-white rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                    <Wand2 className="text-brand" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#1F2133]">Continue Writing</h3>
                    <p className="text-[#8E91B2] text-xs">Let Sanctuary expand on your thoughts naturally.</p>
                  </div>
                </button>
              </div>

              {aiProcessing && (
                <div className="mt-12 flex items-center justify-center gap-3 text-brand font-bold text-xs uppercase tracking-widest animate-pulse">
                  <Sparkles className="animate-spin" size={16} />
                  Reflecting...
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
