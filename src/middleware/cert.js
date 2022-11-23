async function certMiddleware(ctx, next) {
  const clientCert = ctx.req.socket.getPeerCertificate(false);

  if (clientCert != null && clientCert != {}) {
    ctx.state.clientCert = clientCert;
  }

  await next();
}

export default certMiddleware;
