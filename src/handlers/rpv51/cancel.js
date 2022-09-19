import { parseCollectCancelRequest } from '../../lib/request.js';

async function cancelHandler(ctx, next) {
  const request = parseCollectCancelRequest(ctx.request.body);

  ctx.body = { op: 'cancel', request };

  await next();
}

export default cancelHandler;
