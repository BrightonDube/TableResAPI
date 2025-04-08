module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/config/'],  
  preset: '@shelf/jest-mongodb'
  
};
