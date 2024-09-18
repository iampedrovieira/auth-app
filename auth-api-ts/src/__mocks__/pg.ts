import { jest } from '@jest/globals';
//Note: If i put __mocks__/module jest will use it as a global mock for all tests
const mClient = {
  query: jest.fn(),
  release: jest.fn(),
};
const mPool = {
  connect: jest.fn(() => mClient),
  end: jest.fn(),
};
module.exports = {
  Pool: jest.fn(() => mPool),
};