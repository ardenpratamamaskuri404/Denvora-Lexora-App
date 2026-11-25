/**
 * @module config/env
 * @description Konfigurasi terpusat environment backend dari file .env.
 */

require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'denvora_lexora',
  },
  sessionSecret: process.env.SESSION_SECRET || 'dev_fallback_secret_change_in_env',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  cookieName: process.env.COOKIE_NAME || 'denvora_session',
  sessionTtlMs: 1000 * 60 * 60 * 12,
};

module.exports = env;
