const { MongoClient } = require('mongodb');
const logger = require('./logger');

module.exports = MongoClient.connect(process.env.MONGO_URL)
  .catch(() => {
    logger.error(`Could not connect to ${process.env.MONGO_URL}`);
    process.exit(1);
  })
  .then((client) => {
    const db = client.db('auth');
    const credentialStore = db.collection('credentials');
    logger.info('Connected to MongoDB instance');
    return credentialStore;
  });
