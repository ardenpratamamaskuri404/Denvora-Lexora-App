/**
 * @module app
 * @description Konfigurasi aplikasi Express (TypeScript), CORS, Swagger UI offline, dan mounting routes.
 */

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { checkConnection } from './config/db';
import { openApiSpec } from './docs/openapi';
import { sendSuccess, sendError } from './utils/response';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get('/api/health', async (_req, res) => {
  try {
    await checkConnection();
    return sendSuccess(res, 200, 'Server dan database MySQL aktif', {
      status: 'ok',
      database: 'connected',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return sendError(res, 503, `Server aktif, database belum terhubung: ${message}`);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);
