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

  async function onSubmit(e){
    e.preventDefault();
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

      toast('Signed in ✅', 'success');

      // go where they intended, or Topics
      const to = loc.state?.from || '/topics';
      nav(to, { replace: true });

      // (optional) force a re-render if something was cached
      // setTimeout(() => window.dispatchEvent(new Event('storage')), 0);
    } catch (err) {
      toast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-gray-300 p-2"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-gray-300 p-2"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
        </div>

        <Button className="w-full" loading={loading}>Sign in</Button>
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



