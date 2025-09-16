import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { Card, CardTitle, Empty } from '../components/Card.jsx';
import { useToast } from '../components/Toast.jsx';
import { getUser } from '../api/client.js';

export default function Topics(){
  const [topics,setTopics] = useState([]);
  const [form,setForm] = useState({ title:'Intro to SQL', content:'How do JOINs work?' });
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const user = getUser();

  async function load(){ try{ setTopics(await api('/topics')); }catch(e){ toast(e.message,'error'); } }
  useEffect(()=>{ load(); },[]);

  async function create(e){
    e.preventDefault(); setLoading(true);
    try{
      const t = await api('/topics', { method:'POST', body: form });
      setTopics([t, ...topics]); setForm({ title:'', content:'' });
      toast('Topic created','success');
    }catch(e){ toast(e.message,'error'); }
    finally{ setLoading(false); }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Only students can see the create form */}
      {user?.role === 'STUDENT' && (
        <Card className="md:col-span-1">
          <CardTitle>Create Topic</CardTitle>
          <form onSubmit={create} className="mt-3 space-y-2">
            <Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            <label className="block">
              <span className="block text-sm text-gray-700">Content</span>
              <textarea className="mt-1 w-full rounded-xl border border-gray-300 p-2" rows={4}
                value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
            </label>
            <Button loading={loading} className="w-full">Create</Button>
          </form>
        </Card>
      )}

      <div className={user?.role === 'STUDENT' ? "md:col-span-2 space-y-3" : "md:col-span-3 space-y-3"}>
        {topics.length === 0 && <Card><Empty title="No topics yet" hint="Be the first to ask a question."/></Card>}
        {topics.map(t=> (
          <Link key={t.id} to={`/topics/${t.id}`} className="block">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
                  <div className="mt-1 text-gray-700">By <span className="font-medium">{t.author?.name || 'Unknown'}</span></div>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{t.status}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{t.title}</h3>
              <p className="text-gray-700 line-clamp-2">{t.content}</p>
              <div className="mt-2 text-sm text-gray-500">{t.replies?.length || 0} replies</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

