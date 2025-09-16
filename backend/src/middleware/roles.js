// backend/src/middleware/roles.js
export function requireRole(roles = []) {
  const allow = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    try {
      const role = req.user?.role; // set by your auth middleware after JWT verifies
      if (!role || (allow.length && !allow.includes(role))) {
        return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
