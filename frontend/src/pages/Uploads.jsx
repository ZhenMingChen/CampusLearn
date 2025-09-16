import React, { useState } from 'react';
import { Card, CardTitle } from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Uploads(){
  const [file,setFile] = useState(null);
  const [msg,setMsg] = useState('');
  const [loading,setLoading] = useState(false);
  const toast = useToast();

  async function onSubmit(e){
    e.preventDefault();
    if (!file) return toast('Please choose a file','error');
    setLoading(true);
    const form = new FormData(); form.append('file', file);
    try{
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/files/upload`, { method:'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json(); setMsg(data.url); toast('Uploaded','success');
    }catch(e){ toast(e.message,'error'); }
    finally{ setLoading(false); }
  }

  return (
    <div className="max-w-lg">
      <Card>
        <CardTitle>Upload Learning Material</CardTitle>
        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          <input aria-label="Choose file" type="file" onChange={e=>setFile(e.target.files[0])} />
          <Button loading={loading}>Upload</Button>
          {msg && <p className="text-sm text-gray-600">Saved at: <span className="font-mono">{msg}</span></p>}
          <p className="text-xs text-gray-500">Allowed: PDF, PNG, JPEG • Max 10MB</p>
        </form>
      </Card>
    </div>
  );
}

