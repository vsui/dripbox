const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Koa = require('koa');
const Router = require('koa-router');
const auth = require('./middleware/auth');
const formidable = require('koa2-formidable');

const { download, list } = require('./middleware/download');
const { remove, upload } = require('./middleware/upload');
const logger = require('./util/logger');
const credentialStore = require('./util/credentialStore');

credentialStore.then((store) => {
  const { login, register, verify } = auth(store);

  const app = new Koa();
  app.use(cors());
  app.use(bodyParser({
    enableTypes: ['json', 'form'],
    textLimit: '5gb',
    onerror: (err, ctx) => {
      logger.err(err);
      ctx.throw(err);
    },
  }));

  app.use(async (ctx, next) => {
    logger.info(`${ctx.request.method} ${ctx.url}`);
    logger.info(`Body: ${ctx.body}`);
    await next();
    logger.info(`${ctx.request.method} ${ctx.url} - ${ctx.status}`);
  });

  const secured = new Router();
  const unsecured = new Router();

  unsecured
    .post('/login', login)
    .post('/register', register);

  secured
    .use(verify)
    .get('/files', list)
    .get('/files/:key', download)
    .delete('/files/:key', remove)
    .post('/files/:key', formidable(), upload);

  app
    .use(unsecured.routes())
    .use(unsecured.allowedMethods())
    .use(secured.routes())
    .use(secured.allowedMethods());

  app.listen(process.env.PORT, () => logger.info(`Listening on ${process.env.PORT}`));
});
