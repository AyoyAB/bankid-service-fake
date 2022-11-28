import { X509Certificate } from 'node:crypto';

async function certMiddleware(ctx, next) {
  const clientCert = ctx.req.socket.getPeerCertificate(false);

  if (clientCert != null && clientCert != {}) {
    ctx.state.clientCert = new X509Certificate(clientCert.raw);
  }

  await next();
}

export default certMiddleware;
