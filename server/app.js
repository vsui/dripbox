const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Koa = require('koa');
const Router = require('koa-router');
const auth = require('./middleware/auth');
const downloadMiddleware = require('./middleware/download');
const uploadMiddleware = require('./middleware/upload');
const formidable = require('koa2-formidable');

const logger = require('./util/logger');
const stores = require('./util/credentialStore');

stores.then(({ credentialStore, sharedStore }) => {
  const { login, register, verify } = auth(credentialStore);
  const {
    download,
    listFolder,
    downloadSharedFile,
    listSharedFolder,
  } = downloadMiddleware(sharedStore);
  const {
    remove,
    upload,
    addFolder,
    removeFolder,
    shareFile,
    shareFolder,
  } = uploadMiddleware(sharedStore);

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
    await next();
    logger.info(`${ctx.request.method} ${ctx.url} - ${ctx.status}`);
  });

  const unsecured = new Router();

  unsecured
    .post('/login', login)
    .post('/register', register);

  app
    .use(unsecured.routes())
    .use(unsecured.allowedMethods())
    .use(downloadSharedFile)
    .use(listSharedFolder)
    .use(verify)
    .use(remove)
    .use(addFolder)
    .use(download)
    .use(removeFolder)
    .use(shareFile)
    .use(shareFolder)
    .use(formidable())
    .use(upload)
    .use(listFolder);

  app.listen(process.env.PORT, () => logger.info(`Listening on ${process.env.PORT}`));
});
