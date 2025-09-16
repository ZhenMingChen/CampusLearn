// backend/src/integrations/openai.js
// Unified Copilot helper: prefer OpenAI when configured, otherwise use local Ollama.
// Works offline with Ollama; no credits required.

import OpenAI from 'openai';

// --- Provider selection & config
const provider    = (process.env.COPILOT_PROVIDER || '').toLowerCase(); // 'openai' | 'ollama' | ''
const openaiKey   = process.env.OPENAI_API_KEY || '';
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const ollamaHost  = process.env.OLLAMA_HOST || 'http://localhost:11434';
const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1';

let openai = null;
if (openaiKey) openai = new OpenAI({ apiKey: openaiKey });

// Normalize responses
const ok      = (content, model) => ({ content, model });
const skipped = (reason, detail) => ({ skipped: true, reason, ...(detail ? { detail } : {}) });

export async function copilotSuggest(prompt) {
  const question = String(prompt || '').slice(0, 4000);

  // Debug line so you can see which path is used
  console.log('[Copilot] provider=', provider, 'openaiKey?', !!openaiKey, 'ollama=', ollamaHost, ollamaModel);

  const wantOpenAI = provider === 'openai' || (openai && provider !== 'ollama');

  if (wantOpenAI) {
    try {
      const r = await openai.chat.completions.create({
        model: openaiModel,
        temperature: 0.3,
        max_tokens: 250,
        messages: [
          { role: 'system', content: 'You are CampusLearn Copilot. Be concise and helpful.' },
          { role: 'user',   content: question }
        ],
      });
      const content = r.choices?.[0]?.message?.content?.trim() || '';
      return ok(content, `openai:${openaiModel}`);
    } catch (e) {
      console.warn('[Copilot] OpenAI failed, trying Ollama:', e?.message || e);
      if (provider === 'openai') {
        if (e.status === 429) return skipped('insufficient_quota', e.message);
        if (e.status === 401 || e.status === 403) return skipped('auth', e.message);
        return skipped('provider_error', e.message);
      }
      // fall through to Ollama
    }
  }

  // Ollama (local, free)
  try {
    const res = await fetch(`${ollamaHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        stream: false,
        messages: [
          { role: 'system', content: 'You are CampusLearn Copilot. Be concise and helpful.' },
          { role: 'user',   content: question }
        ]
      })
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      return skipped('ollama_error', `HTTP ${res.status} ${res.statusText} ${txt}`);
    }
    const json = await res.json();
    const content =
      json?.message?.content ||
      json?.choices?.[0]?.message?.content ||
      '';
    if (!content) return skipped('ollama_empty');

    return ok(content.trim(), `ollama:${ollamaModel}`);
  } catch (e) {
    return skipped('ollama_unavailable', e.message);
  }
}

