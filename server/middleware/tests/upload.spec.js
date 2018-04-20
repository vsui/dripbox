jest.mock('../../util/s3', () => ({
  deleteObject: jest.fn()
    .mockReturnValue({ promise: jest.fn() }),
  putObject: jest.fn()
    .mockReturnValue({ promise: jest.fn() }),
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

  it('should call deleteObject', async () => {
    const ctx = {
      params: {
        key: 'a.txt',
        username: 'me',
      },
      request: {
        body: { blob: 'BIG GIANT ANTS' },
      },
    };
    await upload(ctx, null);
    expect(s3.putObject).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      Key: 'me/a.txt',
      Body: 'BIG GIANT ANTS',
    });
  });

  it('should set status to 204 on success', async () => {
    const ctx = {
      params: {
        key: 'a.txt',
        username: 'me',
      },
      request: {
        body: { blob: 'BIG GIANT ANTS' },
      },
    };
    await upload(ctx, null);
    expect(ctx.status).toBe(204);
  });

  it('should not call deleteObject if there is no blob', async () => {
    const ctx = {
      params: {
        key: 'a.txt',
        username: 'me',
      },
      request: {
        body: null,
      },
    };
    await upload(ctx, null);
    expect(s3.putObject).not.toHaveBeenCalled();
  });

  it('should set status to 422 if there is no blob', async () => {
    const ctx = {
      params: {
        key: 'a.txt',
        username: 'me',
      },
      request: {
        body: null,
      },
    };
    await upload(ctx, null);
    expect(ctx.status).toBe(422);
  });
});