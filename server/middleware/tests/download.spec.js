jest.mock('../../util/s3', () => ({
  getObject: jest
    .fn()
    .mockImplementation(({ Key }) => ({
      promise: jest.fn().mockImplementation(() => {
        if (Key === 'me/nonexistent-file.txt') {
          const error = new Error('The specified key does not exist.');
          error.code = 'NoSuchKey';
          throw error;
        }
        return Promise.resolve({ Body: `Contents of ${Key}` });
      }),
    })),
  listObjectsV2: jest
    .fn()
    .mockImplementation(({ Prefix }) => ({
      promise: jest.fn().mockResolvedValue({
        Contents: [
          { Key: 'me/a.txt', LastModified: 'yesterday', Size: 200 },
          { Key: 'me/b.txt', LastModified: 'last year', Size: 3000 },
          { Key: 'me/c.txt', LastModified: 'never', Size: 343 },
          { Key: 'me/foods/', LastModified: 'yesterday', Size: 200 },
          { Key: 'me/foods/apple.txt', LastModified: 'last year', Size: 3000 },
          { Key: 'me/foods/banana.txt', LastModified: 'never', Size: 343 },
          { Key: 'me/foods/recipes/', LastModified: 'never', Size: 343 },
          { Key: 'me/foods/recipes/watermelon.hs', LastModified: 'never', Size: 343 },
          { Key: 'me/foods/recipes/gingermelon.cpp', LastModified: 'never', Size: 343 },
          { Key: 'me/sports/', LastModified: 'yesterday', Size: 200 },
          { Key: 'me/sports/soccer.txt', LastModified: 'last year', Size: 3000 },
          { Key: 'me/sports/baseball.txt', LastModified: 'never', Size: 343 },
        ].filter(({ Key }) => Key.startsWith(Prefix)),
        status: 200,
      }),
    })),
}));

const s3 = require('../../util/s3');

const mockSharedStore = {
  insertOne: jest.fn(),
  findOne: jest.fn().mockImplementation(({ id }) => ({ key: `key-${id}` })),
};

const {
  download,
  list,
  listFolder,
  listSharedFolder,
  downloadSharedFile,
} = require('../download')(mockSharedStore);

describe('download middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return the downloaded file in root on success', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/files/file.txt',
      request: {
        method: 'GET',
      },
    };
    await download(ctx, null);
    expect(ctx.body).toBe('Contents of me/file.txt');
  });
  it('should set status to 200 on success', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/files/file.txt',
      request: {
        method: 'GET',
      },
    };
    await download(ctx, null);
    expect(ctx.status).toBe(200);
  });
  it('should set status to 404 on NoSuchKey error', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/files/nonexistent-file.txt',
      request: {
        method: 'GET',
      },
    };
    await download(ctx, null);
    expect(ctx.status).toBe(404);
  });
  it('should return the downloaded file on success', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/files/foods/recipes/watermelon.hs',
      request: {
        method: 'GET',
      },
    };
    await download(ctx, null);
    expect(ctx.body).toBe('Contents of me/foods/recipes/watermelon.hs');
  });
  it('should set status to 200 on success (not root)', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/files/foods/recipes/watermelon.hs',
      request: {
        method: 'GET',
      },
    };
    await download(ctx, null);
    expect(ctx.status).toBe(200);
  });
  it('should not do anything if the url does not start with /files', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/folders/foods/recipes/watermelon.hs',
      request: {
        method: 'GET',
      },
    };
    await download(ctx, jest.fn());
    expect(s3.getObject).not.toHaveBeenCalled();
  });

  it('should call next if the url does not start with /files', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      url: '/folders/foods/recipes/watermelon.hs',
      request: {
        method: 'GET',
      },
    };
    const mockNext = jest.fn();
    await download(ctx, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('list middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('return a list of files on success', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
    };
    await list(ctx, null);
    expect(ctx.body).toEqual([
      { fileName: 'a.txt', lastModified: 'yesterday', fileSize: 200 },
      { fileName: 'b.txt', lastModified: 'last year', fileSize: 3000 },
      { fileName: 'c.txt', lastModified: 'never', fileSize: 343 },
      { fileName: 'foods/', lastModified: 'yesterday', fileSize: 200 },
      { fileName: 'foods/apple.txt', lastModified: 'last year', fileSize: 3000 },
      { fileName: 'foods/banana.txt', lastModified: 'never', fileSize: 343 },
      { fileName: 'foods/recipes/', lastModified: 'never', fileSize: 343 },
      { fileName: 'foods/recipes/watermelon.hs', lastModified: 'never', fileSize: 343 },
      { fileName: 'foods/recipes/gingermelon.cpp', lastModified: 'never', fileSize: 343 },
      { fileName: 'sports/', lastModified: 'yesterday', fileSize: 200 },
      { fileName: 'sports/soccer.txt', lastModified: 'last year', fileSize: 3000 },
      { fileName: 'sports/baseball.txt', lastModified: 'never', fileSize: 343 },
    ]);
  });
});

