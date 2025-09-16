import 'dotenv/config';
import app from './app.js';
import { limiter } from './middleware/rateLimit.js';

const port = process.env.PORT || 4000;
app.use(limiter);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
