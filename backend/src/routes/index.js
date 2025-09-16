import { Router } from 'express';
import authRoutes from './auth.routes.js';
import topicRoutes from './topic.routes.js';
import replyRoutes from './reply.routes.js';
import fileRoutes from './file.routes.js';
import integrationRoutes from '../integrations/routes.js'; // <-- point to src/integrations/routes.js

const router = Router();

router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/replies', replyRoutes);
router.use('/file', fileRoutes);
router.use('/integrations', integrationRoutes);

export default router;

