import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
import * as ctrl from '../controllers/auth.controller.js';

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and session endpoints
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: Alice }
 *               email:    { type: string, format: email, example: alice@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       201: { description: User created }
 *       400: { description: Validation error }
 */
const r = Router();
r.post('/register', validate(registerSchema), ctrl.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, format: email, example: student@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200: { description: JWT issued (and/or refresh token cookie set) }
 *       401: { description: Invalid credentials }
 *       400: { description: Validation error }
 */
r.post('/login', validate(loginSchema), ctrl.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Exchanges a valid refresh token (e.g., from cookie) for a new access token.
 *     responses:
 *       200: { description: New access token returned }
 *       401: { description: Missing or invalid refresh token }
 */
r.post('/refresh', ctrl.refresh);

/**
 * @openapi
 * /auth/verify:
 *   post:
 *     summary: Verify email (demo/mock)
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *     responses:
 *       200: { description: Email verified (mock) }
 */
r.post('/verify', ctrl.verifyEmailMock);

export default r;
