import { parseAuthSignRequest } from '../../lib/request.js';

async function signHandler(ctx, next) {
  const request = parseAuthSignRequest(ctx.request.body);

  ctx.body = { op: 'sign', request };

  await next();
}

export default signHandler;
