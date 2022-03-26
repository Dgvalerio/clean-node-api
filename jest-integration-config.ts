// eslint-disable-next-line no-restricted-imports
import config from './jest.config';

export default {
  ...config,
  testMatch: ['**/*.test.ts'],
};
