import { parseAuthSignRequest } from '../../lib/request.js';

export default function createSignHandler(dispatcher) {
  const dispatch = dispatcher.sign;

  return async function (ctx, next) {
    // Make sure we have a client certificate.
    ctx.assert(ctx.state.clientCert, 401, 'No client certificate in request');

    // Parse the request.
    const req = parseAuthSignRequest(ctx.request.body);

    // Dispatch the request.
    const resp = dispatch(ctx.state.clientCert, req);

    // Set the response.
    ctx.body = resp;

    await next();
  };
}
