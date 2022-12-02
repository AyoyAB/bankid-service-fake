import { X509Certificate } from 'node:crypto';
import log from 'loglevel';

/**
 * Koa middleware used to store the TLS client certificate in the request
 * context.
 *
 * @param {Object} ctx - The request context.
 * @param {function} next - The next handler in the chain.
 */
async function certMiddleware(ctx, next) {
  const clientCert = ctx.req.socket.getPeerCertificate(false);

  if (clientCert != null && clientCert != {}) {
    ctx.state.clientCert = new X509Certificate(clientCert.raw);
    log.debug(
      `Relying Party certificate: ${JSON.stringify(
        ctx.state.clientCert.toString()
      )}.`
    );
  }

  await next();
}

export default certMiddleware;
