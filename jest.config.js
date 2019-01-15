module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  reporters: [
    'default',
    'jest-junit'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/DOMInteractions.ts'
  ]
};