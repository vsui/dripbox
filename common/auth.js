const fetch = require('node-fetch');

const logger = require('./logger');

module.exports = async (ctx, next) => {
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
};
