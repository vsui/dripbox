const logger = require('../util/logger');
const s3 = require('../util/s3');

const { isInPath, getRelativeUrl } = require('../util/helpers');

module.exports = sharedStore => ({
  async download(ctx, next) {
    if (ctx.url.startsWith('/files') && ctx.request.method === 'GET') {
      const path = ctx.url.substring('/files'.length);
      const { username } = ctx.params;
      logger.info(`Retrieving ${path} for ${username}`);
      try {
        const response = await s3.getObject({
          Bucket: process.env.BUCKET_NAME,
          Key: `${username}${path}`,
        }).promise();
        ctx.body = response.Body;
        ctx.status = 200;
      } catch (err) {
        if (err.code === 'NoSuchKey') {
          ctx.status = 404;
          return;
        }
        throw err;
      }
    } else {
      await next();
    }
  },

  /**
   * Sets the `ctx.body` to a list of the contents folder of the url parameter `key`
   * @param {koa.Context} ctx
   */
  async listFolder(ctx) {
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
  },

  async list(ctx) {
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
  },

  async downloadSharedFile(ctx, next) {
    if (ctx.url.startsWith('/shared/files/') && ctx.request.method === 'GET') {
      const id = ctx.url.substring('/shared/files/'.length);
      // id is only first
      try {
        const shared = await sharedStore.findOne({ id });
        if (shared === null) {
          ctx.status = 404;
          return;
        }
        const response = await s3.getObject({
          Bucket: process.env.BUCKET_NAME,
          Key: shared.key,
        }).promise();
        ctx.body = response.Body;
        ctx.status = 200;
      } catch (err) {
        logger.error(err.message);
        ctx.status = 500;
      }
    } else {
      await next();
    }
  },

  async listSharedFolder(ctx, next) {
    if (ctx.url.startsWith('/shared/folders/') && ctx.request.method === 'GET') {
      const id = ctx.url.substring('/shared/folders/'.length);
      // only translate first
      try {
        const shared = await sharedStore.findOne({ id });
        if (shared === null) {
          ctx.status = 404;
          return;
        }
        const response = await s3.listObjectsV2({
          Bucket: process.env.BUCKET_NAME,
          Prefix: `${shared.key}`,
        }).promise();

        if (response.Contents.length === 0) {
          logger.info(`Could not find folder ${shared.key}`);
          ctx.status = 404;
          return;
        }

        const path = shared.key.substring(shared.key.indexOf('/'));

        const files = response.Contents.map(contents => ({
          fileName: contents.Key.slice(contents.Key.indexOf('/')),
          fileSize: contents.Size,
          lastModified: contents.LastModified,
        }));
        const filesInFolder = files.filter(file => isInPath(path, file.fileName));
        const relativePaths = filesInFolder.map(file =>
          ({ ...file, fileName: getRelativeUrl(path, file.fileName).substring(1) }));
        ctx.body = relativePaths;
        ctx.status = 200;
      } catch (err) {
        logger.error(err.message);
        ctx.status = 500;
      }
    } else {
      await next();
    }
  },
});
