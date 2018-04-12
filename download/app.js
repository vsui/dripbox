const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Router = require('koa-router');

const { download } = require('./middleware');
const logger = require('dripbox-common/logger');
const auth = require('dripbox-common/auth');

const app = new Koa();
app.use(bodyParser());
const router = new Router();

app.use(auth);

router
  .get('/:key', download);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT, () => logger.info(`Listening on ${process.env.PORT}`));
