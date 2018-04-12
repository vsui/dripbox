const AWS = require('aws-sdk');

const s3 = new AWS.S3();

/**
 * Given a context with a request.body of format
 * ```
 * {
 *   "key": str,
 *   "blob": str
 * }
 * ```
 * uploads an object `key` with contents `blob` to S3
 * @param {Context} ctx
 */
const download = async (ctx) => {
  const { key } = ctx.params;
  if (!key) {
    ctx.status = 204;
    return;
  }
  // logger.info(`Retrieving ${key}`);
  const response = await s3.getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  }).promise();
  // Response set to null if error occurs
  // NoSuchKey: The specified key does not exist.
  // logger.info(`Retrieved ${key}`);
  ctx.body = response.Body;
  ctx.status = 200;
};

module.exports = { download };
