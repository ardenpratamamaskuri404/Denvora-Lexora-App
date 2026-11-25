/**
 * @module server
 * @description Entrypoint menjalankan HTTP server Express pada localhost.
 */

const env = require('./config/env');
const app = require('./app');
const { appendLog } = require('./utils/fileHelper');

app.listen(env.port, () => {
  const msg = `Denvora Lexora API berjalan di http://localhost:${env.port} (Swagger: /api-docs)`;
  console.log(msg);
  appendLog('INFO', 'server.start', msg);
});
