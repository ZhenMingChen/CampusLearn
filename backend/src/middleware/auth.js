// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

/** Core auth checker */
function _authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing Bearer token' } });
    }
    const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
    const payload = jwt.verify(token, secret); // { sub, role, iat, exp }
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
}

/** Optional auth (sets req.user if token present, otherwise continues) */
function _optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // ignore errors in optional mode
  }
  next();
}

// Export with both names so existing imports work
export const authRequired = _authRequired;
export const requireAuth = _authRequired;   // alias
export const optionalAuth = _optionalAuth;


