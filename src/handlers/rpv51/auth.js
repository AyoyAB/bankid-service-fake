async function authHandler(ctx, next) {
  ctx.body = 'auth';
  await next();
}

export default authHandler;
