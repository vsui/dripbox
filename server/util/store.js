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

module.exports = {
  MemoryCredentialStore,
};
