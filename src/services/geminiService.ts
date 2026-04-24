/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

// Use the API key from process.env as per gemini-api skill
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  async summarize(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this journal entry in 2-3 meaningful lines:\n\n${content}`,
      config: {
        systemInstruction: "You are a warm and supportive journaling assistant. Provide concise and meaningful summaries.",
      },
    });
    return response.text;
  },

  async detectMood(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the emotional tone of this journal. Return mood, short explanation, and a gentle suggestion in JSON format.\n\n${content}`,
      config: {
        systemInstruction: "You are a warm and supportive journaling assistant. Analyze emotional tone accurately.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING, enum: ['peaceful', 'reflective', 'excited', 'tense', 'gloomy', 'neutral'] },
            explanation: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["mood", "explanation", "suggestion"]
        }
      },
    });
    
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse mood analysis:", e);
      return null;
    }
  },

  async continueWriting(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Continue or improve the user's writing naturally without sounding robotic. Here is the current text:\n\n${content}`,
      config: {
        systemInstruction: "You are a warm and supportive journaling assistant. Continue the user's writing in a matching tone.",
      },
    });
    return response.text;
  }
};
