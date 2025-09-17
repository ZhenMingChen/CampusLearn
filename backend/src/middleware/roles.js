export function requireRole(roles = []) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } });
    if (!roles.includes(role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
    }
    next();
  };
}


