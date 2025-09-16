import jwt from 'jsonwebtoken';
export const signAccess = (user) => jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
export const signRefresh = (user) => jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
