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
const { remove, upload } = require('../upload');

describe('remove middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call deleteObject', async () => {
    const ctx = { params: { key: 'a.txt', username: 'me' } };
    await remove(ctx, null);
    expect(s3.deleteObject).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      Key: 'me/a.txt',
    });
  });

  it('should set status to 204 on success', async () => {
    const ctx = { params: { key: 'a.txt', username: 'me' } };
    await remove(ctx, null);
    expect(ctx.status).toBe(204);
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
