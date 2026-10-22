import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth-routes.js';
import contributorRoutes from './routes/contributor-routes.js';
import storyRoutes from './routes/story-routes.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: frontendOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/contributors', contributorRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
