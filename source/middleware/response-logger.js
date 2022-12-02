import log from 'loglevel';

/**
 * Koa middleware used to log the response body.
 *
 * @param {Object} ctx - The request context.
 * @param {function} next - The next handler in the chain.
 */
export default async function responseLoggerMiddleware(ctx, next) {
  await next();

  if (ctx.body) {
    log.debug(`Response body: ${JSON.stringify(ctx.body)}.`);
  }
}
