// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api, setSession } from '../api/client.js';
import Button from '../components/Button.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Login(){
  const [email, setEmail] = useState('student@demo.dev');
  const [password, setPassword] = useState('Passw0rd!');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const toast = useToast();

  // Screen-reader announcement helper (avoids optional chaining on assignment)
  const announce = (msg) => {
    const el = document.getElementById('sr-status');
    if (el) el.textContent = msg;
  };

  async function onSubmit(e){
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      // POST /auth/login -> { accessToken, refreshToken, user }
      const data = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      // persist session
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      announce('Signed in successfully');
      toast('Signed in ✅', 'success');

      // go where they intended, or Topics
      const to = loc.state?.from || '/topics';
      nav(to, { replace: true });
    } catch (err) {
      const msg = err?.message || 'Login failed';
      announce(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Login</h1>

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl border border-gray-300 p-2
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input
            id="password"
            type="password"
            className="w-full rounded-xl border border-gray-300 p-2
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {/* Submit button (type is important) */}
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="text-sm mt-3">
        No account? <Link to="/register" className="text-blue-600 underline">Register</Link>
      </p>

      <div className="text-xs text-gray-500 mt-6 space-y-1">
        <div>Demo logins:</div>
        <div>Student — <code>student@demo.dev</code> / <code>Passw0rd!</code></div>
        <div>Tutor — <code>tutor@demo.dev</code> / <code>Passw0rd!</code></div>
        <div>Admin — <code>admin@demo.dev</code> / <code>Passw0rd!</code></div>
      </div>
    </div>
  );
}




