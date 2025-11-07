module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.tests.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
