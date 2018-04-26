const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logger = require('../util/logger');

const SALT_ROUNDS = 10;

module.exports = credentialStore => ({
  async login(ctx) {
    const { username, password } = ctx.request.body;

    const user = await credentialStore.findOne({ username });

    if (user == null) {
      // To avoid timing attacks
      logger.info(`No such user ${username}`);
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
  },

  async register(ctx) {
    const { username, password } = ctx.request.body;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    const user = await credentialStore.findOne({ username });
    if (user !== null) {
      logger.info(`User ${username} already exists!`);
      ctx.status = 401;
      return;
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    await credentialStore.insertOne({ username, hash });
    logger.info(`${username} - ${password} - ${hash}`);
    ctx.body = { token };
    ctx.status = 200;
  },

  async verify(ctx, next) {
    logger.info(`Verifying secure route ${ctx.request.url}`);
    if (ctx.headers.authorization === undefined) {
      logger.info('No Authorization header');
      ctx.status = 401;
      return;
    }
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

    logger.info('Verifying token...');
    let verified = false;
    try {
      verified = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      logger.error(err);
      ctx.body = {};
      ctx.status = 401;
      return;
    }

    if (!verified) {
      logger.info(`Unauthorized JWT: ${token}`);
      ctx.status = 401;
      return;
    }

    const { username } = jwt.decode(token);
    logger.info(`Verified for ${username}`);
    if (ctx.params) {
      ctx.params.username = username;
    } else {
      ctx.params = { username };
    }

    await next();
  },
});

