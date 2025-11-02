import { encrypt, decrypt, encryptToString, decryptFromString } from '../src/encrypt';

describe('Encryption', () => {
  const testData = 'Hello, World! This is a test message.';
  const password = 'my-secure-password-123';

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt data successfully', async () => {
      const encrypted = await encrypt(testData, password);

      expect(encrypted).toHaveProperty('data');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('salt');
      expect(encrypted).toHaveProperty('algorithm');
      expect(encrypted.algorithm).toBe('AES-GCM');

      const decrypted = await decrypt(encrypted, password);
      expect(decrypted).toBe(testData);
    });

    it('should encrypt Uint8Array data', async () => {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(testData);

      const encrypted = await encrypt(dataBuffer, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong password', async () => {
      const encrypted = await encrypt(testData, password);

      await expect(
        decrypt(encrypted, 'wrong-password')
      ).rejects.toThrow();
    });

    it('should support different key lengths', async () => {
      const encrypted128 = await encrypt(testData, password, { keyLength: 128 });
      const decrypted128 = await decrypt(encrypted128, password, { keyLength: 128 });
      expect(decrypted128).toBe(testData);

      const encrypted256 = await encrypt(testData, password, { keyLength: 256 });
      const decrypted256 = await decrypt(encrypted256, password, { keyLength: 256 });
      expect(decrypted256).toBe(testData);
    });

    it('should use custom IV when provided', async () => {
      const customIV = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await encrypt(testData, password, { iv: customIV });
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toBe(testData);
    });
  });

  describe('encryptToString/decryptFromString', () => {
    it('should encrypt to string and decrypt successfully', async () => {
      const encrypted = await encryptToString(testData, password);

      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = await decryptFromString(encrypted, password);
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt string with wrong password', async () => {
      const encrypted = await encryptToString(testData, password);

      await expect(
        decryptFromString(encrypted, 'wrong-password')
      ).rejects.toThrow();
    });
  });

  describe('AES-CBC algorithm', () => {
    it('should encrypt and decrypt with AES-CBC', async () => {
      const encrypted = await encrypt(testData, password, { algorithm: 'AES-CBC' });

      expect(encrypted.algorithm).toBe('AES-CBC');

      const decrypted = await decrypt(encrypted, password);
      expect(decrypted).toBe(testData);
    });
  });
});
