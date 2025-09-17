// backend/src/integrations/openai.js
// Unified Copilot helper: prefer OpenAI when configured, otherwise use local Ollama.
// Safe dynamic import so app runs even if 'openai' pkg isn't installed.

const provider    = (process.env.COPILOT_PROVIDER || '').toLowerCase(); // 'openai' | 'ollama' | ''
const openaiKey   = process.env.OPENAI_API_KEY || '';
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const ollamaHost  = process.env.OLLAMA_HOST || 'http://localhost:11434';
const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1';

// normalize responses
const ok      = (content, model) => ({ content, model });
const skipped = (reason, detail) => ({ skipped: true, reason, ...(detail ? { detail } : {}) });

export async function copilotSuggest(prompt) {
  const question = String(prompt || '').slice(0, 4000);

  // Debug so you can see which path is used
  console.log('[Copilot] provider=', provider, 'openaiKey?', !!openaiKey, 'ollama=', ollamaHost, ollamaModel);

  const wantOpenAI = provider === 'openai' || (!!openaiKey && provider !== 'ollama');

  if (wantOpenAI) {
    try {
      // lazy import so the app doesn't require 'openai' when using only Ollama
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: openaiKey });
      const r = await openai.chat.completions.create({
        model: openaiModel,
        temperature: 0.3,
        max_tokens: 250,
        messages: [
          { role: 'system', content: 'You are CampusLearn Copilot. Be concise and helpful.' },
          { role: 'user',   content: question }
        ],
      });
      const content = r?.choices?.[0]?.message?.content?.trim() || '';
      return ok(content, `openai:${openaiModel}`);
    } catch (e) {
      // If you forced openai but it's misconfigured, surface a clear reason.
      if (provider === 'openai') {
        const status = e?.status;
        if (status === 429) return skipped('insufficient_quota', e.message);
        if (status === 401 || status === 403) return skipped('auth', e.message);
        // If the import failed because the package isn't installed:
        if (String(e?.message || '').includes('Cannot find package') || String(e).includes('ERR_MODULE_NOT_FOUND')) {
          return skipped('missing_dependency', 'Install the openai package: npm i openai');
        }
        return skipped('provider_error', e.message);
      }
      // Otherwise, fall through to Ollama path
      console.warn('[Copilot] OpenAI failed, attempting Ollama:', e?.message || e);
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

