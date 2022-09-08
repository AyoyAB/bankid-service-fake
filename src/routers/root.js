const Router = require('koa-router');
const rpv51 = require('./rpv51');

const root = new Router();
root.use('/rp/v5.1', rpv51.routes(), rpv51.allowedMethods());

module.exports = root;
