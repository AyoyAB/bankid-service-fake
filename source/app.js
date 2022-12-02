import Koa from 'koa';
import log from 'loglevel';
import fs from 'node:fs/promises';
import https from 'node:https';

import config from './config/index.js';
import certMiddleware from './middleware/cert.js';
import router from './routers/root.js';

const app = new Koa();

app.use(certMiddleware);

app.use(router.routes(), router.allowedMethods());

const httpsOptions = {
  // Use the supplied or generated server key pair.
  key: await fs.readFile(config.tls.keyFile, { encoding: 'utf8' }),
  cert: await fs.readFile(config.tls.certFile, { encoding: 'utf8' }),
  // Require client certificates.
  requestCert: true,
  rejectUnauthorized: true,
  // Trust the supplied or generated client CA certificate.
  ca: [await fs.readFile(config.tls.caFile, { encoding: 'utf8' })],
};

https.createServer(httpsOptions, app.callback()).listen(config.tls.port);

log.setLevel(config.logging.level, false);

log.info(`Listening on port ${config.tls.port}.`);
