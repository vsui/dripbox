const logger = require('../util/logger');
const s3 = require('../util/s3');
const fs = require('fs');

const remove = async (ctx) => {
  const { key, username } = ctx.params;
  if (!key) {
    logger.info(`Malformed body: ${JSON.stringify(ctx.request.body)}`);
    ctx.status = 422;
    ctx.body = 'Malformed body';
    return;
  }
  logger.info(`Deleting ${key} from S3 for ${username}`);
  await s3.deleteObject({
    Bucket: process.env.BUCKET_NAME,
    Key: `${username}/${key}`,
  }).promise();
  ctx.status = 204;
};

const upload = async (ctx) => {
  const file = ctx.request.files.upload;
  if (!file) {
    ctx.status = 422;
    return;
  }
  const stream = fs.createReadStream(file.path);
  const { key, username } = ctx.params;

  logger.info(`Uploading ${key} (${file.size}) to S3 for ${username}`);
  await s3.putObject({
    Body: stream,
    Bucket: process.env.BUCKET_NAME,
    Key: `${username}/${key}`,
  }).promise();

  ctx.status = 204;
};

const addFolder = async (ctx) => {
  const { key, username } = ctx.params; // TODO Verify folderName is ok
  logger.info(`Adding folder at ${key} for ${username}`);
  await s3.putObject({
    Body: '',
    Bucket: process.env.BUCKET_NAME,
    Key: `${username}/${key}/`,
  }).promise();

  ctx.status = 204;
};

module.exports = { remove, upload, addFolder };
