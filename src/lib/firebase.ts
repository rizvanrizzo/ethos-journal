/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Fallback to empty strings if not provided or placeholder
const config = {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey === 'PLACEHOLDER' ? '' : firebaseConfig.apiKey,
};

const app = initializeApp(config);
export const auth = getAuth(app);
// Use the custom database ID if available
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Connectivity check as required by guidelines
export async function testConnection() {
  if (!config.apiKey) {
    console.warn("Firebase API Key is missing. Please set up Firebase using the AI Studio tool.");
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
