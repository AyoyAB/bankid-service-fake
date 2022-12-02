import Router from 'koa-router';
import { koaBody } from 'koa-body';

import createDispatcher from '../dispatcher/index.js';
import createAuthHandler from '../handlers/rpv51/auth.js';
import createSignHandler from '../handlers/rpv51/sign.js';
import collectHandler from '../handlers/rpv51/collect.js';
import cancelHandler from '../handlers/rpv51/cancel.js';
import requestLoggerMiddleware from '../middleware/request-logger.js';
import responseLoggerMiddleware from '../middleware/response-logger.js';

const dispatcher = createDispatcher();

const rpv51 = new Router();

rpv51.use(koaBody());
rpv51.use(requestLoggerMiddleware);
rpv51.use(responseLoggerMiddleware);

rpv51.post('/auth', createAuthHandler(dispatcher));
rpv51.post('/sign', createSignHandler(dispatcher));
rpv51.post('/collect', collectHandler);
rpv51.post('/cancel', cancelHandler);

export default rpv51;
