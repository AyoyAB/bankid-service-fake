async function collectHandler(ctx, next) {
  ctx.body = 'collect';
  await next();
}

export default collectHandler;
