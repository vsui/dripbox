const api = require('./api');

global.Headers = jest.fn();

describe('login', async () => {
  it('rejects on status code not 200', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    await expect(api.login('vsui', 'password')).rejects.toThrowError('Could not login');
  });

  it('returns a token on status code 200', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({ token: 'token' }),
    });
    await expect(api.login('vsui', 'pass')).resolves.toBe('token');
  });
});

describe('register', async () => {
  it('rejects on status code not 200', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    await expect(api.register('vsui', 'password')).rejects.toThrowError('Could not register');
  });

  it('returns a token on status code 200', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({ token: 'token' }),
    });
    await expect(api.register('vsui', 'pass')).resolves.toBe('token');
  });
});

describe('download', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: () => 'token',
    };
  });
  it('rejects if no token is available', async () => {
    global.localStorage = {
      getItem: () => null,
    };
    await expect(api.download('bats')).rejects.toThrow('Token unavailable');
  });
  it('rejects on status code 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    await expect(api.download('bats')).rejects.toThrow('Not authorized');
  });
  it('rejects on status codes other than 200', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 500 });
    await expect(api.download('bats')).rejects.toThrow('Unknown error');
  });
  it('returns a blob on status code 200', async () => {
    const mockBlob = jest.fn().mockReturnValue(555);
    global.fetch = jest.fn().mockResolvedValue({ status: 200, blob: mockBlob });
    await expect(api.download('bats')).resolves.toBe(555);
  });
});

describe('remove', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: () => 'token',
    };
  });
  it('rejects if no token is available', async () => {
    global.localStorage = {
      getItem: () => null,
    };
    await expect(api.remove('bats')).rejects.toThrow('Token unavailable');
  });
  it('rejects on status code 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    await expect(api.remove('bats')).rejects.toThrow('Not authorized');
  });
  it('rejects on status codes other than 204', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 500 });
    await expect(api.remove('bats')).rejects;
  });
  it('resolves on status code 204', async () => {
    const mockBlob = jest.fn().mockReturnValue(555);
    global.fetch = jest.fn().mockResolvedValue({ status: 200, blob: mockBlob });
    await expect(api.remove('bats')).resolves;
  });
});


describe('upload', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: () => 'token',
    };
  });
  it('rejects if no token is available', async () => {
    global.localStorage = {
      getItem: () => null,
    };
    await expect(api.upload('bats')).rejects.toThrow('Token unavailable');
  });
  it('rejects on status code 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    await expect(api.upload('bats')).rejects.toThrow('Not authorized');
  });
  it('rejects on status codes other than 204', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 500 });
    await expect(api.upload('bats')).rejects;
  });
  it('resolves on status code 204', async () => {
    const mockBlob = jest.fn().mockReturnValue(555);
    global.fetch = jest.fn().mockResolvedValue({ status: 200, blob: mockBlob });
    await expect(api.upload('bats')).resolves;
  });
});
