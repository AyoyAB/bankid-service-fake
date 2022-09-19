import Koa from 'koa';
import { promises as fs } from 'fs';
import https from 'https';

import router from './routers/root.js';

const app = new Koa();

app.use(router.routes(), router.allowedMethods());

const httpsOptions = {
  // Use the supplied or generated server key pair.
  key: await fs.readFile('data/server.key', { encoding: 'utf8' }),
  cert: await fs.readFile('data/server.crt', { encoding: 'utf8' }),
  // Require client certificates.
  requestCert: true,
  // Trust the supplied or generated client CA certificate.
  ca: [await fs.readFile('data/client-ca.crt', { encoding: 'utf8' })],
};

https.createServer(httpsOptions, app.callback()).listen(3000);

console.log('Listening on port 3000.');
