module.exports = {
  testMatch: ["**/test/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
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
  injectGlobals: true,
};
