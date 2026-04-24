/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournals, useJournal } from '../hooks/useJournals';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, Save, Trash2, Wand2, X } from 'lucide-react';
import { Mood } from '../types';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addJournal, updateJournal, deleteJournal } = useJournals();
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
      navigate('/');
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

  const handleAiAnalysis = async () => {
    if (!content || !id) return;
    setAiProcessing(true);
    try {
      const [summary, moodData] = await Promise.all([
        geminiService.summarize(content),
        geminiService.detectMood(content)
      ]);
      
      if (summary || moodData) {
        await updateJournal(id, {
          summary: summary || undefined,
          mood: moodData?.mood || mood,
          moodEmoji: moods.find(m => m.type === moodData?.mood)?.emoji || '🔘',
          moodExplanation: moodData?.explanation,
          suggestion: moodData?.suggestion
        });
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-stone-50 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-400 hover:text-stone-800 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAiPanel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full font-semibold text-sm hover:bg-purple-100 transition-all"
          >
            <Sparkles size={16} />
            AI Assist
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || !title || !content}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-full font-semibold text-sm disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-3xl mx-auto p-8 md:pt-16">
        <div className="flex gap-3 overflow-x-auto mb-12 pb-2 scrollbar-none">
          {moods.map(m => (
            <button 
              key={m.type}
              onClick={() => setMood(m.type)}
              className={`flex-shrink-0 w-20 h-24 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all ${mood === m.type ? 'bg-brand text-white shadow-xl shadow-brand/10' : 'bg-brand-muted text-brand-text-muted border border-brand-border'}`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">{m.type}</span>
            </button>
          ))}
        </div>

        <input 
          type="text" 
          placeholder="A title for this moment..." 
          className="w-full text-5xl font-serif italic text-brand-dark border-none outline-none mb-12 placeholder:text-brand-muted"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea 
          ref={contentRef}
          placeholder="The light today was..."
          className="w-full h-[50vh] text-xl text-brand-text-body border-none outline-none resize-none leading-loose placeholder:text-brand-muted font-serif italic"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </main>

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
                <h2 className="text-xs font-bold uppercase tracking-widest">AI Assistant</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={handleAiContinue}
                  disabled={aiProcessing}
                  className="flex flex-col items-start p-8 bg-brand-muted/30 rounded-[32px] group hover:bg-brand-muted transition-all text-left border border-brand-border"
                >
                  <div className="p-4 bg-white rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm">
                    <Wand2 className="text-brand" size={24} />
                  </div>
                  <h3 className="font-serif italic text-lg text-brand-dark mb-2">Continue Writing</h3>
                  <p className="text-brand-text-body text-xs leading-relaxed">Let Ethos help you expand on your thoughts naturally and gracefully.</p>
                </button>

                <button 
                  onClick={handleAiAnalysis}
                  disabled={aiProcessing || !id}
                  className={`flex flex-col items-start p-8 bg-brand-muted/30 rounded-[32px] group hover:bg-brand-muted transition-all text-left border border-brand-border ${!id && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className="p-4 bg-white rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm">
                    <Sparkles className="text-brand" size={24} />
                  </div>
                  <h3 className="font-serif italic text-lg text-brand-dark mb-2">Detect & Summarize</h3>
                  <p className="text-brand-text-body text-xs leading-relaxed">Analyze the emotional resonance and distill the essence of your entry.</p>
                </button>
              </div>

              {aiProcessing && (
                <div className="mt-12 flex items-center justify-center gap-3 text-brand font-bold text-xs uppercase tracking-widest animate-pulse">
                  <Sparkles className="animate-spin" size={16} />
                  Gemini is reflecting...
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
