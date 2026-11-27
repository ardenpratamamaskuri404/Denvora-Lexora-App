/**
 * @module server
 * @description Entrypoint menjalankan HTTP server Express (TypeScript) pada localhost.
 */

import { env } from './config/env';
import { app } from './app';
import { appendLog } from './utils/fileHelper';

app.listen(env.port, () => {
  const msg = `Denvora Lexora API (TS) berjalan di http://localhost:${env.port} (Swagger: /api-docs)`;
  console.log(msg);
  void appendLog('INFO', 'server.start', msg);
});
