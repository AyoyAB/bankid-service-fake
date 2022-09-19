import Router from 'koa-router';

const rpv51 = new Router();

rpv51.post('/auth', (ctx, next) => {
  // TODO: Forward to handler instead.
  ctx.body = 'auth';
  next();
});

rpv51.post('/sign', (ctx, next) => {
  // TODO: Forward to handler instead.
  ctx.body = 'sign';
  next();
});

rpv51.post('/collect', (ctx, next) => {
  // TODO: Forward to handler instead.
  next();
});

rpv51.post('/cancel', (ctx, next) => {
  // TODO: Forward to handler instead.
  next();
});

export default rpv51;
