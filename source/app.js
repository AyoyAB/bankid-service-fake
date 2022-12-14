import Koa from 'koa';
import log from 'loglevel';
import fs from 'node:fs/promises';
import https from 'node:https';
import prefix from 'loglevel-plugin-prefix';

import config from './config/index.js';
import certMiddleware from './middleware/cert.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import router from './routers/root.js';

prefix.reg(log);

log.setLevel(config.logging.level, false);

prefix.apply(log, {
  template: '%t %l:',
  levelFormatter(level) {
    return level.toUpperCase();
  },
  timestampFormatter(date) {
    return date.toISOString();
  },
});

const app = new Koa();

app.use(certMiddleware);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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

log.info(`Listening on port ${config.tls.port}.`);
