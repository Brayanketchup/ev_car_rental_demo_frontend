import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { healthRouter } from './modules/health/health.routes.js';
export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
}));
app.use(express.json({
    limit: '1mb',
}));
app.use(express.urlencoded({
    extended: false,
    limit: '1mb',
}));
app.use('/api/v1/health', healthRouter);
app.use(notFoundHandler);
app.use(errorHandler);
//# sourceMappingURL=app.js.map