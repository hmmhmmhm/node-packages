module.exports = {
  testMatch: ["**/test/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/test/setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  watchman: false,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^pseudo-shuffle$": "<rootDir>/dist/pseudo-shuffle.cjs",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: {
        outDir: null,
        rootDir: null,
        moduleResolution: "node",
        esModuleInterop: true,
      },
      diagnostics: {
        ignoreCodes: [151002],
      },
    }],
  },
  injectGlobals: true,
};
