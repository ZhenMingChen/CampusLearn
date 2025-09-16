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
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar/>
        <main className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />

            {/* Protected routes */}
            <Route
              path="/topics"
              element={<ProtectedRoute><Topics/></ProtectedRoute>}
            />
            <Route
              path="/topics/:id"
              element={<ProtectedRoute><TopicDetail/></ProtectedRoute>}
            />
            <Route
              path="/upload"
              element={<ProtectedRoute><Uploads/></ProtectedRoute>}
            />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}


