/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { JournalEntry, Mood } from '../types';

export const useJournals = () => {
  const { user } = useAuth();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setJournals([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'journals'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setJournals(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching journals:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addJournal = async (title: string, content: string, mood: Mood, moodEmoji: string) => {
    if (!user) return;

    const now = Date.now();
    await addDoc(collection(db, 'journals'), {
      userId: user.uid,
      title,
      content,
      mood,
      moodEmoji,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateJournal = async (id: string, updates: Partial<JournalEntry>) => {
    const journalRef = doc(db, 'journals', id);
    await updateDoc(journalRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  };

  const deleteJournal = async (id: string) => {
    await deleteDoc(doc(db, 'journals', id));
  };

  return { journals, loading, addJournal, updateJournal, deleteJournal };
};

export const useJournal = (id: string | undefined) => {
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const journalRef = doc(db, 'journals', id);
    const unsubscribe = onSnapshot(journalRef, (doc) => {
      if (doc.exists()) {
        setJournal({ id: doc.id, ...doc.data() } as JournalEntry);
      } else {
        setJournal(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [id]);

  return { journal, loading };
};
