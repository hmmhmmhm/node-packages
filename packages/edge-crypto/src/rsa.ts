import type {
  CryptoKeyPair,
  RSAKeyOptions,
  RSAEncryptOptions,
  RSADecryptOptions,
  RSASignOptions,
  RSAVerifyOptions,
} from './types';
import {
  getCrypto,
  stringToUint8Array,
  uint8ArrayToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from './utils';

/**
 * Generate an RSA key pair
 * @param options - Key generation options
 * @returns Promise resolving to a CryptoKeyPair
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair({ modulusLength: 2048 });
 * ```
 */
export async function generateRSAKeyPair(
  options: RSAKeyOptions = {}
): Promise<CryptoKeyPair> {
  const {
    modulusLength = 2048,
    hash = 'SHA-256',
  } = options;

  const subtle = getCrypto();
  
  const keyPair = await subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: { name: hash },
    },
    true,
    ['encrypt', 'decrypt']
  );

  return keyPair as CryptoKeyPair;
}

/**
 * Generate an RSA key pair for signing
 * @param options - Key generation options
 * @returns Promise resolving to a CryptoKeyPair
 * @example
 * ```typescript
 * const keyPair = await generateRSASigningKeyPair({ modulusLength: 2048 });
 * ```
 */
export async function generateRSASigningKeyPair(
  options: RSAKeyOptions = {}
): Promise<CryptoKeyPair> {
  const {
    modulusLength = 2048,
    hash = 'SHA-256',
  } = options;

  const subtle = getCrypto();
  
  const keyPair = await subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: { name: hash },
    },
    true,
    ['sign', 'verify']
  );

  return keyPair as CryptoKeyPair;
}

/**
 * Export a public key to PEM format
 * @param key - CryptoKey to export
 * @returns Base64 encoded public key in SPKI format
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair();
 * const publicKeyPEM = await exportPublicKey(keyPair.publicKey);
 * ```
 */
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const subtle = getCrypto();
  const exported = await subtle.exportKey('spki', key);
  return arrayBufferToBase64(exported);
}

/**
 * Export a private key to PEM format
 * @param key - CryptoKey to export
 * @returns Base64 encoded private key in PKCS8 format
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair();
 * const privateKeyPEM = await exportPrivateKey(keyPair.privateKey);
 * ```
 */
export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const subtle = getCrypto();
  const exported = await subtle.exportKey('pkcs8', key);
  return arrayBufferToBase64(exported);
}

/**
 * Import a public key from base64 format
 * @param keyData - Base64 encoded public key in SPKI format
 * @param algorithm - Algorithm name ('RSA-OAEP', 'RSA-PSS', or 'RSASSA-PKCS1-v1_5')
 * @param hash - Hash algorithm
 * @param keyUsages - Key usages
 * @returns Promise resolving to a CryptoKey
 * @example
 * ```typescript
 * const publicKey = await importPublicKey(publicKeyPEM, 'RSA-OAEP', 'SHA-256', ['encrypt']);
 * ```
 */
export async function importPublicKey(
  keyData: string,
  algorithm: 'RSA-OAEP' | 'RSA-PSS' | 'RSASSA-PKCS1-v1_5' = 'RSA-OAEP',
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
  keyUsages: KeyUsage[] = ['encrypt']
): Promise<CryptoKey> {
  const subtle = getCrypto();
  const keyBuffer = base64ToArrayBuffer(keyData);
  
  return subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: algorithm,
      hash: { name: hash },
    },
    true,
    keyUsages
  );
}

/**
 * Import a private key from base64 format
 * @param keyData - Base64 encoded private key in PKCS8 format
 * @param algorithm - Algorithm name ('RSA-OAEP', 'RSA-PSS', or 'RSASSA-PKCS1-v1_5')
 * @param hash - Hash algorithm
 * @param keyUsages - Key usages
 * @returns Promise resolving to a CryptoKey
 * @example
 * ```typescript
 * const privateKey = await importPrivateKey(privateKeyPEM, 'RSA-OAEP', 'SHA-256', ['decrypt']);
 * ```
 */
