/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Github } from 'lucide-react';

export default function Auth() {
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
    } catch (err: any) {
      setError(err.message);
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
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
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
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-xs font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-caps ml-4 mb-2 block">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
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
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-4 flex items-center justify-center gap-3">
            {loading ? 'Reflecting...' : (isLogin ? 'Enter Workspace' : 'Begin Journey')}
            {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>}
          </button>
        </form>

        <div className="mt-10 flex items-center gap-4 text-brand-border">
          <div className="h-[1px] bg-brand-border flex-1"></div>
          <span className="label-caps leading-none">or continue with</span>
          <div className="h-[1px] bg-brand-border flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full mt-10 py-4 bg-white border border-brand-border rounded-full font-bold text-brand-text flex items-center justify-center gap-4 hover:bg-brand-muted transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebase/birdseed/images/google-g.svg" className="w-5 h-5" alt="Google" />
          Google Account
        </button>

        <p className="mt-12 text-center text-xs font-medium text-brand-text-muted">
          {isLogin ? "New to Ethos?" : "Already a member?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand font-bold uppercase tracking-widest hover:underline ml-2"
          >
            {isLogin ? 'Register' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
