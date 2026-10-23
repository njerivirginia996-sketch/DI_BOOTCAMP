import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth-routes.js';
import contributorRoutes from './routes/contributor-routes.js';
import commentRoutes from './routes/comment-routes.js';
import shareRoutes from './routes/share-routes.js';
import storyRoutes from './routes/story-routes.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { isAllowedFrontendOrigin } from './helpers/origin.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || isAllowedFrontendOrigin(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '600kb' }));
app.use(cookieParser());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/contributors', contributorRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
