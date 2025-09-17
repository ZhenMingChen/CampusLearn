// frontend/src/api/client.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api/v1';
const storeKey = 'campuslearn_session';

export function getSession() {
  try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); }
  catch { return {}; }
}
export function setSession(s) { localStorage.setItem(storeKey, JSON.stringify(s || {})); }
export function clearSession() { localStorage.removeItem(storeKey); }

export function getUser() { return getSession().user || null; }

// Backward-compatible exports (both names work)
export function getAccessToken() { return getSession().accessToken || ''; }
export function getToken() { return getAccessToken(); }

export async function api(path, { method = 'GET', headers = {}, body } = {}) {
  const token = getAccessToken();
  const hasBody = body !== undefined;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Accept': 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* ignore non-JSON */ }

  if (!res.ok) {
    if (res.status === 401) clearSession();
    const msg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data ?? {};
}
