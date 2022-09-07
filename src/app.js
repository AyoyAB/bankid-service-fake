const Koa = require('koa');

const app = new Koa();

// Just return a canned response for now.
app.use(async (ctx) => {
  ctx.body = 'Hello, world!';
});

// Optionally start listening if this is the main module.
if (typeof module !== 'undefined' && require.main === module) {
  app.listen(3000);
  console.log('Listening on port 3000.');
}
