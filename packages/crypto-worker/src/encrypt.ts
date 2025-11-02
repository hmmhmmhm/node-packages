import type { EncryptOptions, DecryptOptions, EncryptedData } from './types';
import {
  getCrypto,
  stringToUint8Array,
  uint8ArrayToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  generateSalt,
  generateIV,
  deriveKey,
} from './utils';

/**
 * Encrypt data using a password
 * @param data - Data to encrypt (string or Uint8Array)
 * @param password - Password to use for encryption
 * @param options - Encryption options
 * @returns Encrypted data object containing ciphertext, IV, and salt
 * @example
 * ```typescript
 * const encrypted = await encrypt('my secret data', 'my-password');
 * console.log(encrypted.data); // base64 encoded ciphertext
 * ```
 */
export async function encrypt(
  data: string | Uint8Array,
  password: string,
  options: EncryptOptions = {}
): Promise<EncryptedData> {
  const {
    algorithm = 'AES-GCM',
    iv = generateIV(algorithm === 'AES-GCM' ? 12 : 16),
    keyLength = 256,
  } = options;

  const subtle = getCrypto();
  const salt = generateSalt();
  const key = await deriveKey(password, salt, keyLength, algorithm);

  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;

  const encryptedBuffer = await subtle.encrypt(
    {
      name: algorithm,
      iv: iv as BufferSource,
    },
    key,
    dataBuffer as BufferSource
  );

  return {
    data: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
    algorithm,
  };
}

/**
 * Decrypt data using a password
 * @param encryptedData - Encrypted data object from encrypt()
 * @param password - Password used for encryption
 * @param options - Decryption options
 * @returns Decrypted data as string
 * @example
 * ```typescript
 * const encrypted = await encrypt('my secret data', 'my-password');
 * const decrypted = await decrypt(encrypted, 'my-password');
 * console.log(decrypted); // 'my secret data'
 * ```
 */
export async function decrypt(
  encryptedData: EncryptedData,
  password: string,
  options: DecryptOptions = {}
): Promise<string> {
  const {
    algorithm = encryptedData.algorithm,
    keyLength = 256,
  } = options;

  const subtle = getCrypto();
  const salt = new Uint8Array(base64ToArrayBuffer(encryptedData.salt));
  const iv = new Uint8Array(base64ToArrayBuffer(encryptedData.iv));
  const data = base64ToArrayBuffer(encryptedData.data);

  const key = await deriveKey(password, salt, keyLength, algorithm);

  const decryptedBuffer = await subtle.decrypt(
    {
      name: algorithm,
      iv: iv as BufferSource,
    },
    key,
    data
  );

  return uint8ArrayToString(new Uint8Array(decryptedBuffer));
}

/**
 * Encrypt data and return as a single base64 string
 * @param data - Data to encrypt
 * @param password - Password to use for encryption
 * @param options - Encryption options
 * @returns Base64 encoded string containing all encrypted data
 * @example
 * ```typescript
 * const encrypted = await encryptToString('my secret', 'password');
 * const decrypted = await decryptFromString(encrypted, 'password');
 * ```
 */
export async function encryptToString(
  data: string | Uint8Array,
  password: string,
  options: EncryptOptions = {}
): Promise<string> {
  const encrypted = await encrypt(data, password, options);
  return btoa(JSON.stringify(encrypted));
}

/**
 * Decrypt data from a base64 string
 * @param encryptedString - Base64 encoded encrypted data from encryptToString()
 * @param password - Password used for encryption
 * @param options - Decryption options
 * @returns Decrypted data as string
 */
export async function decryptFromString(
  encryptedString: string,
  password: string,
  options: DecryptOptions = {}
): Promise<string> {
  const encrypted: EncryptedData = JSON.parse(atob(encryptedString));
  return decrypt(encrypted, password, options);
}
