const logger = require('../util/logger');
const s3 = require('../util/s3');
const fs = require('fs');

const remove = async (ctx, next) => {
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
};

const upload = async (ctx, next) => {
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
};

const addFolder = async (ctx, next) => {
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
};

module.exports = { remove, upload, addFolder };
