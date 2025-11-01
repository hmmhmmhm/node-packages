module.exports = {
  testMatch: ["**/test/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: {
        outDir: null,
        rootDir: null,
      },
      diagnostics: {
        ignoreCodes: [151002],
      },
    }],
  },
};
