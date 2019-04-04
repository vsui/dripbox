jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashXXX'),
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MemoryCredentialStore } = require('../../util/store');

const auth = require('../auth');

const ctxWithCredentials = () => ({
  request: {
    body: {
      username: 'roy',
      password: 'gbiv',
    },
  },
  headers: {
    authorization: 'Bearer blah',
  },
  params: {

  },
});

describe('login middleware', () => {
  it('should set status to 401 if user with username is not found', async () => {
    const mockStore = new MemoryCredentialStore();
    const { login } = auth(mockStore);
    const ctx = ctxWithCredentials();
    await login(ctx, null);
    expect(ctx.status).toBe(401);
  });

  it('should set status to 401 if jwt is not properly authenticated', async () => {
    const mockStore = new MemoryCredentialStore();
    const { login } = auth(mockStore);
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    const ctx = ctxWithCredentials();
    await login(ctx, null);
    expect(ctx.status).toBe(401);
  });

  it('should set status to 200 if jwt is properly authenticated', async () => {
    const mockStore = new MemoryCredentialStore();
    const { login } = auth(mockStore);
    jwt.sign = jest.fn();
    mockStore.findOne = jest.fn().mockResolvedValue({ username: 'roy' });
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const mockNext = jest.fn();
    const ctx = ctxWithCredentials();
    await login(ctx, mockNext);
    expect(ctx.status).toBe(200);
  });
  it('should set body to token if jwt is properly authenticated', async () => {
    const mockStore = new MemoryCredentialStore();
    const { username } = ctxWithCredentials().request.body;
    mockStore.insertOne({ username, hash: '!@#' });
    const { login } = auth(mockStore);
    jwt.sign = jest.fn().mockReturnValue('mockToken');
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const mockNext = jest.fn();
    const ctx = ctxWithCredentials();
    await login(ctx, mockNext);
    expect(ctx.body).toEqual({ token: 'mockToken' });
  });
});

describe('register middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should successfully register if the user does not exist ', async () => {
    const ctx = ctxWithCredentials();
    const mockStore = new MemoryCredentialStore();
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(mockStore.findOne({ username: 'roy' })).resolves.toEqual({ username: 'roy', hash: 'hashXXX' });
  });

  it('should return token if the user does not exist', async () => {
    const ctx = ctxWithCredentials();
    const mockStore = new MemoryCredentialStore();
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(ctx.body).toEqual({ token: 'mockToken' });
  });

  it('should set status to 200 if registration is successful', async () => {
    const ctx = ctxWithCredentials();
    const mockStore = new MemoryCredentialStore();
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(ctx.status).toBe(200);
  });

  it('should set status to 401 if user exists', async () => {
    const ctx = ctxWithCredentials();
    const mockStore = new MemoryCredentialStore();
    await mockStore.insertOne({ username: ctx.request.body.username, hash: 'hashXXX' });
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(ctx.status).toBe(401);
  });

  it('should not register user if user already exists', async () => {
    const mockStore = new MemoryCredentialStore();
    const ctx = ctxWithCredentials();
    const { username } = ctxWithCredentials().request.body;
    await mockStore.insertOne({ username, hash: '!@#$' });
    mockStore.insertOne = jest.fn();
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(mockStore.insertOne).not.toHaveBeenCalled();
  });

  it('should not sign a token if user already exists', async () => {
    const ctx = ctxWithCredentials();
    const { username } = ctx.request.body;
    const mockStore = new MemoryCredentialStore();
    await mockStore.insertOne({ username, hash: 'hashXXX' });
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should have an empty body if user already exists', async () => {
    const ctx = ctxWithCredentials();
    const { username } = ctx.request.body;
    const mockStore = new MemoryCredentialStore();
    await mockStore.insertOne({ username, hash: 'hashXXX' });
    const { register } = auth(mockStore);
    await register(ctx, jest.fn());
    expect(ctx.body).toBeUndefined();
  });
});

describe('verify middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should set status to 401 if there is no authorization header', async () => {
    const ctx = { request: {}, headers: {} };
    const { verify } = auth(null);
    await verify(ctx, jest.fn());
    expect(ctx.status).toBe(401);
  });

  it('should set status to 401 if user is not found', async () => {
    const ctx = ctxWithCredentials();
    const { verify } = auth(null);
    await verify(ctx, jest.fn());
    expect(ctx.status).toBe(401);
  });

  it('should not call next if user is not found', async () => {
    const ctx = ctxWithCredentials();
    const { verify } = auth(null);
    const mockNext = jest.fn();
    await verify(ctx, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if user found and hashes match', async () => {
    const ctx = ctxWithCredentials();
    jwt.verify = jest.fn().mockResolvedValue(true);
    jwt.decode = jest.fn().mockReturnValue({ username: 'david' });
    const { verify } = auth(null);
    const mockNext = jest.fn();
    await verify(ctx, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should set ctx.params.username if user found and hashes match', async () => {
    const ctx = ctxWithCredentials();
    jwt.verify = jest.fn().mockResolvedValue(true);
    jwt.decode = jest.fn().mockReturnValue({ username: 'david' });
    const { verify } = auth(null);
    const mockNext = jest.fn();
    await verify(ctx, mockNext);
    expect(ctx.params.username).toBe('david');
  });

  it('should not call next if hashes do not match', async () => {
    const ctx = ctxWithCredentials();
    jwt.verify = jest.fn().mockResolvedValue(false);
    const { verify } = auth(null);
    const mockNext = jest.fn();
    await verify(ctx, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
