// backend/src/middleware/error.js
export function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = Number(err.status || 500);
  const code = err.code || (status >= 500 ? 'INTERNAL' : 'BAD_REQUEST');
  const message = err.message || 'Server error';
  res.status(status).json({ error: { code, message } });
}
