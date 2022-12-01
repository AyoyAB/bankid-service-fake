import Router from 'koa-router';

import rpv51 from './rpv51.js';

const root = new Router();

root.use('/rp/v5.1', rpv51.routes(), rpv51.allowedMethods());

export default root;
