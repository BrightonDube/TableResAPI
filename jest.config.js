// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/__setup__/jest.setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/config/'
  ]
};