export async function importPrivateKey(
  keyData: string,
  algorithm: 'RSA-OAEP' | 'RSA-PSS' | 'RSASSA-PKCS1-v1_5' = 'RSA-OAEP',
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
  keyUsages: KeyUsage[] = ['decrypt']
): Promise<CryptoKey> {
  const subtle = getCrypto();
  const keyBuffer = base64ToArrayBuffer(keyData);
  
  return subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: algorithm,
      hash: { name: hash },
    },
    true,
    keyUsages
  );
}

/**
 * Encrypt data using RSA-OAEP
 * @param data - Data to encrypt (string or Uint8Array)
 * @param publicKey - Public key for encryption
 * @param options - Encryption options
 * @returns Base64 encoded encrypted data
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair();
 * const encrypted = await encryptRSA('secret data', keyPair.publicKey);
 * ```
 */
export async function encryptRSA(
  data: string | Uint8Array,
  publicKey: CryptoKey,
  options: RSAEncryptOptions = {}
): Promise<string> {
  const { hash = 'SHA-256' } = options;
  
  const subtle = getCrypto();
  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;

  const encrypted = await subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    dataBuffer as BufferSource
  );

  return arrayBufferToBase64(encrypted);
}

/**
 * Decrypt data using RSA-OAEP
 * @param encryptedData - Base64 encoded encrypted data
 * @param privateKey - Private key for decryption
 * @param options - Decryption options
 * @returns Decrypted data as string
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair();
 * const encrypted = await encryptRSA('secret data', keyPair.publicKey);
 * const decrypted = await decryptRSA(encrypted, keyPair.privateKey);
 * ```
 */
export async function decryptRSA(
  encryptedData: string,
  privateKey: CryptoKey,
  options: RSADecryptOptions = {}
): Promise<string> {
  const { hash = 'SHA-256' } = options;
  
  const subtle = getCrypto();
  const dataBuffer = base64ToArrayBuffer(encryptedData);

  const decrypted = await subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    dataBuffer
  );

  return uint8ArrayToString(new Uint8Array(decrypted));
}

/**
 * Sign data using RSA-PSS or RSASSA-PKCS1-v1_5
 * @param data - Data to sign (string or Uint8Array)
 * @param privateKey - Private key for signing
 * @param options - Signing options
 * @returns Base64 encoded signature
 * @example
 * ```typescript
 * const keyPair = await generateRSASigningKeyPair();
 * const signature = await signRSA('my message', keyPair.privateKey);
 * ```
 */
export async function signRSA(
  data: string | Uint8Array,
  privateKey: CryptoKey,
  options: RSASignOptions = {}
): Promise<string> {
  const {
    algorithm = 'RSA-PSS',
    hash = 'SHA-256',
    saltLength = 32,
  } = options;

  const subtle = getCrypto();
  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;

  const algorithmParams = algorithm === 'RSA-PSS'
    ? { name: algorithm, saltLength }
    : { name: algorithm };

  const signature = await subtle.sign(
    algorithmParams,
    privateKey,
    dataBuffer as BufferSource
  );

  return arrayBufferToBase64(signature);
}

/**
 * Verify a signature using RSA-PSS or RSASSA-PKCS1-v1_5
 * @param data - Original data that was signed
 * @param signature - Base64 encoded signature
 * @param publicKey - Public key for verification
 * @param options - Verification options
 * @returns True if signature is valid, false otherwise
 * @example
 * ```typescript
 * const keyPair = await generateRSASigningKeyPair();
 * const signature = await signRSA('my message', keyPair.privateKey);
 * const isValid = await verifyRSA('my message', signature, keyPair.publicKey);
 * ```
 */
export async function verifyRSA(
  data: string | Uint8Array,
  signature: string,
  publicKey: CryptoKey,
  options: RSAVerifyOptions = {}
): Promise<boolean> {
  const {
    algorithm = 'RSA-PSS',
    hash = 'SHA-256',
    saltLength = 32,
  } = options;

  const subtle = getCrypto();
  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;
  const signatureBuffer = base64ToArrayBuffer(signature);

  const algorithmParams = algorithm === 'RSA-PSS'
    ? { name: algorithm, saltLength }
    : { name: algorithm };

  return subtle.verify(
    algorithmParams,
    publicKey,
    signatureBuffer,
    dataBuffer as BufferSource
  );
}
