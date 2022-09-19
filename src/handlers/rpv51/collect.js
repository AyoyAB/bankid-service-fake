import { parseCollectCancelRequest } from '../../lib/request.js';

async function collectHandler(ctx, next) {
  const request = parseCollectCancelRequest(ctx.request.body);

  ctx.body = { op: 'collect', request };

  await next();
}

export default collectHandler;
