/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Mood = 'peaceful' | 'reflective' | 'excited' | 'tense' | 'gloomy' | 'neutral';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: Mood;
  moodEmoji: string;
  moodExplanation?: string;
  summary?: string;
  suggestion?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AIResponse {
  summary?: string;
  mood?: Mood;
  explanation?: string;
  suggestion?: string;
  continuedText?: string;
}
