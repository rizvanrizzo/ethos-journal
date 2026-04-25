/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'onboarding' | 'auth'>('onboarding');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  const onboardingSteps = [
    {
      title: "Your thoughts deserve a quiet place.",
      description: "Step away from the noise and rediscover the clarity of your own mind.",
      color: "bg-brand"
    }
  ];

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
        setError("Firebase Authentication is not fully set up. Please enable 'Email/Password' and 'Anonymous' in the Firebase Console.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      navigate('/', { replace: true });
    } catch (e: any) {
      console.error('Anonymous sign in failed:', e);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'onboarding') {
    return (
      <div className="h-full bg-[#F9FAFF] flex flex-col items-center justify-between p-10 py-20 pb-16 overflow-y-auto">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[#5E6BB5] font-bold text-2xl">Sanctuary</h2>
        </div>

        <div className="relative w-full max-w-sm aspect-square bg-[#1A1C3E] rounded-[60px] overflow-hidden flex items-center justify-center p-12">
            {/* Cosmic backdrop representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B0D1E] via-[#1A1C3E] to-[#2D315E]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#4DEEE1]/20 blur-3xl rounded-full animate-pulse" />
            
            {/* Minimalist Laptop Representation */}
            <div className="relative w-full aspect-[1.3] bg-[#E5E9FF] rounded-xl flex items-center justify-center shadow-lg border border-[#3D416E]/30">
                <div className="w-[90%] h-[85%] bg-[#1A1C3E] rounded-md overflow-hidden relative border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#4DEEE1]/10 to-[#4DEEE1]/30 opacity-50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-[#4DEEE1]/20 blur-sm rotate-45" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#4DEEE1] blur-md rounded-full" />
                </div>
                {/* Base */}
                <div className="absolute -bottom-2 w-[110%] h-3 bg-[#D1D5F0] rounded-b-xl border-t border-white/20" />
            </div>

            {/* Logo Tag */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="text-[#8C9EFF]" size={24} />
            </div>
        </div>

        <div className="text-center w-full max-w-xs">
          <h1 className="text-[32px] font-bold leading-tight text-[#1F2133] mb-4">
            Your thoughts deserve a <span className="text-[#8C9EFF]">quiet place.</span>
          </h1>
          <p className="text-[#8E91B2] text-base font-medium leading-relaxed mb-6">
            Step away from the noise and rediscover the clarity of your own mind.
          </p>
          
          <div className="flex justify-center gap-2 mb-10">
            <div className="onboarding-dot active" />
            <div className="onboarding-dot" />
            <div className="onboarding-dot" />
          </div>

          <button 
                onClick={() => setStep('auth')}
                className="w-full py-5 bg-[#8C9EFF] text-white rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand/20 active:scale-95 transition-all mb-6"
            >
                Next <ArrowRight size={20} />
            </button>

            <button 
                onClick={() => setStep('auth')}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8E91B2] hover:text-[#5E6BB5] transition-colors"
            >
                Skip Intro
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-brand-light flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand/20">
            <Leaf className="text-white" size={32} />
          </div>
          <h1 className="text-4xl title-serif mb-2">Sanctuary</h1>
          <p className="text-brand-text-muted italic text-sm">Capture your journey, distill your essence.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-xs font-bold flex flex-col gap-2">
            <div className="flex items-center gap-3 uppercase tracking-wider">
              <ShieldAlert size={16} />
              <span>Authentication Error</span>
            </div>
            <p className="normal-case font-medium opacity-80 leading-relaxed">
              {error}
            </p>
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
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary"
          >
            {loading ? 'Reflecting...' : (isLogin ? 'Enter Sanctuary' : 'Begin Journey')}
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
