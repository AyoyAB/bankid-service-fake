async function signHandler(ctx, next) {
  ctx.body = 'sign';
  await next();
}

export default signHandler;
