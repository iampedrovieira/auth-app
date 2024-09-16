/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  reporters: [
    'default',
    ['jest-spec-reporter', {
      symbols: { passed: '✓', failed: '✗' },
    }],
    ['jest-summary-reporter', {
      failuresOnly: false,
      outputPath: 'test-summary.txt',
    }],
  ],
};