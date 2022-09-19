import { parseAuthSignRequest } from '../../lib/request.js';

async function authHandler(ctx, next) {
  const request = parseAuthSignRequest(ctx.request.body);

  ctx.body = { op: 'auth', request };

  await next();
}

export default authHandler;
