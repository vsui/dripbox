const bcrypt = require('bcrypt');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const Koa = require('koa');
const MongoDB = require('mongodb');
const winston = require('winston');

const Router = require('koa-router');

const app = new Koa();
app.use(bodyParser());
const router = new Router();

const { MongoClient } = MongoDB;

const SALT_ROUNDS = 10;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

let credentialStore = null;
MongoClient.connect(process.env.MONGO_URL)
  .catch(() => {
    logger.error(`could not connect to ${process.env.MONGO_URL}`);
    process.exit(1);
  })
  .then((client) => {
    const db = client.db('auth');
    credentialStore = db.collection('credentials');
  });

app.use(async (ctx, next) => {
  logger.info(`${ctx.method} ${ctx.url} -> ${JSON.stringify(ctx.request.body)}`);
  ctx.body = ctx.request.body;
  await next();
});

router
  .post('/login', async (ctx) => {
    const { username, password } = ctx.request.body;

    const user = await credentialStore.findOne({ username });

    if (user == null) {
      // To avoid timing attacks
      await bcrypt.compare(password, 'blahblahblah');
      ctx.status = 401; // Not authorized
      ctx.body = {};
      return;
    }

    if (await bcrypt.compare(password, user.hash)) {
      ctx.body = { token: jwt.sign({ username }, process.env.JWT_SECRET) };
      ctx.status = 200; // OK
    } else {
      ctx.status = 401; // Not authorized
      ctx.body = {};
    }
  })
  .post('/register', async (ctx) => {
    const { username, password } = ctx.request.body;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    await credentialStore.insertOne({ username, hash });
    logger.info(`${username} - ${password} - ${hash}`);
    ctx.body = { token };
  })
  .post('/verify', async (ctx) => {
    const { token } = ctx.request.body;
    let verified = false;
    try {
      verified = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      logger.error(err);
      ctx.body = {};
      ctx.status = 401;
      return;
    }

    if (verified) {
      ctx.body = {};
      ctx.status = 204;
    } else {
      ctx.body = {};
      ctx.status = 401;
    }
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT);
