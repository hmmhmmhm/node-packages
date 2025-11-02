import type { SignOptions, VerifyOptions, HashAlgorithm } from './types';
import {
  getCrypto,
  stringToUint8Array,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from './utils';

/**
 * Sign data using HMAC
 * @param data - Data to sign (string or Uint8Array)
 * @param secret - Secret key for signing
 * @param options - Signing options
 * @returns Base64 encoded signature
 * @example
 * ```typescript
 * const signature = await sign('my message', 'my-secret-key');
 * const isValid = await verify('my message', signature, 'my-secret-key');
 * ```
 */
export async function sign(
  data: string | Uint8Array,
  secret: string,
  options: SignOptions = {}
): Promise<string> {
  const {
    algorithm = 'HMAC',
    hash = 'SHA-256',
  } = options;

  const subtle = getCrypto();
  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;
  const secretBuffer = stringToUint8Array(secret);

  const key = await subtle.importKey(
    'raw',
    secretBuffer as BufferSource,
    {
      name: algorithm,
      hash: { name: hash },
    },
    false,
    ['sign']
  );

  const signature = await subtle.sign(
    algorithm,
    key,
    dataBuffer as BufferSource
  );

  return arrayBufferToBase64(signature);
}

/**
 * Verify a signature using HMAC
 * @param data - Original data that was signed
 * @param signature - Base64 encoded signature from sign()
 * @param secret - Secret key used for signing
 * @param options - Verification options
 * @returns True if signature is valid, false otherwise
 * @example
 * ```typescript
 * const signature = await sign('my message', 'my-secret-key');
 * const isValid = await verify('my message', signature, 'my-secret-key');
 * console.log(isValid); // true
 * ```
 */
export async function verify(
  data: string | Uint8Array,
  signature: string,
  secret: string,
  options: VerifyOptions = {}
): Promise<boolean> {
  const {
    algorithm = 'HMAC',
    hash = 'SHA-256',
  } = options;

  const subtle = getCrypto();
  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;
  const secretBuffer = stringToUint8Array(secret);
  const signatureBuffer = base64ToArrayBuffer(signature);

  const key = await subtle.importKey(
    'raw',
    secretBuffer as BufferSource,
    {
      name: algorithm,
      hash: { name: hash },
    },
    false,
    ['verify']
  );

  return subtle.verify(
    algorithm,
    key,
    signatureBuffer,
    dataBuffer as BufferSource
  );
}

/**
 * Generate a hash of data
 * @param data - Data to hash
 * @param algorithm - Hash algorithm to use
 * @returns Base64 encoded hash
 * @example
 * ```typescript
 * const hash = await hash('my data', 'SHA-256');
 * console.log(hash); // base64 encoded hash
 * ```
 */
export async function hash(
  data: string | Uint8Array,
  algorithm: HashAlgorithm = 'SHA-256'
): Promise<string> {
  const subtle = getCrypto();
  const dataBuffer = typeof data === 'string' ? stringToUint8Array(data) : data;

  const hashBuffer = await subtle.digest(
    algorithm,
    dataBuffer as BufferSource
  );

  return arrayBufferToBase64(hashBuffer);
}

/**
 * Generate a random key for HMAC signing
 * @param length - Length of the key in bytes (default: 32)
 * @returns Base64 encoded random key
 * @example
 * ```typescript
 * const key = generateKey();
 * const signature = await sign('my message', key);
 * ```
 */
export function generateKey(length: number = 32): string {
  const key = crypto.getRandomValues(new Uint8Array(length));
  return arrayBufferToBase64(key.buffer as ArrayBuffer);
}
