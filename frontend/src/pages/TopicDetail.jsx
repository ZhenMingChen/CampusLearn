import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getUser } from '../api/client.js';
import Button from '../components/Button.jsx';
import { Card, CardTitle } from '../components/Card.jsx';
import { useToast } from '../components/Toast.jsx';

export default function TopicDetail(){
  const { id } = useParams();
  const [topic,setTopic] = useState(null);
  const [content,setContent] = useState('');
  const [loading,setLoading] = useState(true);
  const [posting,setPosting] = useState(false);
  const toast = useToast();
  const user = getUser();
  const nav = useNavigate();

  async function load(){
    setLoading(true);
    try{
      const t = await api(`/topics/${id}`);
      setTopic(t);
    }catch(e){ toast(e.message,'error'); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[id]);

  async function reply(e){
    e.preventDefault();
    if (!content.trim()) return toast('Write something','error');
    setPosting(true);
    try{
      const r = await api(`/replies/${id}`, { method:'POST', body:{ content } });
      setTopic(prev => ({ ...prev, replies: [ ...(prev?.replies || []), r ] }));
      setContent('');
      toast('Reply posted','success');
    }catch(e){ toast(e.message,'error'); }
    finally{ setPosting(false); }
  }

  async function removeTopic(){
    if (!confirm('Delete this topic?')) return;
    try{
      await api(`/topics/${id}`, { method:'DELETE' });
      toast('Topic deleted','success');
      nav('/topics');
    }catch(e){ toast(e.message,'error'); }
  }

  if (loading) return <p>Loading…</p>;
  if (!topic)  return <p>Not found.</p>;

  const canReply = user?.role === 'TUTOR' || user?.role === 'ADMIN';
  const isAdmin  = user?.role === 'ADMIN';

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <div className="flex items-start justify-between">
            <CardTitle>{topic?.title || '(no title)'}</CardTitle>
            {isAdmin && (
              <button
                onClick={removeTopic}
                className="text-sm text-red-600 hover:underline"
                aria-label="Delete topic"
                title="Delete topic"
              >
                Delete
              </button>
            )}
          </div>
          <p className="mt-2">{topic?.content || ''}</p>
          <div className="mt-3 text-sm text-gray-500">
            By <span className="font-medium">{topic?.author?.name || 'Unknown'}</span> • {new Date(topic?.createdAt || Date.now()).toLocaleString()}
          </div>
        </Card>

        <div className="space-y-2">
          {(topic?.replies || []).map(r=> (
            <Card key={r.id}>
              <div className="text-sm text-gray-500">{new Date(r?.createdAt || Date.now()).toLocaleString()}</div>
              <p className="mt-1">{r?.content || ''}</p>
              <div className="text-sm text-gray-500 mt-1">— {r?.author?.name || 'Unknown'}</div>
            </Card>
          ))}
        </div>
      </div>

      {canReply && (
        <Card className="md:col-span-1">
          <CardTitle>Write a reply</CardTitle>
          <form onSubmit={reply} className="mt-3 space-y-2">
            <textarea
              className="w-full rounded-xl border border-gray-300 p-2"
              rows={5}
              placeholder="Share a helpful explanation…"
              value={content}
              onChange={e=>setContent(e.target.value)}
            />
            <Button className="w-full" loading={posting}>Send</Button>
          </form>
        </Card>
      )}
    </div>
  );
}




