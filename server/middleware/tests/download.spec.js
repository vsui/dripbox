jest.mock('../../util/s3', () => ({
  getObject: jest
    .fn()
    .mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Body: '1234' }),
    }),
  listObjectsV2: jest
    .fn()
    .mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Contents: [{ Key: 'me/a.txt' }, { Key: 'me/b.txt' }, { Key: 'me/c.txt' }],
      }),
    }),
}));

const { download, list } = require('../download');

describe('download middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return the downloaded file on success', async () => {
    const ctx = {
      params: {
        key: 'file.txt',
        username: 'me',
      },
    };
    await download(ctx, null);
    expect(ctx.body).toBe('1234');
  });
});

describe('list middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('return a list of files on success', async () => {
    const ctx = {
      params: {
        key: 'file.txt',
        username: 'me',
      },
    };
    await list(ctx, null);
    expect(ctx.body).toEqual([
      { Key: 'a.txt' }, { Key: 'b.txt' }, { Key: 'c.txt' },
    ]);
  });
});
