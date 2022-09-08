const Koa = require('koa');
const router = require('./routers/root');

const app = new Koa();

app.use(router.routes(), router.allowedMethods());

// Optionally start listening if this is the main module.
if (typeof module !== 'undefined' && require.main === module) {
  app.listen(3000);
  console.log('Listening on port 3000.');
}
