import * as cache from '../../lib/cache.js';
import * as response from '../../lib/response.js';

async function signHandler(ctx, next) {
  // Generate a new order reference for this signature.
  const orderRef = cache.createOrderRef();

  // Default to letting this transaction expire after a few collects.
  const collectResponses = [
    response.createPendingCollectResponse(orderRef, 'outstandingTransaction'),
    response.createPendingCollectResponse(orderRef, 'noClient'),
    response.createFailedCollectResponse(orderRef, 'expiredTransaction'),
  ];
  cache.setPendingSign(orderRef, collectResponses);

  // Create a sign response from the order reference.
  const signResponse = response.createAuthSignResponse(orderRef);
  ctx.body = signResponse;

  await next();
}

export default signHandler;
