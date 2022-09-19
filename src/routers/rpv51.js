import Router from 'koa-router';
import koaBody from 'koa-body';

const rpv51 = new Router();

rpv51.post('/auth', koaBody(), async (ctx, next) => {
  // TODO: Forward to handler instead.
  ctx.body = 'auth';
  await next();
});

rpv51.post('/sign', koaBody(), async (ctx, next) => {
  // TODO: Forward to handler instead.
  ctx.body = 'sign';
  await next();
});

rpv51.post('/collect', koaBody(), async (ctx, next) => {
  // TODO: Forward to handler instead.
  ctx.body = 'collect';
  await next();
});

rpv51.post('/cancel', koaBody(), async (ctx, next) => {
  // TODO: Forward to handler instead.
  ctx.body = 'cancel';
  await next();
});

export default rpv51;
