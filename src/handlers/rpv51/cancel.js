async function cancelHandler(ctx, next) {
  ctx.body = 'cancel';
  await next();
}

export default cancelHandler;
