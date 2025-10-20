module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@src/(.$)$': '<rootDir>/src/$1',
    '\\.(css)$': 'identity-obj-proxy',
  },
};