describe('listFolder middleware', () => {
  beforeEach(() => jest.clearAllMocks());
  it('sets status to 404 if no folder matches', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'GET',
      },
      url: '/folders/chairs',
    };
    await listFolder(ctx);
    expect(ctx.status).toBe(404);
  });

  it('sets status to 404 if match is not a folder', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'GET',
      },
      url: '/folders/foods/ap',
    };
    await listFolder(ctx);
    expect(ctx.status).toBe(404);
  });

  it('returns a list of relative urls if the folder matches', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'GET',
      },
      url: '/folders/foods',
    };
    await listFolder(ctx);
    expect(ctx.body).toEqual([
      { fileName: 'apple.txt', lastModified: 'last year', fileSize: 3000 },
      { fileName: 'banana.txt', lastModified: 'never', fileSize: 343 },
      { fileName: 'recipes/', lastModified: 'never', fileSize: 343 },
    ]);
  });

  it('sets status to 200 if the folder matches', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'GET',
      },
      url: '/folders/foods',
    };
    await listFolder(ctx);
    expect(ctx.status).toEqual(200);
  });

  it('returns a list of relative url given the root folder', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'GET',
      },
      url: '/folders',
    };
    await listFolder(ctx);
    expect(ctx.body).toEqual([
      { fileName: 'a.txt', lastModified: 'yesterday', fileSize: 200 },
      { fileName: 'b.txt', lastModified: 'last year', fileSize: 3000 },
      { fileName: 'c.txt', lastModified: 'never', fileSize: 343 },
      { fileName: 'foods/', lastModified: 'yesterday', fileSize: 200 },
      { fileName: 'sports/', lastModified: 'yesterday', fileSize: 200 },
    ]);
  });

  it('sets status to 200 given the root folder', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'GET',
      },
      url: '/folders',
    };
    await listFolder(ctx);
    expect(ctx.status).toEqual(200);
  });

  it('does nothing if the url does not begin with \'folders\'', async () => {
    await listFolder({ url: 'sadfasd' });
    expect(s3.listObjectsV2).not.toHaveBeenCalled();
  });

  it('does nothing if the method is not GET', async () => {
    await listFolder({ url: '/folders', request: { method: 'PUT' } });
    expect(s3.listObjectsV2).not.toHaveBeenCalled();
  });
});

