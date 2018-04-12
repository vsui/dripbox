const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Router = require('koa-router');

const auth = require('dripbox-common/auth');
const logger = require('dripbox-common/logger');
const { deleteObject, uploadObject } = require('./middleware');

const app = new Koa();
app.use(bodyParser());
const router = new Router();

app.use(auth);

router
  .delete('/', deleteObject)
  .post('/', uploadObject);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT, () => logger.info(`Listening on ${process.env.PORT}`));
