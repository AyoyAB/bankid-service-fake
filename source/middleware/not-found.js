import log from 'loglevel';

/**
 * Koa middleware used to log info about unhandled requests.
 *
 * NB: Needs to be placed early in the middleware chain.
 *
 * @param {Object} ctx - The request context.
 * @param {function} next - The next handler in the chain.
 */
export default async function notFoundMiddleware(ctx, next) {
  await next();

  if (ctx.status == 404) {
    log.warn(
      `No matching handler found for endpoint ${JSON.stringify(
        ctx.request.url
      )}.`
    );
  }
}
