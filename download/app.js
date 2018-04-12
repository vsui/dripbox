const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Router = require('koa-router');
const winston = require('winston');

const s3 = new AWS.S3();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const app = new Koa();
app.use(bodyParser());
const router = new Router();

app.use(async (ctx, next) => {
  const { authorization } = ctx.headers;
  if (!authorization) {
    logger.info('No Authorization header');
    ctx.status = 401;
    return;
  }
  const split = authorization.split(' ');
  if (split.length !== 2) {
    logger.info(`Malformed Authorization header: ${authorization}`);
    ctx.status = 401;
    return;
  }
  const [type, token] = split;
  if (type !== 'Bearer') {
    logger.info(`Bad authorization type: ${type}`);
    ctx.status = 401;
    return;
  }
  logger.info('Querying auth service');
  const response = await fetch(`${process.env.AUTH_URL}/verify`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  const verified = response.status === 204;
  if (!verified) {
    logger.info(`Unauthorized JWT: ${token}`);
    ctx.status = 401;
    return;
  }
  logger.info('Verified');
  await next();
});

router
  .get('/', async (ctx, next) => {
    ctx.body = 'EUJAKLOIO';
  })
  .get('/:key', async (ctx, next) => {
    const { key } = ctx.params;
    if (!key) {
      ctx.status = 204;
      return;
    }
    logger.info(`Retrieving ${key}`);
    const response = await s3.getObject({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    }).promise();
    // Response set to null if error occurs
    // NoSuchKey: The specified key does not exist.
    logger.info(`Retrieved ${key}`);
    ctx.body = response.Body;
    ctx.status = 200;
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT, () => logger.info(`Listening on ${process.env.PORT}`));
