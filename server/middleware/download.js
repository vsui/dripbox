const logger = require('../util/logger');
const s3 = require('../util/s3');

const download = async (ctx) => {
  const { key, username } = ctx.params;
  if (!key) {
    ctx.status = 204;
    return;
  }
  logger.info(`Retrieving ${key} for ${username}`);
  const response = await s3.getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: `${username}/${key}`,
  }).promise();
  // Response set to null if error occurs
  // NoSuchKey: The specified key does not exist.
  // logger.info(`Retrieved ${key}`);
  ctx.body = response.Body;
  ctx.status = 200;
};

const list = async (ctx) => {
  const { username } = ctx.params;
  logger.info(`Retrieving all keys for ${username}`);
  const response = await s3.listObjectsV2({
    Bucket: process.env.BUCKET_NAME,
    MaxKeys: 100,
    Prefix: username,
  }).promise();

  response.Contents = response.Contents.map(contents =>
    ({ ...contents, Key: contents.Key.slice(username.length + 1) }));

  ctx.body = response.Contents;
  ctx.status = 200;
};

module.exports = { download, list };
