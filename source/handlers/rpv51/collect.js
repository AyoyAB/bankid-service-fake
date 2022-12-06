import log from 'loglevel';

import * as cache from '../../lib/cache.js';
import * as request from '../../lib/request.js';
import * as response from '../../lib/response.js';

export default async function collectHandler(ctx, next) {
  log.info(`Received collect request from ${ctx.request.ip}.`);

  // Make sure we have a client certificate.
  ctx.assert(ctx.state.clientCert, 401, 'No client certificate in request');

  // Extract the order reference from the request.
  const { orderRef } = request.parseCollectCancelRequest(ctx.request.body);

  let collectResponse;
  if (cache.hasPendingAuth(orderRef)) {
    // We found a matching authentication, so fetch its responses.
    const responses = cache.getPendingAuth(orderRef);

    // We'll want to return the first one.
    collectResponse = responses.shift();

    // Now check how we should handle the cache.
    if (responses.length === 0) {
      // The array is empty, so delete the item from the cache.
      cache.deletePendingAuth(orderRef);
    } else {
      // There are still responses left to send, so write them to the cache.
      cache.setPendingAuth(orderRef, responses);
    }
  } else if (cache.hasPendingSign(orderRef)) {
    // We found a matching signature, so fetch its responses.
    const responses = cache.getPendingSign(orderRef);

    // We'll want to return the first one.
    collectResponse = responses.shift();

    // Now check how we should handle the cache.
    if (responses.length === 0) {
      // The array is empty, so delete the item from the cache.
      cache.deletePendingSign(orderRef);
    } else {
      // There are still responses left to send, so write them to the cache.
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

  // Set the response.
  ctx.body = collectResponse;

  log.info(`Successfully processed collect request.`);

  await next();
}
