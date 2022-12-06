import log from 'loglevel';

import { parseAuthSignRequest } from '../../lib/request.js';

export default function createAuthHandler(dispatcher) {
  const dispatch = dispatcher.auth;

  return async function (ctx, next) {
    log.info(`Received auth request from ${ctx.request.ip}.`);

    // Make sure we have a client certificate.
    ctx.assert(ctx.state.clientCert, 401, 'No client certificate in request');

    // Parse the request.
    const req = parseAuthSignRequest(ctx.request.body);

    // Dispatch the request.
    const resp = dispatch(ctx.state.clientCert, req);

    // Set the response.
    ctx.body = resp;

    log.info(`Successfully processed auth request.`);

    await next();
  };
}
