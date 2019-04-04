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

const getStores = () => Promise.resolve({
  credentialStore: new MemoryCredentialStore(),
  sharedStore: new MemorySharedStore(),
});

module.exports = {
  MemoryCredentialStore,
  MemorySharedStore,
  getStores,
};
