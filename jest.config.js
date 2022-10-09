module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
    collectCoverageFrom: ["./src/interfaces/**", "./src/services/**"],
    coverageThreshold: {
      global: {
        functions: 80,
        lines: 90,
        statements: 90,
      }
    }
};
