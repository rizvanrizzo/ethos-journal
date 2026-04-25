/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

// Fallback to empty strings if not provided or placeholder
const config = {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey === 'PLACEHOLDER' ? '' : firebaseConfig.apiKey,
};

console.log('Firebase: Initializing app with Project ID:', config.projectId);

const app = initializeApp(config);

export const auth = getAuth(app);

// Use standard getFirestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Enable persistence for offline support (useful for mobile apps)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence is not available in this browser');
    }
  });
}

console.log('Firestore: Initialized with Database ID:', firebaseConfig.firestoreDatabaseId || '(default)');

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connectivity check as required by guidelines
export async function testConnection() {
  if (!config.apiKey) {
    console.warn("Firebase API Key is missing.");
    return;
  }
  try {
    const docRef = doc(db, 'test', 'connection');
    await getDocFromServer(docRef);
  } catch (error: any) {
    console.warn("Firestore connection check failed (expected if rules are restricted):", error.message);
  }
}
// Skip immediate testConnection to avoid initialization noise
// testConnection();
