import { Router } from 'express';
import auth from './auth.routes.js';
import topic from './topic.routes.js';
import reply from './reply.routes.js';
import file from './file.routes.js';

const r = Router();
r.use('/auth', auth);
r.use('/topics', topic);
r.use('/replies', reply);
r.use('/files', file);
export default r;
