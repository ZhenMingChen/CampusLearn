import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from '../api/client.js';
import Button from '../components/Button.jsx';
import { Card, CardTitle } from '../components/Card.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Topics(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const toast = useToast();
  const user = getUser();
  const isAdmin = user?.role === 'ADMIN';

  async function load(){
    setLoading(true);
    try{
      const data = await api('/topics');
      setItems(Array.isArray(data) ? data : []);
    }catch(e){
      toast(e.message || 'Failed to load topics', 'error');
      setItems([]);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  async function createTopic(e){
    e.preventDefault();
    if (!title.trim() || !content.trim()) return toast('Title and content required','error');
    setPosting(true);
    try{
      const t = await api('/topics', { method:'POST', body:{ title, content } });
      setItems(prev => [t, ...prev]);
      setTitle(''); setContent('');
      toast('Topic created','success');
    }catch(e){ toast(e.message,'error'); }
    finally{ setPosting(false); }
  }

  async function removeTopic(id){
    if (!confirm('Delete this topic?')) return;
    try{
      await api(`/topics/${id}`, { method:'DELETE' });
      setItems(prev => prev.filter(x => x.id !== id));
      toast('Topic deleted','success');
    }catch(e){ toast(e.message,'error'); }
  }

  const canCreate = user?.role === 'STUDENT';

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        {canCreate && (
          <Card>
            <CardTitle>Create Topic</CardTitle>
            <form onSubmit={createTopic} className="space-y-2 mt-3">
              <input
                className="w-full rounded-xl border border-gray-300 p-2"
                placeholder="Title"
                value={title}
                onChange={e=>setTitle(e.target.value)}
              />
              <textarea
                className="w-full rounded-xl border border-gray-300 p-2"
                rows={5}
                placeholder="Content"
                value={content}
                onChange={e=>setContent(e.target.value)}
              />
              <Button className="w-full" loading={posting}>Create</Button>
            </form>
          </Card>
        )}
      </div>

      <div className="md:col-span-2 space-y-4">
        {loading ? <p>Loading…</p> : (
          items.length === 0 ? <p>No topics yet.</p> : items.map(t => (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-gray-500">
                    By <span className="font-medium">{t?.author?.name || 'Unknown'}</span> • {new Date(t?.createdAt || Date.now()).toLocaleString()}
                  </div>
                  <Link to={`/topics/${t.id}`} className="block mt-1 text-lg font-semibold hover:underline truncate">
                    {t?.title || '(no title)'}
                  </Link>
                  <p className="mt-1 line-clamp-2">{t?.content || ''}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {Array.isArray(t?.replies) ? `${t.replies.length} replies` : '0 replies'}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-xs px-3 py-1 rounded-full bg-gray-100 uppercase tracking-wide">
                    {(t?.status || 'OPEN')}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => removeTopic(t.id)}
                      className="text-xs text-red-600 hover:underline"
                      aria-label="Delete topic"
                      title="Delete topic"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}



