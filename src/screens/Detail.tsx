/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournal, useJournals } from '../hooks/useJournals';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Edit3, Trash2, Sparkles, Smile, Info, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journal, loading } = useJournal(id);
  const { deleteJournal } = useJournals();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (id) {
      await deleteJournal(id);
      navigate('/');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="animate-pulse text-brand-text-muted font-serif italic">Recalling moment...</div>
    </div>
  );

  if (!journal) return <div className="p-10 text-center">Entry not found.</div>;

  return (
    <div className="min-h-screen bg-brand-light">
      <header className="px-6 py-8 flex justify-between items-center bg-brand-light/80 backdrop-blur-sm sticky top-0 z-30">
        <button onClick={() => navigate('/')} className="p-3 bg-brand-muted rounded-full text-brand-text-muted hover:text-brand transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/edit/${id}`)}
            className="p-3 bg-white rounded-full border border-brand-border text-brand-text-muted hover:text-brand transition-colors shadow-sm"
          >
            <Edit3 size={20} />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-3 bg-white rounded-full border border-brand-border text-brand-text-muted hover:text-red-500 transition-colors shadow-sm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8 pt-16 pb-40">
        {/* Meta Info */}
        <div className="flex items-center gap-6 mb-12">
          <div className="text-5xl p-6 bg-white rounded-[40px] shadow-sm border border-brand-border">
            {journal.moodEmoji}
          </div>
          <div>
            <p className="label-caps mb-2">
              {format(journal.createdAt, 'EEEE, MMMM d, yyyy')}
            </p>
            <h1 className="text-4xl title-serif leading-tight">
              {journal.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-10 md:p-14 rounded-[48px] shadow-sm border border-brand-border mb-12">
          <p className="text-brand-text-body text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif italic">
            {journal.content}
          </p>
        </div>

        {/* AI Insights Section */}
        {(journal.summary || journal.moodExplanation || journal.suggestion) && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-brand"></div>
              <h2 className="label-caps">AI Intelligence</h2>
            </div>
            
            {journal.summary && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-brand-muted/30 p-8 rounded-[32px] border border-brand-border"
              >
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest mb-4">
                  <Sparkles size={14} />
                  Distilled Essence
                </div>
                <p className="text-brand-dark leading-relaxed font-serif text-lg italic">
                  {journal.summary}
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journal.moodExplanation && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-8 rounded-[32px] border border-brand-border"
                >
                  <div className="flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest mb-4">
                    <Smile size={14} />
                    Mood Resonance
                  </div>
                  <p className="text-brand-text-body text-xs leading-loose italic">
                    {journal.moodExplanation}
                  </p>
                </motion.div>
              )}

              {journal.suggestion && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-brand p-8 rounded-[32px] text-white shadow-xl shadow-brand/10"
                >
                  <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest mb-4 opacity-80">
                    <Lightbulb size={14} />
                    Daily Prompt
                  </div>
                  <p className="text-sm leading-relaxed font-serif italic">
                    "{journal.suggestion}"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </main>

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
              <h2 className="text-2xl title-serif mb-3">Release memory?</h2>
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
