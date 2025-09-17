import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { corsMiddleware } from './config/cors.js';   // note: using the middleware wrapper
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';
import { swaggerSpec } from './docs/openapi.js';

const app = express();

// Security (relax CSP just enough for swagger-ui)
app.use(helmet({
  contentSecurityPolicy: false,                 // swagger-ui injects inline styles/scripts
  crossOriginResourcePolicy: { policy: 'same-origin' },
}));

app.use(compression());
app.use(corsMiddleware);                        // CORS early
app.options('*', corsMiddleware);               // handle all preflight requests

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Swagger UI (API docs) on same origin -> no cross-site issues
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health + root info
app.get('/', (_req, res) => res.send('CampusLearn API is running. See /api/v1'));
app.get('/api/v1/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// API
app.use('/api/v1', routes);

// Errors
app.use(errorHandler);

export default app;



