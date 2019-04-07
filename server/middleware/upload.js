const logger = require('../util/logger');
const { s3 } = require('../util/store');
const fs = require('fs');
const uuid = require('uuid/v4');

module.exports = sharedStore => ({
  async remove(ctx, next) {
    if (ctx.url.startsWith('/files') && ctx.request.method === 'DELETE') {
      const path = ctx.url.substring('/files'.length);
      const { username } = ctx.params;
      logger.info(`Deleting ${path} from S3 for ${username}`);
      await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: `${username}${path}`,
      }).promise();
      ctx.status = 204;
    } else {
      await next();
    }
  },

  async upload(ctx, next) {
    if (ctx.url.startsWith('/files') && ctx.request.method === 'PUT') {
      const path = ctx.url.substring('/files'.length);
      const file = ctx.request.files.upload;
      if (!file) {
        ctx.status = 422;
        return;
      }
      const stream = fs.createReadStream(file.path);
      const { username } = ctx.params;

      logger.info(`Uploading ${path} (${file.size}) to S3 for ${username}`);
      await s3.putObject({
        Body: stream,
        Bucket: process.env.BUCKET_NAME,
        Key: `${username}${path}`,
      }).promise();

      ctx.status = 204;
    } else {
      await next();
    }
  },

  async addFolder(ctx, next) {
    if (ctx.url.startsWith('/folders') && ctx.request.method === 'PUT') {
      const path = ctx.url.substring('/folders'.length);
      const { username } = ctx.params; // TODO Verify folderName is ok
      logger.info(`Adding folder at ${path} for ${username}`);
      await s3.putObject({
        Body: '',
        Bucket: process.env.BUCKET_NAME,
        Key: `${username}${path}/`,
      }).promise();
      ctx.status = 204;
    } else {
      await next();
    }
  },

  async removeFolder(ctx, next) {
    if (ctx.url.startsWith('/folders') && ctx.request.method === 'DELETE') {
      const path = ctx.url.substring('/folders'.length);
      const { username } = ctx.params; // Blahblahblah...
      const response = await s3.listObjectsV2({
        Bucket: process.env.BUCKET_NAME,
        Prefix: `${username}${path}/`,
      }).promise();
      if (response.Contents.length === 0) {
        logger.info(`Could not find folder ${path} for ${username} (${username}${path})`);
        ctx.status = 404;
        return;
      }
      if (!response.Contents.some(({ Key }) => Key === `${username}${path}/`)) {
        logger.info(`Attempted to delete folder ${path} for ${username}, but ${path} is not a folder`);
        ctx.status = 404;
        return;
      }
      try {
        await s3.deleteObjects({
          Bucket: process.env.BUCKET_NAME,
          Delete: {
            Objects: response.Contents.map(({ Key }) => ({ Key })),
          },
        }).promise();
        logger.info(`Successfully delete ${path} for ${username}`);
        ctx.status = 204;
        return;
      } catch (err) {
        logger.err(err);
        throw err;
      }
    } else {
      await next();
    }
  },

  async shareFile(ctx, next) {
    if (ctx.url.startsWith('/shared/files') && ctx.request.method === 'POST') {
      const path = ctx.url.substring('/shared/files'.length);
      const { username } = ctx.params;
      const key = `${username}${path}`;
      try {
        await s3.getObject({ // Check if object is available
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        }).promise();
        const id = uuid();
        logger.info(`Sharing ${key} as ${id}`);
        await sharedStore.insertOne({ key, id });
        ctx.status = 200;
        ctx.body = { id };
      } catch (err) {
        logger.error(err.message);
        ctx.status = 404;
      }
    } else {
      await next();
    }
  },

  async shareFolder(ctx, next) {
    if (ctx.url.startsWith('/shared/folders') && ctx.request.method === 'POST') {
      const path = ctx.url.substring('/shared/folders'.length);
      const { username } = ctx.params;
      const key = `${username}${path}/`;
      try {
        await s3.getObject({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        }).promise();
        const id = uuid();
        await sharedStore.insertOne({ key, id });
        ctx.status = 200;
        ctx.body = { id };
      } catch (err) {
        logger.error(err.message);
        ctx.status = 404;
      }
    } else {
      await next();
    }
  },
});
