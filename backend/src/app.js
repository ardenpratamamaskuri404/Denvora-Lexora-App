/**
 * @module app
 * @description Konfigurasi aplikasi Express, CORS, Swagger UI offline, dan mounting routes.
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const { checkConnection } = require('./config/db');
const openApiSpec = require('./docs/openapi');
const { sendSuccess, sendError } = require('./utils/response');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

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
    return sendError(res, 503, `Server aktif, database belum terhubung: ${err.message}`);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
