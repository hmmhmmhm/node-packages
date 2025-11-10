export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/test/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2020',
      },
    },
  },
  maxWorkers: 1, // Run tests serially to avoid BigInt serialization issues
};
