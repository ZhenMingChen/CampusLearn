// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setSession } from '../api/client.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { Card } from '../components/Card.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Login(){
  const nav = useNavigate();
  const toast = useToast();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true); setError('');
    try{
      const r = await api('/auth/login', { method:'POST', auth:false, body:{ email,password } });
      setSession({ access: r.accessToken, refresh: r.refreshToken, user: r.user || { email: r.email, role: r.role } });
      toast('Welcome back!','success');
      nav('/topics');
    }catch(err){
      setError(err.message || 'Login failed');
      toast(err.message || 'Login failed','error');
    }finally{
      setLoading(false);
    }
  }

  // Quick login presets
  const presets = [
    { label:"👨‍🎓 Student", email:"student@demo.dev", password:"Passw0rd!" },
    { label:"👨‍🏫 Tutor", email:"tutor@demo.dev", password:"Passw0rd!" },
    { label:"👨‍💼 Admin", email:"admin@demo.dev", password:"Passw0rd!" }
  ];

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        {error && <div role="alert" className="mb-3 rounded-xl bg-red-100 text-red-700 px-3 py-2">{error}</div>}
        
        {/* Quick login buttons */}
        <div className="flex gap-2 mb-4">
          {presets.map(p => (
            <Button
              key={p.label}
              type="button"
              className="flex-1"
              onClick={() => { setEmail(p.email); setPassword(p.password); }}
            >
              {p.label}
            </Button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button loading={loading} className="w-full">Sign in</Button>
        </form>
        <p className="text-sm text-gray-600 mt-3">No account? <Link className="underline" to="/register">Create one</Link></p>
      </Card>
    </div>
  );
}


