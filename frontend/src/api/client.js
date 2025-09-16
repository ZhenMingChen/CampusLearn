// frontend/src/api/client.js
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api/v1';

// In-memory session (simple & demo-friendly)
let accessToken = '';
let refreshToken = '';
let currentUser = null; // { id, name, email, role } from backend

export function setSession({ access, refresh, user }) {
  accessToken = access || '';
  refreshToken = refresh || '';
  currentUser = user || null;
}

export function clearSession() {
  accessToken = '';
  refreshToken = '';
  currentUser = null;
}

export function getUser() {
  return currentUser;
}

export async function api(path, { method='GET', body, auth=true, headers={} } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401 if we have a refresh token
  if (res.status === 401 && refreshToken) {
    const rr = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'x-refresh-token': refreshToken },
    });
    if (rr.ok) {
      const j = await rr.json();
      accessToken = j.accessToken || '';
      // retry original request once
      const again = await fetch(`${API}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!again.ok) {
        let msg = 'Request failed';
        try { const e = await again.json(); msg = e.error?.message || msg; } catch {}
        throw new Error(msg);
      }
      return again.json();
    }
  }

  if (!res.ok) {
    let msg = 'Request failed';
    try { const e = await res.json(); msg = e.error?.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

