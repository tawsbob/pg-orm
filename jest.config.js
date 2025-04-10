/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/src/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/**/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: '<rootDir>/coverage',
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/schema',
    '<rootDir>/packages/engine',
    '<rootDir>/packages/client',
    '<rootDir>/packages/generator',
    '<rootDir>/packages/cli',
    '<rootDir>/packages/extensions'
  ]
}; 