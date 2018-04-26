// to stop logging ¯\_(ツ)_/¯

jest.mock('../util/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));
