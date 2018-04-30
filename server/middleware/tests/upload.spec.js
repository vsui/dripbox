jest.mock('../../util/s3', () => ({
  deleteObject: jest.fn()
    .mockReturnValue({ promise: jest.fn() }),
  putObject: jest.fn()
    .mockReturnValue({ promise: jest.fn() }),
}));

jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue('stream'),
}));

process.env.BUCKET_NAME = 'testBucket';

const s3 = require('../../util/s3');
const { remove, upload, addFolder } = require('../upload');

describe('remove middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call deleteObject', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'DELETE',
      },
      url: '/files/somefile.txt',
    };
    await remove(ctx, null);
    expect(s3.deleteObject).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      Key: 'me/somefile.txt',
    });
  });

  it('should set status to 204 on success', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'DELETE',
      },
      url: '/files/somefile.txt',
    };
    await remove(ctx, null);
    expect(ctx.status).toBe(204);
  });

  it('should call deleteObject (not root)', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'DELETE',
      },
      url: '/files/folder/child/somefile.txt',
    };
    await remove(ctx, null);
    expect(s3.deleteObject).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      Key: 'me/folder/child/somefile.txt',
    });
  });

  it('should set status to 204 on success (not root)', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'DELETE',
      },
      url: '/files/folder/child/somefile.txt',
    };
    await remove(ctx, null);
    expect(ctx.status).toBe(204);
  });

  it('should not call deleteObject if method is not DELETE', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'PUT',
      },
      url: '/files/folder/child/somefile.txt',
    };
    await remove(ctx, jest.fn());
    expect(s3.deleteObject).not.toHaveBeenCalled();
  });

  it('should not call deleteObject if url does not start with /files', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'PUT',
      },
      url: '/folders/folder/child/somefile.txt',
    };
    await remove(ctx, jest.fn());
    expect(s3.deleteObject).not.toHaveBeenCalled();
  });
  it('should call next if method is not DELETE', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'PUT',
      },
      url: '/files/folder/child/somefile.txt',
    };
    const next = jest.fn();
    await remove(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next if url does not start with /files', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        method: 'PUT',
      },
      url: '/folders/folder/child/somefile.txt',
    };
    const next = jest.fn();
    await remove(ctx, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('upload middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call putObject', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'PUT',
      },
      url: '/files/a.txt',
    };
    await upload(ctx, null);
    expect(s3.putObject).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      Key: 'me/a.txt',
      Body: 'stream',
    });
  });

  it('should set status to 204 on success', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'PUT',
      },
      url: '/files/a.txt',
    };
    await upload(ctx, null);
    expect(ctx.status).toBe(204);
  });

  it('should not call putObject if there is no blob', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: null,
        },
        method: 'PUT',
      },
      url: '/files/a.txt',
    };
    await upload(ctx, null);
    expect(s3.putObject).not.toHaveBeenCalled();
  });

  it('should call putObject (not root)', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'PUT',
      },
      url: '/files/folder/b.txt',
    };
    await upload(ctx, null);
    expect(s3.putObject).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      Key: 'me/folder/b.txt',
      Body: 'stream',
    });
  });

  it('should set status to 204 on success (not root)', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'PUT',
      },
      url: '/files/folder/b.txt',
    };
    await upload(ctx, null);
    expect(ctx.status).toBe(204);
  });

  it('should not put if url does not start with /files', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'PUT',
      },
      url: '/folders/folder/b.txt',
    };
    await upload(ctx, jest.fn());
    expect(s3.putObject).not.toHaveBeenCalled();
  });

  it('should not put if method is not PUT', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'POST',
      },
      url: '/files/folder/b.txt',
    };
    await upload(ctx, jest.fn());
    expect(s3.putObject).not.toHaveBeenCalled();
  });
  it('should call next if does not start with /files', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'PUT',
      },
      url: '/folders/folder/b.txt',
    };
    const next = jest.fn();
    await upload(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next if method is not PUT', async () => {
    const ctx = {
      params: {
        username: 'me',
      },
      request: {
        files: {
          upload: { path: '/fakepath' },
        },
        method: 'POST',
      },
      url: '/files/folder/b.txt',
    };
    const next = jest.fn();
    await upload(ctx, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('addFolder middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call next if the url does not start with /folders', async () => {
    const ctx = {
      params: { username: 'me' },
      request: { method: 'PUT' },
      url: '/files/blah',
    };
    const mockNext = jest.fn();
    await addFolder(ctx, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should do nothing if the url does not start with /folders', async () => {
    const ctx = {
      params: { username: 'me' },
      request: { method: 'PUT' },
      url: '/files/blah',
    };
    const mockNext = jest.fn();
    await addFolder(ctx, mockNext);
    expect(s3.putObject).not.toHaveBeenCalled();
  });

  it('should call next if the method is not PUT', async () => {
    const ctx = {
      params: { username: 'me' },
      request: { method: 'POST' },
      url: '/folders/blah',
    };
    const mockNext = jest.fn();
    await addFolder(ctx, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should do nothing if the method is not PUT', async () => {
    const ctx = {
      params: { username: 'me' },
      request: { method: 'POST' },
      url: '/folders/blah',
    };
    const mockNext = jest.fn();
    await addFolder(ctx, mockNext);
    expect(s3.putObject).not.toHaveBeenCalled();
  });

  it('should call S3 to create a folder (root)', async () => {
    const ctx = {
      params: { username: 'me' },
      request: { method: 'PUT' },
      url: '/folders/blah',
    };
    await addFolder(ctx);
    expect(s3.putObject).toHaveBeenCalledWith({
      Key: 'me/blah/',
      Body: '',
      Bucket: 'testBucket',
    });
  });

  it('should call S3 to create a folder (not root)', async () => {
    const ctx = {
      params: { username: 'me' },
      request: { method: 'PUT' },
      url: '/folders/blah/child/horovod',
    };
    await addFolder(ctx);
    expect(s3.putObject).toHaveBeenCalledWith({
      Key: 'me/blah/child/horovod/',
      Body: '',
      Bucket: 'testBucket',
    });
  });
});
