const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mockStore = jest.mock();

const { login, register, verify } = require('../auth')(mockStore);

const ctxWithCredentials = () => ({
  request: {
    body: {
      username: 'roy',
      password: 'gbiv',
    },
  },
});

describe('login middleware', () => {
  it('should set status to 401 if user with username is not found', async () => {
    mockStore.findOne = jest.fn().mockResolvedValue(null);
    const ctx = ctxWithCredentials();
    await login(ctx, null);
    expect(ctx.status).toBe(401);
  });

  it('should set status to 401 if jwt is not properly authenticated', async () => {
    mockStore.findOne = jest.fn().mockResolvedValue({});
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    const ctx = ctxWithCredentials();
    await login(ctx, null);
    expect(ctx.status).toBe(401);
  });

  it('should call next if jwt is properly authenticated', async () => {
    jwt.sign = jest.fn();
    mockStore.findOne = jest.fn().mockResolvedValue({});
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const mockNext = jest.fn();
    const ctx = ctxWithCredentials();
    await login(ctx, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
  it('should set status to 200 if jwt is properly authenticated', async () => {
    jwt.sign = jest.fn();
    mockStore.findOne = jest.fn().mockResolvedValue({});
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const mockNext = jest.fn();
    const ctx = ctxWithCredentials();
    await login(ctx, mockNext);
    expect(ctx.status).toBe(200);
  });
  it('should set body to token if jwt is properly authenticated', async () => {
    jwt.sign = jest.fn().mockReturnValue('mockToken');
    mockStore.findOne = jest.fn().mockResolvedValue({});
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const mockNext = jest.fn();
    const ctx = ctxWithCredentials();
    await login(ctx, mockNext);
    expect(ctx.body).toEqual({ token: 'mockToken' });
  });
});

describe.skip('register middleware', () => {
});

describe.skip('verify middleware', () => {
  beforeEach(() => {
    mockStore.clearMock();
  });

  it('should set status to 401 if user is not found', () => {
    const ctx = {};
    verify(ctx, null);
    expect(ctx.status).toBe(401);
  });
});

test('asdf', () => expect(1).toBe(1))