describe('downloadSharedFile middleware', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should not do anything if the url has the incorrect prefix or the method is not GET', async () => {
    const mockNext = jest.fn();
    await downloadSharedFile({ request: { method: 'POST' }, url: '/shared/files/file.txt' }, mockNext);
    await downloadSharedFile({ request: { method: 'GET' }, url: '/share/folders/file.txt' }, mockNext);
    expect(mockSharedStore.insertOne).not.toHaveBeenCalled();
  });
  it('should call next if the url has the incorrect prefix or the method is not GET', async () => {
    const mockNext = jest.fn();
    await downloadSharedFile({ request: { method: 'POST' }, url: '/shared/files/file.txt' }, mockNext);
    await downloadSharedFile({ request: { method: 'GET' }, url: '/share/files/file.txt' }, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  it('should set the body to the contents of the file', async () => {
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/files/1234abcd',
    };
    await downloadSharedFile(ctx, null);
    expect(ctx.body).toBe('Contents of key-1234abcd');
  });
  it('should set the body of the contents of the file (shared folder)', async () => {
    mockSharedStore.findOne = jest.fn().mockImplementation(({ id }) => {
      if (id === '1234abcd') {
        return 'folder';
      }
      return null;
    });
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/files/1234abcd/file.txt',
    };
    await downloadSharedFile(ctx, null);
    expect(ctx.body).toBe('Contents of key-sharedfolder/file.txt');
  })
  it('should set the status to 200', async () => {
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/files/1234abcd',
    };
    await downloadSharedFile(ctx, null);
    expect(ctx.status).toBe(200);
  });
  it('should set the status to 404 if the id is not in the store', async () => {
    mockSharedStore.findOne = jest.fn().mockResolvedValue(null);
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/files/1234abcd',
    };
    await downloadSharedFile(ctx, null);
    expect(ctx.status).toBe(404);
  });
});

describe('listSharedFolder middleware', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should not do anything if the url has the incorrect prefix or the method is not GET', async () => {
    const mockNext = jest.fn();
    await listSharedFolder({ request: { method: 'POST' }, url: '/shared/folders/folder' }, mockNext);
    await listSharedFolder({ request: { method: 'GET' }, url: '/share/files/file.txt' }, mockNext);
    expect(mockSharedStore.insertOne).not.toHaveBeenCalled();
  });
  it('should call next if the url has the incorrect prefix or the method is not GET', async () => {
    const mockNext = jest.fn();
    await listSharedFolder({ request: { method: 'POST' }, url: '/shared/folders/folder' }, mockNext);
    await listSharedFolder({ request: { method: 'GET' }, url: '/share/files/file.txt' }, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  it('should set status to 404 if the id is not found', async () => {
    mockSharedStore.findOne = jest.fn().mockResolvedValue(null);
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/folders/1234abcd',
    };
    await listSharedFolder(ctx, null);
    expect(ctx.status).toBe(404);
  });
  it('should list the contents of the shared folder (root)', async () => {
    mockSharedStore.findOne = jest.fn().mockResolvedValue({ key: 'me/foods' });
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/folders/1234abcd',
    };
    await listSharedFolder(ctx, null);
    expect(ctx.body).toEqual([
      { fileName: 'me/foods/apple.txt', lastModified: 'last year', size: 3000 },
      { fileName: 'me/foods/banana.txt', lastModified: 'never', size: 343 },
      { fileName: 'me/foods/recipes/', lastModified: 'never', size: 343 },
    ]);
  });
  it('should set status to 200 (root)', async () => {
    mockSharedStore.findOne = jest.fn().mockResolvedValue({ key: 'me/foods' });
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/folders/1234abcd',
    };
    await listSharedFolder(ctx, null);
    expect(ctx.status).toBe(200);
  });
  it('should list the contents of the shared folder (not root)', async () => {
    mockSharedStore.findOne = jest.fn().mockResolvedValue({ key: 'me/foods' });
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/folders/1234abcd',
    };
    await listSharedFolder(ctx, null);
    expect(ctx.body).toEqual([
      { fileName: 'watermelon.hs', lastModified: 'never', size: 343 },
      { fileName: 'gingermelon.cpp', lastModified: 'never', size: 343 },
    ]);
  });
  it('should set status to 200 ( not root)', async () => {
    mockSharedStore.findOne = jest.fn().mockResolvedValue({ key: 'me/foods' });
    const ctx = {
      request: { method: 'GET' },
      url: '/shared/folders/1234abcd/recipes',
    };
    await listSharedFolder(ctx, null);
    expect(ctx.status).toBe(200);
  });
});
