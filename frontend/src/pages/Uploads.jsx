// frontend/src/pages/Uploads.jsx
import React, { useRef, useState } from 'react';
import { getToken } from '../api/client.js';
import Button from '../components/Button.jsx';
import { Card, CardTitle } from '../components/Card.jsx';
import { useToast } from '../components/Toast.jsx';

// Build the backend origin from VITE_API_BASE (e.g. http://localhost:4000/api/v1 -> http://localhost:4000)
const API_BASE = import.meta.env.VITE_API_BASE;
const API_ORIGIN = new URL(API_BASE).origin;

export default function Uploads() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const toast = useToast();
  const inputRef = useRef(null);

  const ALLOWED = ['application/pdf', 'image/png', 'image/jpeg'];
  const MAX_MB = 10;

  async function doUpload(e) {
    e.preventDefault();
    if (!file) return toast('Please choose a file','error');
    if (!ALLOWED.includes(file.type)) return toast('Only PDF, PNG, JPEG allowed','error');
    if (file.size > MAX_MB * 1024 * 1024) return toast(`File too large (max ${MAX_MB}MB)`,'error');

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);

      const token = getToken();
      const res = await fetch(`${API_BASE}/file/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();

      // Prefer absolute URL from backend; otherwise make relative -> absolute
      const displayUrl =
        data.fullUrl
          ? data.fullUrl
          : data.url?.startsWith('http')
              ? data.url
              : `${API_ORIGIN}${data.url || ''}`;

      setLastResult({
        id: data.id,
        mime: data.mime,
        size: data.size,
        url: displayUrl,
      });

      toast('Uploaded successfully','success');
      setFile(null);
      // clear the <input type="file">
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      toast(err.message || 'Upload error','error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardTitle>Upload learning material</CardTitle>
        <form onSubmit={doUpload} className="mt-4 space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-800"
          />
          <div className="text-sm text-gray-500">
            Allowed: PDF, PNG, JPEG • Max {MAX_MB}MB
          </div>
          <Button loading={uploading}>Upload</Button>
        </form>
      </Card>

      {lastResult && (
        <Card>
          <CardTitle>Result</CardTitle>
          <div className="mt-3 space-y-2 text-sm">
            <div><span className="font-medium">ID:</span> {lastResult.id ?? '(n/a)'}</div>
            <div><span className="font-medium">MIME:</span> {lastResult.mime}</div>
            <div><span className="font-medium">Size:</span> {lastResult.size} bytes</div>
            <div className="break-all">
              <span className="font-medium">URL:</span>{' '}
              {lastResult.url ? (
                <a className="text-blue-600 underline" href={lastResult.url} target="_blank" rel="noreferrer">
                  {lastResult.url}
                </a>
              ) : '(no url)'}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



