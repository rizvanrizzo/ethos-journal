/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './screens/Home';
import Auth from './screens/Auth';
import Editor from './screens/Editor';
import Detail from './screens/Detail';
import { AnimatePresence } from 'motion/react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center font-sans text-stone-400">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path="/new" element={<PrivateRoute><Editor /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />
            <Route path="/journal/:id" element={<PrivateRoute><Detail /></PrivateRoute>} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}
