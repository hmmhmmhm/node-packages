/**
 * edge-crypto
 * 
 * Unified SubtleCrypto utilities for Node.js, browsers, and Cloudflare Workers
 * without external dependencies.
 * 
 * @packageDocumentation
 */

// Export types
export type {
  EncryptionAlgorithm,
  SigningAlgorithm,
  HashAlgorithm,
  EncryptOptions,
  DecryptOptions,
  SignOptions,
  VerifyOptions,
  EncryptedData,
  CryptoKeyPair,
  RSAKeyOptions,
  RSAEncryptOptions,
  RSADecryptOptions,
  RSASignOptions,
  RSAVerifyOptions,
} from './types';

// Export encryption functions
export {
  encrypt,
  decrypt,
  encryptToString,
  decryptFromString,
} from './encrypt';

// Export signing functions
export {
  sign,
  verify,
  hash,
  generateKey,
} from './sign';

// Export RSA functions
export {
  generateRSAKeyPair,
  generateRSASigningKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  encryptRSA,
  decryptRSA,
  signRSA,
  verifyRSA,
} from './rsa';

// Export utility functions
export {
  isSupported,
  getCrypto,
  stringToUint8Array,
  uint8ArrayToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  generateSalt,
  generateIV,
  deriveKey,
} from './utils';
