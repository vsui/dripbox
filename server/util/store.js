// Interfaces compatible with external dependencies (Mongo and S3) but using
// memory/disk.
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

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
    const readFile = promisify(fs.readFile);
    const fullPath = path.join(this.root, Key);
    return {
      promise() {
        return readFile(fullPath)
          .then(contents => ({ Body: contents }))
          .catch(() => ({ code: 'NoSuchKey' }));
      },
    };
  }

  listObjectsV2({ Bucket, Prefix }) {
    const readdir = promisify(fs.readdir);
    const stat = promisify(fs.stat);
    const fullPath = path.join(this.root, Prefix);
    return {
      promise() {
        // TODO need to properly set Size and LastModified
        return readdir(fullPath)
          .then((filenames) => {
            const filePaths = filenames.map(filename => path.join(fullPath, filename));
            const statPromises = filePaths.map(filePath => stat(filePath));
            return Promise.all(statPromises).then((stats) => {
              const files = {
                Contents: [],
              };
              for (let i = 0; i < filePaths.length; i += 1) {
                files.Contents.push({
                  // Files with paths that end with '/' are interpreted to be folders
                  Key: path.join(Prefix, filenames[i]) + (stats[i].isDirectory() ? '/' : ''),
                  Size: stats[i].size,
                  LastModified: stats[i].mtime,
                });
              }
              return files;
            });
          });
      },
    };
  }

  deleteObject({ Bucket, Key }) {
    const unlink = promisify(fs.unlink);
    const fullPath = path.join(this.root, Key);
    return {
      promise() {
        return unlink(fullPath);
      },
    };
  }

  putObject({ Body, Bucket, Key }) {
    // S3 had no concept of a directory so we just made objects ending with '/'
    // to denote a directory. So when we see a Key ending in '/' we need to
    // make a directory instead.
    const fullPath = path.join(this.root, Key);
    if (Key.endsWith('/')) {
      const mkdir = promisify(fs.mkdir);
      return {
        promise() {
          return mkdir(fullPath);
        },
      };
    }
    const writerStream = fs.createWriteStream(fullPath, { flag: 'w+' });
    Body.pipe(writerStream, { end: true });

    return {
      promise() {
        return new Promise((resolve, reject) => {
          writerStream.on('finish', () => resolve());
          writerStream.on('error', err => reject(err));
        });
      },
    };
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
