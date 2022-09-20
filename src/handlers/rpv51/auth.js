import * as cache from '../../lib/cache.js';
import * as response from '../../lib/response.js';

async function authHandler(ctx, next) {
  // Generate a new order reference for this authentication.
  const orderRef = cache.createOrderRef();

  // Default to letting this transaction expire after a few collects.
  const collectResponses = [
    response.createPendingCollectResponse(orderRef, 'outstandingTransaction'),
    response.createPendingCollectResponse(orderRef, 'noClient'),
    response.createFailedCollectResponse(orderRef, 'expiredTransaction'),
  ];
  cache.setPendingAuth(orderRef, collectResponses);

  // Create an auth response from the order reference.
  const authResponse = response.createAuthSignResponse(orderRef);
  ctx.body = authResponse;

  await next();
}

export default authHandler;
