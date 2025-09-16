// backend/src/routes/file.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../utils/storage.js';
import * as ctrl from '../controllers/file.controller.js';

const r = Router();

// ✅ pass the middleware reference (no parentheses)
r.post('/upload', requireAuth, upload.single('file'), ctrl.upload);

export default r;
