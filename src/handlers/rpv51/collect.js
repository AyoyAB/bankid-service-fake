import * as cache from '../../lib/cache.js';
import * as request from '../../lib/request.js';
import * as response from '../../lib/response.js';

async function collectHandler(ctx, next) {
  // Extract the order reference from the request.
  const { orderRef } = request.parseCollectCancelRequest(ctx.request.body);

  let collectResponse;
  if (cache.hasPendingAuth(orderRef)) {
    // We found a matching authentication, so fetch its responses.
    const responses = cache.getPendingAuth(orderRef);

    // We'll want to return the first one.
    collectResponse = responses.shift();

    // Now write the shifted array back to the cache.
    if (responses.length === 0) {
      // If the array is empty, just remove it so we don't need an additional check when reading.
      cache.deletePendingAuth(orderRef);
    } else {
      cache.setPendingAuth(orderRef, responses);
    }
  } else if (cache.hasPendingSign(orderRef)) {
    // We found a matching signature, so fetch its responses.
    const responses = cache.getPendingSign(orderRef);

    // We'll want to return the first one.
    collectResponse = responses.shift();

    // Now write the shifted array back to the cache.
    if (responses.length === 0) {
      // If the array is empty, just remove it so we don't need an additional check when reading.
      cache.deletePendingSign(orderRef);
    } else {
      cache.setPendingSign(orderRef, responses);
    }
  } else {
    // No match was found, so return an error.
    collectResponse = response.createErrorResponse(
      'invalidParameters',
      'No such order'
    );
    ctx.response.status = 400;
  }
  ctx.body = collectResponse;

  await next();
}

export default collectHandler;
