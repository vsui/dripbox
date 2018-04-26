const logger = require('../util/logger');
const s3 = require('../util/s3');

const { isInPath, getRelativeUrl } = require('../util/helpers');

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

/**
 * Sets the `ctx.body` to a list of the contents folder of the url parameter `key`
 * @param {koa.Context} ctx
 */
const listFolder = async (ctx) => {
  logger.debug('ru=an this');
  if (!ctx.url.startsWith('/folders') || ctx.request.method !== 'GET') {
    return;
  }
  const path = `${ctx.url.substring('/folders'.length)}${ctx.url.endsWith('/') ? '' : '/'}`;
  const { username } = ctx.params;
  logger.info(`Retrieving contents of ${path} for ${username}`);
  const response = await s3.listObjectsV2({
    Bucket: process.env.BUCKET_NAME,
    Prefix: `${username}${path}`,
  }).promise();
  if (response.Contents.length === 0) {
    logger.info(`Could not find folder ${path} for ${username} (${username}${path})`);
    ctx.status = 404;
    return;
  }
  const files = response.Contents.map(contents => ({
    fileName: contents.Key.slice(username.length),
    fileSize: contents.Size,
    lastModified: contents.LastModified,
  }));
  const filesInFolder = files.filter(file => isInPath(path, file.fileName));
  const relativePaths = filesInFolder.map(file =>
    ({ ...file, fileName: getRelativeUrl(path, file.fileName).substring(1) }));
  ctx.body = relativePaths;
  ctx.status = 200;
};

const list = async (ctx) => {
  const { username } = ctx.params;
  logger.info(`Retrieving all keys for ${username}`);
  try {
    const response = await s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      MaxKeys: 100,
      Prefix: username,
    }).promise();
    ctx.body = response.Contents.map(contents =>
      ({
        fileName: contents.Key.slice(username.length + 1),
        fileSize: contents.Size,
        lastModified: contents.LastModified,
      }));
  } catch (err) {
    logger.err(err);
    ctx.body = [];
  }
  logger.info('Keys retrieved');
  ctx.status = 200;
  logger.info('Done listing');
};

module.exports = { download, list, listFolder };
