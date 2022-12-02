import log from 'loglevel';

/**
 * Koa middleware used to log the request body.
 *
 * NB: Needs to be placed after the `koa-body` middleware.
 *
 * @param {Object} ctx - The request context.
 * @param {function} next - The next handler in the chain.
 */
export default async function requestLoggerMiddleware(ctx, next) {
  if (ctx.request.body) {
    log.debug(`Request body: ${JSON.stringify(ctx.request.body)}.`);
  }

  await next();
}
