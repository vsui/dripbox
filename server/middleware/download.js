const logger = require('../util/logger');
const { s3 } = require('../util/store');

const { isInPath, getRelativeUrl, splitOnSlash } = require('../util/helpers');

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
    let response = null;
    try {
      response = await s3.listObjectsV2({
        Bucket: process.env.BUCKET_NAME,
        Prefix: `${username}${path}`,
      }).promise();
    } catch (err) {
      logger.info(`Could not find folder ${path} for ${username} (${err})`);
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
      const path = ctx.url.substring('/shared/files/'.length);
      const [id, rest] = splitOnSlash(path);
      logger.info(`Getting shared file ${id}`);
      try {
        const shared = await sharedStore.findOne({ id });
        if (shared === null) {
          ctx.status = 404;
          return;
        }
        const key = `${shared.key}${rest}`;
        logger.info(`Parsed key... ${key}`);
        const response = await s3.getObject({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
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

  async getSharedName(ctx, next) {
    if (ctx.url.startsWith('/shared/names/') && ctx.request.method === 'GET') {
      const id = ctx.url.substring('/shared/files/'.length);
      try {
        const shared = await sharedStore.findOne({ id });
        if (shared === null) {
          ctx.status = 404;
          return;
        }
        ctx.body = { key: shared.key };
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
      logger.info(`Listing shared folder ${ctx.url}`);
      const path = ctx.url.substring('/shared/folders/'.length);
      const [id, rest] = splitOnSlash(path);
      // only translate first
      try {
        const shared = await sharedStore.findOne({ id });
        if (shared === null) {
          ctx.status = 404;
          return;
        }
        const key = `${shared.key}${rest}`;
        logger.info(`id ${id} matches ${shared.key} (${rest})`);
        const response = await s3.listObjectsV2({
          Bucket: process.env.BUCKET_NAME,
          Prefix: key,
        }).promise();

        if (response.Contents.length === 0) {
          logger.info(`Could not find folder ${key}`);
          ctx.status = 404;
          return;
        }
        const pathWithoutUsername = `${key.substring(key.indexOf('/'))}${key.endsWith('/') ? '' : '/'}`;
        const files = response.Contents.map(contents => ({
          fileName: contents.Key.slice(contents.Key.indexOf('/')),
          fileSize: contents.Size,
          lastModified: contents.LastModified,
        }));
        const filesInFolder = files.filter(file => isInPath(pathWithoutUsername, file.fileName));
        const relativePaths = filesInFolder.map(file =>
          ({ ...file, fileName: getRelativeUrl(pathWithoutUsername, file.fileName).substring(1) }));
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
