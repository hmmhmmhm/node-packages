module.exports = {
  testMatch: ["**/test/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/test/setup.ts", "/test/setup-browser.ts"],
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
  projects: [
    {
      displayName: "node",
      testMatch: ["**/test/**/!(*.browser).test.ts"],
      testPathIgnorePatterns: ["/node_modules/", "/dist/", "/test/setup.ts", "/test/setup-browser.ts"],
      setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
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
    },
    {
      displayName: "browser",
      testMatch: ["**/test/**/*.browser.test.ts"],
      testPathIgnorePatterns: ["/node_modules/", "/dist/", "/test/setup.ts", "/test/setup-browser.ts"],
      setupFilesAfterEnv: ["<rootDir>/test/setup-browser.ts"],
      testEnvironment: "node",
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
    },
  ],
};
