/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: { uid: string; email: string | null } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing listener...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('AuthContext: User detected:', firebaseUser.uid);
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        setLoading(false);
      } else {
        console.log('AuthContext: No user, attempting anonymous sign-in for cloud sync...');
        try {
          const cred = await signInAnonymously(auth);
          console.log('AuthContext: Anonymous session started:', cred.user.uid);
        } catch (error) {
          console.warn('AuthContext: Anonymous sign-in failed (is it enabled in console?):', error);
          // Only fallback to fake user if anonymous auth is disabled
          setUser({ uid: 'anonymous-guest-user', email: 'guest@example.com' });
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
