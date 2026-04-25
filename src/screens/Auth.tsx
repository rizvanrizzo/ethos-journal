/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, UserPlus, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Auth error:', err.code, err.message);
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError("Firebase Authentication is not fully set up. Please go to your Firebase Console under 'Authentication' > 'Sign-in method' and enable both 'Email/Password' and 'Anonymous'.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Try signing in instead.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "An unexpected error occurred during authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      navigate('/', { replace: true });
    } catch (e: any) {
      console.error('Anonymous sign in failed:', e);
      // Fallback to pure local guest if anonymous auth is disabled in console
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full bg-brand-light flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand/20">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-4xl title-serif mb-2">Ethos</h1>
          <p className="text-brand-text-muted italic text-sm">Capture your journey, distill your essence.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-xs font-bold flex flex-col gap-2">
            <div className="flex items-center gap-3 uppercase tracking-wider">
              <ShieldAlert size={16} />
              <span>Authentication Error</span>
            </div>
            <p className="normal-case font-medium opacity-80 leading-relaxed">
              {error.includes('auth/configuration-not-found') 
                ? "You must enable 'Email/Password' in your Firebase Authentication settings in the console." 
                : error}
            </p>
          </div>
        )}

        <div className="mb-0"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-caps ml-4 mb-2 block">Email Address</label>
            <input 
              type="email" 
              className="w-full px-6 py-4 bg-brand-muted rounded-2xl text-brand outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium" 
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-caps ml-4 mb-2 block">Password</label>
            <input 
              type="password" 
              className="w-full px-6 py-4 bg-brand-muted rounded-2xl text-brand outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-5 bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
          >
            {loading ? 'Reflecting...' : (isLogin ? 'Enter Workspace' : 'Begin Journey')}
            {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-brand-border space-y-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-xs font-bold text-brand-text-muted hover:text-brand uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </button>

          <div className="flex items-center gap-4 text-brand-border py-2">
            <div className="h-[1px] bg-brand-border flex-1"></div>
            <span className="label-caps leading-none">or</span>
            <div className="h-[1px] bg-brand-border flex-1"></div>
          </div>

          <button 
            onClick={handleGuestSignIn} 
            disabled={loading}
            className="w-full py-4 bg-brand-muted text-brand rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all border border-transparent hover:border-brand-border disabled:opacity-50"
          >
            Continue as Guest <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
