import {
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
} from '../src/rsa';

describe('RSA', () => {
  const testData = 'Hello, World! This is a test message.';

  describe('Key Generation', () => {
    it('should generate RSA key pair for encryption', async () => {
      const keyPair = await generateRSAKeyPair();

      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(keyPair.publicKey.type).toBe('public');
      expect(keyPair.privateKey.type).toBe('private');
    });

    it('should generate RSA key pair with custom modulus length', async () => {
      const keyPair = await generateRSAKeyPair({ modulusLength: 4096 });

      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
    });

    it('should generate RSA key pair for signing', async () => {
      const keyPair = await generateRSASigningKeyPair();

      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(keyPair.publicKey.type).toBe('public');
      expect(keyPair.privateKey.type).toBe('private');
    });
  });

  describe('Key Import/Export', () => {
    it('should export and import public key', async () => {
      const keyPair = await generateRSAKeyPair();
      const exported = await exportPublicKey(keyPair.publicKey);

      expect(typeof exported).toBe('string');
      expect(exported.length).toBeGreaterThan(0);

      const imported = await importPublicKey(exported, 'RSA-OAEP', 'SHA-256', ['encrypt']);
      expect(imported.type).toBe('public');
    });

    it('should export and import private key', async () => {
      const keyPair = await generateRSAKeyPair();
      const exported = await exportPrivateKey(keyPair.privateKey);

      expect(typeof exported).toBe('string');
      expect(exported.length).toBeGreaterThan(0);

      const imported = await importPrivateKey(exported, 'RSA-OAEP', 'SHA-256', ['decrypt']);
      expect(imported.type).toBe('private');
    });

    it('should export and import signing keys', async () => {
      const keyPair = await generateRSASigningKeyPair();
      
      const exportedPublic = await exportPublicKey(keyPair.publicKey);
      const exportedPrivate = await exportPrivateKey(keyPair.privateKey);

      const importedPublic = await importPublicKey(exportedPublic, 'RSA-PSS', 'SHA-256', ['verify']);
      const importedPrivate = await importPrivateKey(exportedPrivate, 'RSA-PSS', 'SHA-256', ['sign']);

      expect(importedPublic.type).toBe('public');
      expect(importedPrivate.type).toBe('private');
    });
  });

  describe('RSA-OAEP Encryption/Decryption', () => {
    it('should encrypt and decrypt data', async () => {
      const keyPair = await generateRSAKeyPair();
      
      const encrypted = await encryptRSA(testData, keyPair.publicKey);
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = await decryptRSA(encrypted, keyPair.privateKey);
      expect(decrypted).toBe(testData);
    });

    it('should encrypt Uint8Array data', async () => {
      const keyPair = await generateRSAKeyPair();
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(testData);

      const encrypted = await encryptRSA(dataBuffer, keyPair.publicKey);
      const decrypted = await decryptRSA(encrypted, keyPair.privateKey);

      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong private key', async () => {
      const keyPair1 = await generateRSAKeyPair();
      const keyPair2 = await generateRSAKeyPair();

      const encrypted = await encryptRSA(testData, keyPair1.publicKey);

      await expect(
        decryptRSA(encrypted, keyPair2.privateKey)
      ).rejects.toThrow();
    });

    it('should work with different hash algorithms', async () => {
      const keyPair = await generateRSAKeyPair({ hash: 'SHA-512' });

      const encrypted = await encryptRSA(testData, keyPair.publicKey, { hash: 'SHA-512' });
      const decrypted = await decryptRSA(encrypted, keyPair.privateKey, { hash: 'SHA-512' });

      expect(decrypted).toBe(testData);
    });

    it('should work with exported/imported keys', async () => {
      const keyPair = await generateRSAKeyPair();
      
      const exportedPublic = await exportPublicKey(keyPair.publicKey);
      const exportedPrivate = await exportPrivateKey(keyPair.privateKey);

      const importedPublic = await importPublicKey(exportedPublic, 'RSA-OAEP', 'SHA-256', ['encrypt']);
      const importedPrivate = await importPrivateKey(exportedPrivate, 'RSA-OAEP', 'SHA-256', ['decrypt']);

      const encrypted = await encryptRSA(testData, importedPublic);
      const decrypted = await decryptRSA(encrypted, importedPrivate);

      expect(decrypted).toBe(testData);
    });
  });

  describe('RSA-PSS Signing/Verification', () => {
    it('should sign and verify data with RSA-PSS', async () => {
      const keyPair = await generateRSASigningKeyPair();

      const signature = await signRSA(testData, keyPair.privateKey);
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);

      const isValid = await verifyRSA(testData, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });

    it('should sign Uint8Array data', async () => {
      const keyPair = await generateRSASigningKeyPair();
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(testData);

      const signature = await signRSA(dataBuffer, keyPair.privateKey);
      const isValid = await verifyRSA(dataBuffer, signature, keyPair.publicKey);

      expect(isValid).toBe(true);
    });

    it('should fail verification with wrong public key', async () => {
      const keyPair1 = await generateRSASigningKeyPair();
      const keyPair2 = await generateRSASigningKeyPair();

      const signature = await signRSA(testData, keyPair1.privateKey);
      const isValid = await verifyRSA(testData, signature, keyPair2.publicKey);

      expect(isValid).toBe(false);
    });

    it('should fail verification with modified data', async () => {
      const keyPair = await generateRSASigningKeyPair();

      const signature = await signRSA(testData, keyPair.privateKey);
      const isValid = await verifyRSA(testData + ' modified', signature, keyPair.publicKey);

      expect(isValid).toBe(false);
    });

    it('should support different hash algorithms', async () => {
      const keyPair256 = await generateRSASigningKeyPair({ hash: 'SHA-256' });
      const signature256 = await signRSA(testData, keyPair256.privateKey, { hash: 'SHA-256' });
      const isValid256 = await verifyRSA(testData, signature256, keyPair256.publicKey, { hash: 'SHA-256' });
      expect(isValid256).toBe(true);

      const keyPair384 = await generateRSASigningKeyPair({ hash: 'SHA-384' });
      const signature384 = await signRSA(testData, keyPair384.privateKey, { hash: 'SHA-384' });
      const isValid384 = await verifyRSA(testData, signature384, keyPair384.publicKey, { hash: 'SHA-384' });
      expect(isValid384).toBe(true);

      const keyPair512 = await generateRSASigningKeyPair({ hash: 'SHA-512' });
      const signature512 = await signRSA(testData, keyPair512.privateKey, { hash: 'SHA-512' });
      const isValid512 = await verifyRSA(testData, signature512, keyPair512.publicKey, { hash: 'SHA-512' });
      expect(isValid512).toBe(true);
    });

    it('should support custom salt length', async () => {
      const keyPair = await generateRSASigningKeyPair();

      const signature = await signRSA(testData, keyPair.privateKey, { saltLength: 64 });
      const isValid = await verifyRSA(testData, signature, keyPair.publicKey, { saltLength: 64 });

      expect(isValid).toBe(true);
    });

    it('should work with exported/imported keys', async () => {
      const keyPair = await generateRSASigningKeyPair();

      const exportedPublic = await exportPublicKey(keyPair.publicKey);
      const exportedPrivate = await exportPrivateKey(keyPair.privateKey);

      const importedPublic = await importPublicKey(exportedPublic, 'RSA-PSS', 'SHA-256', ['verify']);
      const importedPrivate = await importPrivateKey(exportedPrivate, 'RSA-PSS', 'SHA-256', ['sign']);

      const signature = await signRSA(testData, importedPrivate);
      const isValid = await verifyRSA(testData, signature, importedPublic);

      expect(isValid).toBe(true);
    });
  });

  describe('RSASSA-PKCS1-v1_5 Signing/Verification', () => {
    it('should sign and verify data with RSASSA-PKCS1-v1_5', async () => {
      // Generate key pair with RSASSA-PKCS1-v1_5
      const subtle = crypto.subtle;
      const keyPair = await subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: 'SHA-256' },
        },
        true,
        ['sign', 'verify']
      );

      const signature = await signRSA(testData, keyPair.privateKey, { algorithm: 'RSASSA-PKCS1-v1_5' });
      expect(typeof signature).toBe('string');

      const isValid = await verifyRSA(testData, signature, keyPair.publicKey, { algorithm: 'RSASSA-PKCS1-v1_5' });
      expect(isValid).toBe(true);
    });

    it('should fail verification with modified data', async () => {
      const subtle = crypto.subtle;
      const keyPair = await subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: 'SHA-256' },
        },
        true,
        ['sign', 'verify']
      );

      const signature = await signRSA(testData, keyPair.privateKey, { algorithm: 'RSASSA-PKCS1-v1_5' });
      const isValid = await verifyRSA(testData + ' modified', signature, keyPair.publicKey, { algorithm: 'RSASSA-PKCS1-v1_5' });

      expect(isValid).toBe(false);
    });

    it('should support different hash algorithms', async () => {
      const subtle = crypto.subtle;
      
      const keyPair512 = await subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: 'SHA-512' },
        },
        true,
        ['sign', 'verify']
      );

      const signature = await signRSA(testData, keyPair512.privateKey, { 
        algorithm: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-512' 
      });
      const isValid = await verifyRSA(testData, signature, keyPair512.publicKey, { 
        algorithm: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-512' 
      });

      expect(isValid).toBe(true);
    });
  });
});
