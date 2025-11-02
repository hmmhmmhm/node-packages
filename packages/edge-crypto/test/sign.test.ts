import { sign, verify, hash, generateKey } from '../src/sign';

describe('Signing', () => {
  const testData = 'Hello, World! This is a test message.';
  const secret = 'my-secret-key-123';

  describe('sign/verify', () => {
    it('should sign and verify data successfully', async () => {
      const signature = await sign(testData, secret);
      
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);

      const isValid = await verify(testData, signature, secret);
      expect(isValid).toBe(true);
    });

    it('should sign Uint8Array data', async () => {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(testData);
      
      const signature = await sign(dataBuffer, secret);
      const isValid = await verify(dataBuffer, signature, secret);
      
      expect(isValid).toBe(true);
    });

    it('should fail verification with wrong secret', async () => {
      const signature = await sign(testData, secret);
      const isValid = await verify(testData, signature, 'wrong-secret');
      
      expect(isValid).toBe(false);
    });

    it('should fail verification with modified data', async () => {
      const signature = await sign(testData, secret);
      const isValid = await verify(testData + ' modified', signature, secret);
      
      expect(isValid).toBe(false);
    });

    it('should support different hash algorithms', async () => {
      const signature256 = await sign(testData, secret, { hash: 'SHA-256' });
      const isValid256 = await verify(testData, signature256, secret, { hash: 'SHA-256' });
      expect(isValid256).toBe(true);

      const signature384 = await sign(testData, secret, { hash: 'SHA-384' });
      const isValid384 = await verify(testData, signature384, secret, { hash: 'SHA-384' });
      expect(isValid384).toBe(true);

      const signature512 = await sign(testData, secret, { hash: 'SHA-512' });
      const isValid512 = await verify(testData, signature512, secret, { hash: 'SHA-512' });
      expect(isValid512).toBe(true);
    });
  });

  describe('hash', () => {
    it('should generate SHA-256 hash', async () => {
      const hash256 = await hash(testData);
      
      expect(typeof hash256).toBe('string');
      expect(hash256.length).toBeGreaterThan(0);

      // Same data should produce same hash
      const hash256Again = await hash(testData);
      expect(hash256).toBe(hash256Again);
    });

    it('should generate different hashes for different data', async () => {
      const hash1 = await hash('data1');
      const hash2 = await hash('data2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should support different hash algorithms', async () => {
      const hash256 = await hash(testData, 'SHA-256');
      const hash384 = await hash(testData, 'SHA-384');
      const hash512 = await hash(testData, 'SHA-512');
      
      expect(hash256).not.toBe(hash384);
      expect(hash384).not.toBe(hash512);
      expect(hash256).not.toBe(hash512);
    });

    it('should hash Uint8Array data', async () => {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(testData);
      
      const hashFromBuffer = await hash(dataBuffer);
      const hashFromString = await hash(testData);
      
      expect(hashFromBuffer).toBe(hashFromString);
    });
  });

  describe('generateKey', () => {
    it('should generate random key', () => {
      const key1 = generateKey();
      const key2 = generateKey();
      
      expect(typeof key1).toBe('string');
      expect(typeof key2).toBe('string');
      expect(key1).not.toBe(key2);
    });

    it('should generate key with custom length', () => {
      const key16 = generateKey(16);
      const key32 = generateKey(32);
      const key64 = generateKey(64);
      
      expect(key16.length).toBeLessThan(key32.length);
      expect(key32.length).toBeLessThan(key64.length);
    });

    it('should work with sign/verify', async () => {
      const key = generateKey();
      const signature = await sign(testData, key);
      const isValid = await verify(testData, signature, key);
      
      expect(isValid).toBe(true);
    });
  });
});
