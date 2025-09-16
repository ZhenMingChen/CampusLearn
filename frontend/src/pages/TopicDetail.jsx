// frontend/src/pages/TopicDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import Button from '../components/Button.jsx';
import { Card, CardTitle } from '../components/Card.jsx';
import { useToast } from '../components/Toast.jsx';
import { getUser } from '../api/client.js';

export default function TopicDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [topic,setTopic] = useState(null);
  const [content,setContent] = useState('');
  const [loading,setLoading] = useState(false);
  const [deleting,setDeleting] = useState(false);
  const toast = useToast();
  const user = getUser();

  async function load(){
    try{
      setTopic(await api(`/topics/${id}`));
    }catch(e){
      toast(e.message,'error');
    }
  }
  useEffect(()=>{ load(); },[id]);

  async function reply(e){
    e.preventDefault(); setLoading(true);
    try{
      const r = await api(`/replies/${id}`, { method:'POST', body:{ content } });
      setTopic(t => ({ ...t, replies:[...(t?.replies||[]), r] }));
      setContent('');
      toast('Reply posted','success');
    }catch(e){ toast(e.message,'error'); }
    finally{ setLoading(false); }
  }

  async function removeTopic(){
    if (!window.confirm('Delete this topic? This cannot be undone.')) return;
    setDeleting(true);
    try{
      await api(`/topics/${id}`, { method:'DELETE' }); // ADMIN-only route on backend
      toast('Topic deleted','success');
      nav('/topics');
    }catch(e){
      toast(e.message,'error');
    }finally{
      setDeleting(false);
    }
  }

  if (!topic) return <p>Loading…</p>;

  const canReply = user?.role === 'TUTOR' || user?.role === 'ADMIN';
  const isAdmin  = user?.role === 'ADMIN';

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{topic.title}</CardTitle>
              <p className="mt-2">{topic.content}</p>
              <div className="mt-3 text-sm text-gray-500">
                By <span className="font-medium">{topic.author?.name}</span> • {new Date(topic.createdAt).toLocaleString()}
              </div>
              {topic.assignee && (
                <div className="mt-1 text-sm text-gray-500">
                  Assigned to <span className="font-medium">{topic.assignee?.name}</span>
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{topic.status}</span>
              {isAdmin && (
                <Button
                  onClick={removeTopic}
                  loading={deleting}
                  className="bg-red-600 hover:opacity-90"
                >
                  Delete Topic
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          {(topic.replies||[]).map(r=> (
            <Card key={r.id}>
              <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              <p className="mt-1">{r.content}</p>
              <div className="text-sm text-gray-500 mt-1">— {r.author?.name}</div>
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
            <Button className="w-full" loading={loading}>Send</Button>
          </form>
        </Card>
      )}
    </div>
  );
}

