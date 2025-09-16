import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signAccess, signRefresh } from '../utils/jwt.js';
const prisma = new PrismaClient();

export async function register({ name, email, password, role }){
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already used'), { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hash, role } });
  console.log(`[EMAIL:mock] Verify link sent to ${email}`);
  return { id: user.id, email: user.email };
}

export async function login({ email, password }){
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  return { accessToken, refreshToken, role: user.role, user: { id: user.id, email: user.email, name: user.name } };
}

export async function refresh(refreshToken){
  if (!refreshToken) throw Object.assign(new Error('Missing refresh token'), { status: 401 });
  let payload;
  try { payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); }
  catch { throw Object.assign(new Error('Invalid refresh token'), { status: 401 }); }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return { accessToken: signAccess(user) };
}

export async function verifyEmailMock(email){
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  await prisma.user.update({ where: { email }, data: { verified: true } });
}
