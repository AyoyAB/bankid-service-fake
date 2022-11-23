import Koa from 'koa';
import fs from 'node:fs/promises';
import https from 'node:https';

import certMiddleware from './middleware/cert.js';
import router from './routers/root.js';

const app = new Koa();

app.use(certMiddleware);

app.use(router.routes(), router.allowedMethods());

const httpsOptions = {
  // Use the supplied or generated server key pair.
  key: await fs.readFile('data/tls/server.key', { encoding: 'utf8' }),
  cert: await fs.readFile('data/tls/server.crt', { encoding: 'utf8' }),
  // Require client certificates.
  requestCert: true,
  rejectUnauthorized: true,
  // Trust the supplied or generated client CA certificate.
  ca: [await fs.readFile('data/tls/client-ca.crt', { encoding: 'utf8' })],
};

https.createServer(httpsOptions, app.callback()).listen(3000);

console.log('Listening on port 3000.');
