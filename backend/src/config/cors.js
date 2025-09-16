// backend/src/config/cors.js
const raw = process.env.CORS_ORIGINS || '';
// always allow Swagger on 4000 + typical localhost variants
const defaults = ['http://localhost:4000', 'http://127.0.0.1:4000'];
// user-provided allowlist (frontend, etc.)
const fromEnv = raw
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowlist = Array.from(new Set([...defaults, ...fromEnv]));

export const corsOptions = {
  origin(origin, callback) {
    // allow non-browser/CLI tools (no Origin header) and same-origin requests
    if (!origin) return callback(null, true);
    if (allowlist.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

