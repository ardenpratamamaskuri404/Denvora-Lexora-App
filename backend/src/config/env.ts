/**
 * @module config/env
 * @description Konfigurasi terpusat environment backend dari file .env.
 */

import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'denvora_lexora',
  },
  smtp: {
    host: process.env.SMTP_HOST || '127.0.0.1',
    port: Number(process.env.SMTP_PORT || 1025),
    from: process.env.SMTP_FROM || 'Denvora Lexora <no-reply@denvora.local>',
  },
  mailpitUrl: process.env.MAILPIT_URL || 'http://127.0.0.1:8025',
  sessionSecret: process.env.SESSION_SECRET || 'dev_fallback_secret_change_in_env',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  cookieName: process.env.COOKIE_NAME || 'denvora_session',
  sessionTtlMs: 1000 * 60 * 60 * 12,
};
