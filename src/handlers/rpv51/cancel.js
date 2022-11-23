import * as cache from '../../lib/cache.js';
import * as request from '../../lib/request.js';
import * as response from '../../lib/response.js';

async function cancelHandler(ctx, next) {
  // Make sure we have a client certificate..
  ctx.assert(ctx.state.clientCert, 401, 'No client certificate in request');

  // Extract the order reference from the request.
  const { orderRef } = request.parseCollectCancelRequest(ctx.request.body);

  let cancelResponse = response.createCancelResponse();
  if (cache.hasPendingAuth(orderRef)) {
    // We found a matching authentication, so delete it.
    cache.deletePendingAuth(orderRef);
  } else if (cache.hasPendingSign(orderRef)) {
    // We found a matching signature, so delete it.
    cache.deletePendingSign(orderRef);
  } else {
    // No match was found, so return an error.
    cancelResponse = response.createErrorResponse(
      'invalidParameters',
      'No such order'
    );
    ctx.response.status = 400;
  }

  ctx.body = cancelResponse;

  await next();
}

export default cancelHandler;
