// backend/src/controllers/auth.controller.js
import 'dotenv/config';
import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

function signAccess(payload) {
  const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
  return jwt.sign(payload, secret, { expiresIn: '30m' });
}

function signRefresh(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

/**
 * POST /auth/register
 * body: { name, email, password, role } // role: 'STUDENT'|'TUTOR'|'ADMIN'
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role = 'STUDENT' } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'name, email, password required' } });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already registered' } });
    }
    const hash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: { name, email, password: hash, role, verified: false },
      select: { id: true, name: true, email: true, role: true, verified: true }
    });
    // In a real app, send verification email here
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/login
 * body: { email, password }
 * returns: { accessToken, refreshToken, user }
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'email and password required' } });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/refresh
 * header: x-refresh-token: <refreshToken>
 * returns: { accessToken }
 */
export async function refresh(req, res, next) {
  try {
    const token = req.headers['x-refresh-token'];
    if (!token) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing refresh token' } });
    }
    const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
    const decoded = jwt.verify(token, secret); // { sub, role }
    const accessToken = signAccess({ sub: decoded.sub, role: decoded.role });
    return res.json({ accessToken });
  } catch (_e) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' } });
  }
}

/**
 * POST /auth/verify
 * (Mock) body: { email } OR { userId }
 * Sets user.verified = true (simulates clicking email link)
 */
export async function verifyEmailMock(req, res, next) {
  try {
    const { email, userId } = req.body || {};
    if (!email && !userId) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'email or userId required' } });
    }

    const where = email ? { email } : { id: userId };
    const user = await prisma.user.findUnique({ where });
    if (!user) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    const updated = await prisma.user.update({
      where,
      data: { verified: true },
      select: { id: true, name: true, email: true, role: true, verified: true }
    });

    return res.json({ ok: true, user: updated });
  } catch (err) {
    next(err);
  }
}

