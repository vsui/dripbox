// Interfaces compatible with external dependencies (Mongo and S3) but using
// memory/disk.
const fs = require('fs');
const path = require('path');

class MemoryCredentialStore {
  constructor() {
    this.map = new Map();
  }

  findOne({ username }) {
    const hash = this.map.get(username);
    if (hash === undefined) {
      return Promise.resolve(null);
    }
    return Promise.resolve({ username, hash });
  }

  insertOne({ username, hash }) {
    this.map.set(username, hash);
    return Promise.resolve();
  }
}

class MemorySharedStore {
  constructor() {
    this.map = new Map();
  }

  findOne({ id }) {
    const key = this.map.get(id);
    if (key === undefined) {
      return Promise.resolve(null);
    }
    return Promise.resolve({ id, key });
  }

  insertOne({ key, id }) {
    this.map.set(key, id);
    return Promise.resolve();
  }
}

class DiskS3Store {
  constructor() {
    this.root = '/tmp/squidbox';
  }

  getObject({ Bucket, Key }) {
    const objectPath = path.join(this.root, Key);
    return fs.readFile(objectPath);
  }

  listObjectsV2({ Bucket, Prefix }) {
    const fullPath = path.join(this.root, Prefix);
    return fs.readdir(fullPath);
  }

  deleteObject({ Bucket, Key }) {
    throw new Error('deleteObject not implemented');
  }

  putObject({ Body, Bucket, Key }) {
    throw new Error('putObject not implemented');
  }
}

const getStores = () => Promise.resolve({
  credentialStore: new MemoryCredentialStore(),
  sharedStore: new MemorySharedStore(),
});

module.exports = {
  MemoryCredentialStore,
  MemorySharedStore,
  DiskS3Store,
  s3: new DiskS3Store(),
  getStores,
};
