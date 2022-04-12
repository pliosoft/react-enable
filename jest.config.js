module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: { '^@src/(.$)$': '<rootDir>/src/$1' },
};
