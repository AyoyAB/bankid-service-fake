import Koa from 'koa';
import { promises as fs } from 'fs';
import https from 'https';

import router from './routers/root.js';

const app = new Koa();

app.use(router.routes(), router.allowedMethods());

app.listen(3000);
console.log('Listening on port 3000.');
