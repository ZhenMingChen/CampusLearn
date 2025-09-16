// backend/src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Security & basics
app.use(helmet());
app.use(cors(corsOptions));            // CORS early
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Health + root info
app.get('/', (_req, res) => res.send('CampusLearn API is running. See /api/v1'));
app.get('/api/v1/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// API
app.use('/api/v1', routes);

// Errors
app.use(errorHandler);

export default app;

