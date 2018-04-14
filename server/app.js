const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Router = require('koa-router');

const { login, register, verify } = require('./middleware/auth');
const { download } = require('./middleware/download');
const { remove, upload } = require('./middleware/upload');

const logger = require('./util/logger');

const app = new Koa();
app.use(bodyParser());

const secured = new Router();
const unsecured = new Router();

unsecured
  .post('/login', login)
  .post('/register', register);

secured
  .use(verify)
  .get('/files/:key', download)
  .delete('/files/:key', remove)
  .post('/files/:key', upload);

app
  .use(unsecured.routes()) // Register unsecured routes before the router
  .use(unsecured.allowedMethods())
  .use(secured.routes())
  .use(secured.allowedMethods());

app.listen(process.env.PORT, () => logger.info(`Listening on ${process.env.PORT}`));
