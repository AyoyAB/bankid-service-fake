import Router from 'koa-router';
import koaBody from 'koa-body';

import authHandler from '../handlers/rpv51/auth.js';
import signHandler from '../handlers/rpv51/sign.js';
import collectHandler from '../handlers/rpv51/collect.js';
import cancelHandler from '../handlers/rpv51/cancel.js';

const rpv51 = new Router();

rpv51.post('/auth', koaBody(), authHandler);
rpv51.post('/sign', koaBody(), signHandler);
rpv51.post('/collect', koaBody(), collectHandler);
rpv51.post('/cancel', koaBody(), cancelHandler);

export default rpv51;
