import React, { useState } from 'react';
import { api } from '../api/client.js';

export default function Register(){
  const [form,setForm] = useState({ name:'Alice', email:'alice@example.com', password:'Passw0rd!', role:'STUDENT' });
  const [msg,setMsg] = useState('');
  async function onSubmit(e){ e.preventDefault();
    await api('/auth/register', { method:'POST', auth:false, body:form });
    setMsg('Registered! Check server console for mock verify email.');
  }
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-8 space-y-3">
      <h1 className="text-2xl font-semibold">Register</h1>
      {['name','email','password'].map(k=> (
        <label key={k} className="block capitalize">{k}
          <input className="mt-1 w-full border p-2 rounded" type={k==='password'?'password':'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} />
        </label>
      ))}
      <select className="border p-2 rounded" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
        <option>STUDENT</option><option>TUTOR</option><option>ADMIN</option>
      </select>
      <button className="px-4 py-2 bg-black text-white rounded">Create account</button>
      {msg && <p className="text-green-700">{msg}</p>}
    </form>
  );
}
