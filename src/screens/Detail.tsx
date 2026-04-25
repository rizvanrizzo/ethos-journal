/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournal, useJournals } from '../hooks/useJournals';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Edit3, Trash2, Sparkles, Smile, Share2, Lightbulb, Book, LineChart, Library } from 'lucide-react';
import { format } from 'date-fns';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journal, loading } = useJournal(id);
  const { deleteJournal } = useJournals();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'journal' | 'assistant' | 'insights' | 'library'>('journal');

  const handleDelete = async () => {
    if (id) {
      await deleteJournal(id);
      navigate('/', { replace: true });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="animate-pulse text-brand font-serif italic">Recalling moment...</div>
    </div>
  );

  if (!journal) return <div className="p-10 text-center">Entry not found.</div>;

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-none pb-40">
      {/* Header Actions */}
      <header className="px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <button onClick={() => navigate('/')} className="p-3 text-[#1F2133] hover:bg-brand-muted rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1F2133] px-2">Sanctuary</h2>
        </div>
        <div className="flex gap-1">
          <button className="p-3 text-[#8E91B2] hover:text-brand transition-colors">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => navigate(`/edit/${id}`)}
            className="p-3 text-[#8E91B2] hover:text-brand transition-colors"
          >
            <Edit3 size={20} />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-3 text-[#8E91B2] hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-brand-muted text-brand text-[10px] font-bold uppercase tracking-widest rounded-md">Morning Reflection</span>
            <span className="text-[10px] font-bold text-[#8E91B2] uppercase tracking-widest">{format(journal.createdAt, 'MMMM d, yyyy')}</span>
        </div>

        <h1 className="text-4xl font-bold text-[#1F2133] leading-[1.1] mb-6">
            {journal.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-10">
            <span className="px-3 py-1 bg-brand-muted text-brand-text-muted text-[10px] font-bold rounded-full">#mindfulness</span>
            <span className="px-3 py-1 bg-brand-muted text-brand-text-muted text-[10px] font-bold rounded-full">#nature</span>
            <span className="px-3 py-1 bg-brand-muted text-brand-text-muted text-[10px] font-bold rounded-full">#clarity</span>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] rounded-[32px] overflow-hidden mb-10 shadow-lg shadow-brand/10">
            <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop" 
                alt="nature" 
                className="w-full h-full object-cover"
            />
        </div>

        {/* Entry Text */}
        <div className="mb-12">
            <p className="text-[#4A4D70] text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {journal.content}
            </p>
        </div>

        {/* AI Insights Block */}
        <section className="bg-brand-muted/30 p-8 rounded-[40px] border border-brand-border">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-brand/10 text-brand rounded-lg">
                    <Sparkles size={16} />
                </div>
                <h2 className="text-[10px] uppercase font-black tracking-widest text-brand">AI Insights</h2>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-brand mb-1">Key themes:</h3>
                    <p className="text-[#4A4D70] font-medium leading-relaxed">
                        Personal growth, Gratitude, Presence.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-brand mb-1">Reflection:</h3>
                    <p className="text-[#4A4D70] font-medium leading-relaxed italic opacity-80">
                        {journal.summary || "You've noted a shift in your morning routine. This proactive stillness is correlating with higher clarity in your recent entries."}
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <span className="px-4 py-2 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full">Clarity +12%</span>
                    <span className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Anxiety Lower</span>
                </div>
            </div>
        </section>

        {/* Pagination placeholder */}
        <div className="mt-16 flex justify-between items-center py-8 border-t border-brand-border">
            <div className="text-left">
                <p className="label-caps mb-1">Previous</p>
                <p className="font-bold text-[#1F2133]">The rainy evening</p>
            </div>
            <div className="text-right">
                <p className="label-caps mb-1">Next</p>
                <p className="font-bold text-[#1F2133]">Coffee shop thoughts</p>
            </div>
        </div>
      </main>

      {/* Persistent Bottom Nav Bar */}
      <nav className="glass-nav">
          <button className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'journal' ? 'nav-item-active' : 'text-brand-text-muted'}`}>
              <Book size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Journal</span>
          </button>
          <button className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'assistant' ? 'nav-item-active' : 'text-brand-text-muted'}`}>
              <Sparkles size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Assistant</span>
          </button>
          <button className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'insights' ? 'nav-item-active' : 'text-brand-text-muted'}`}>
              <LineChart size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Insights</span>
          </button>
          <button className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all ${activeTab === 'library' ? 'nav-item-active' : 'text-brand-text-muted'}`}>
              <Library size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Library</span>
          </button>
      </nav>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-50"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-[48px] w-full max-w-sm z-[60] shadow-2xl text-center border border-brand-border"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-[#1F2133]">Release memory?</h2>
              <p className="text-brand-text-body mb-10 leading-relaxed text-sm italic">This moment will be returned to the ether. Are you certain?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Yes, release it
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 bg-brand-muted text-brand-text font-bold rounded-full hover:bg-brand-border transition-all"
                >
                  No, keep it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
