import log from 'loglevel';

/**
 * Koa middleware used to handle uncaught errors.
 *
 * NB: Needs to be placed early in the middleware chain.
 *
 * @param {Object} ctx - The request context.
 * @param {function} next - The next handler in the chain.
 */
export default async function errorHandlerMiddleware(ctx, next) {
  try {
    await next();
  } catch (err) {
    log.warn(`Unhandled error caught: ${JSON.stringify(err.toString())}.`);

    err.status = err.statusCode || err.status || 500;

    throw err;
  }
}
