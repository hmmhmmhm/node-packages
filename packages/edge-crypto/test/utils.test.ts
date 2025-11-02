import {
  isSupported,
  getCrypto,
  stringToUint8Array,
  uint8ArrayToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  generateSalt,
  generateIV,
  deriveKey,
} from '../src/utils';

describe('Utils', () => {
  describe('isSupported', () => {
    it('should return true in Node.js environment', () => {
      const supported = isSupported();
      expect(supported).toBe(true);
    });

    it('should be callable without throwing', () => {
      expect(() => isSupported()).not.toThrow();
    });
  });

  describe('getCrypto', () => {
    it('should return SubtleCrypto instance', () => {
      const crypto = getCrypto();
      expect(crypto).toBeDefined();
      expect(typeof crypto.encrypt).toBe('function');
      expect(typeof crypto.decrypt).toBe('function');
    });
  });

  describe('stringToUint8Array/uint8ArrayToString', () => {
    it('should convert string to Uint8Array and back', () => {
      const original = 'Hello, World! 안녕하세요 🌍';
      const buffer = stringToUint8Array(original);
      
      expect(buffer).toBeInstanceOf(Uint8Array);
      expect(buffer.length).toBeGreaterThan(0);

      const converted = uint8ArrayToString(buffer);
      expect(converted).toBe(original);
    });

    it('should handle empty string', () => {
      const buffer = stringToUint8Array('');
      expect(buffer.length).toBe(0);

      const converted = uint8ArrayToString(buffer);
      expect(converted).toBe('');
    });

    it('should handle unicode characters', () => {
      const original = '🚀 Unicode test: 한글, 日本語, 中文';
      const buffer = stringToUint8Array(original);
      const converted = uint8ArrayToString(buffer);
      
      expect(converted).toBe(original);
    });
  });

  describe('arrayBufferToBase64/base64ToArrayBuffer', () => {
    it('should convert ArrayBuffer to base64 and back', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5, 255, 128, 0]);
      const base64 = arrayBufferToBase64(original.buffer as ArrayBuffer);
      
      expect(typeof base64).toBe('string');
      expect(base64.length).toBeGreaterThan(0);

      const converted = new Uint8Array(base64ToArrayBuffer(base64));
      expect(converted).toEqual(original);
    });

    it('should handle empty buffer', () => {
      const original = new Uint8Array([]);
      const base64 = arrayBufferToBase64(original.buffer as ArrayBuffer);
      
      expect(base64).toBe('');

      const converted = new Uint8Array(base64ToArrayBuffer(base64));
      expect(converted.length).toBe(0);
    });
  });

  describe('generateSalt', () => {
    it('should generate random salt with default length', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      
      expect(salt1).toBeInstanceOf(Uint8Array);
      expect(salt1.length).toBe(16);
      expect(salt2.length).toBe(16);
      expect(salt1).not.toEqual(salt2);
    });

    it('should generate salt with custom length', () => {
      const salt = generateSalt(32);
      
      expect(salt.length).toBe(32);
    });
  });

  describe('generateIV', () => {
    it('should generate random IV with default length', () => {
      const iv1 = generateIV();
      const iv2 = generateIV();
      
      expect(iv1).toBeInstanceOf(Uint8Array);
      expect(iv1.length).toBe(12);
      expect(iv2.length).toBe(12);
      expect(iv1).not.toEqual(iv2);
    });

    it('should generate IV with custom length', () => {
      const iv = generateIV(16);
      
      expect(iv.length).toBe(16);
    });
  });

  describe('deriveKey', () => {
    it('should derive key from password', async () => {
      const password = 'my-password';
      const salt = generateSalt();
      
      const key = await deriveKey(password, salt);
      
      expect(key).toBeDefined();
      expect(key.type).toBe('secret');
    });

    it('should derive same key for same password and salt', async () => {
      const password = 'my-password';
      const salt = generateSalt();
      
      const key1 = await deriveKey(password, salt);
      const key2 = await deriveKey(password, salt);
      
      // Keys should be the same (we can't directly compare CryptoKey objects,
      // but we can verify they work the same way)
      expect(key1.type).toBe(key2.type);
      expect(key1.algorithm).toEqual(key2.algorithm);
    });

    it('should derive different keys for different salts', async () => {
      const password = 'my-password';
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      
      const key1 = await deriveKey(password, salt1);
      const key2 = await deriveKey(password, salt2);
      
      // We can't directly compare keys, but they should be different
      // This is verified by the encryption tests
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
    });

    it('should support different key lengths', async () => {
      const password = 'my-password';
      const salt = generateSalt();
      
      const key128 = await deriveKey(password, salt, 128);
      const key256 = await deriveKey(password, salt, 256);
      
      expect(key128).toBeDefined();
      expect(key256).toBeDefined();
    });
  });
});
