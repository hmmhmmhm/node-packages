/**
 * Setup file for browser-specific tests
 * Polyfills Web Crypto API for Node.js test environment
 */

import { webcrypto } from "crypto";

// Polyfill Web Crypto API for Node.js environment
if (typeof global !== "undefined" && !global.crypto) {
  (global as any).crypto = webcrypto;
}
