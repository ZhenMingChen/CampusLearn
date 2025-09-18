import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastProvider } from './components/Toast.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Topics from './pages/Topics.jsx';
import TopicDetail from './pages/TopicDetail.jsx';
import Uploads from './pages/Uploads.jsx';

export default function App(){
  return (
    <ToastProvider>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:p-2 bg-white text-blue-700 rounded-md shadow top-2 left-2 z-50"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar/>

        {/* Main landmark with an id for the skip link. tabindex makes it focusable when jumped to. */}
        <main id="main" tabIndex={-1} className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />

            <Route path="/topics" element={
              <ProtectedRoute><Topics/></ProtectedRoute>
            }/>
            <Route path="/topics/:id" element={
              <ProtectedRoute><TopicDetail/></ProtectedRoute>
            }/>
            <Route path="/uploads" element={
              <ProtectedRoute><Uploads/></ProtectedRoute>
            }/>
          </Routes>
        </main>
      </div>

      {/* Global screen-reader live region for status messages */}
      <div id="sr-status" aria-live="polite" aria-atomic="true" className="sr-only" />
    </ToastProvider>
  );
}




