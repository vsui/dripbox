const logger = require('../util/logger');
const s3 = require('../util/s3');

const remove = async (ctx) => {
  const { key } = ctx.request.body;
  if (!key) {
    logger.info(`Malformed body: ${JSON.stringify(ctx.request.body)}`);
    ctx.status = 422;
    ctx.body = 'Malformed body';
    return;
  }
  logger.info('Deleting from S3');
  await s3.deleteObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  }).promise();

  ctx.status = 204;
};

const upload = async (ctx) => {
  const { key, blob } = ctx.request.body;
  if (!key || !blob) {
    logger.info(`Malformed body: ${JSON.stringify(ctx.request.body)}`);
    ctx.status = 422;
    ctx.body = 'Malformed body';
    return;
  }

  logger.info(`Uploading ${key} (${blob.length}) to S3`);
  const response = await s3.putObject({
    Body: blob,
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  }).promise();
  logger.info(`Upload response status code: ${response}`);

  ctx.status = 204;
};

module.exports = { remove, upload };
