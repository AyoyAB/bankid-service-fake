import Router from 'koa-router';
import koaBody from 'koa-body';

import createDispatcher from '../dispatcher/index.js';
import createAuthHandler from '../handlers/rpv51/auth.js';
import createSignHandler from '../handlers/rpv51/sign.js';
import collectHandler from '../handlers/rpv51/collect.js';
import cancelHandler from '../handlers/rpv51/cancel.js';

const dispatcher = createDispatcher();

const rpv51 = new Router();

rpv51.post('/auth', koaBody(), createAuthHandler(dispatcher));
rpv51.post('/sign', koaBody(), createSignHandler(dispatcher));
rpv51.post('/collect', koaBody(), collectHandler);
rpv51.post('/cancel', koaBody(), cancelHandler);

export default rpv51;
