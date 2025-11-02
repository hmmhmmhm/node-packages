/**
 * Check if SubtleCrypto is supported in the current environment
 * @returns True if SubtleCrypto is available, false otherwise
 * @example
 * ```typescript
 * if (isSupported()) {
 *   const encrypted = await encrypt('data', 'password');
 * } else {
 *   console.error('Crypto operations are not supported in this environment');
 * }
 * ```
 */
export function isSupported(): boolean {
  try {
    // Browser and Cloudflare Workers
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      return true;
    }
    
    // Node.js
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Get the global crypto object (works in Node.js, browsers, and Cloudflare Workers)
 * @returns The SubtleCrypto instance
 * @throws {Error} If crypto is not available
 */
export function getCrypto(): SubtleCrypto {
  // Browser and Cloudflare Workers
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return crypto.subtle;
  }
  
  // Node.js
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  
  throw new Error('SubtleCrypto is not available in this environment');
}

/**
 * Convert a string to Uint8Array
 * @param str - String to convert
 * @returns Uint8Array representation
 */
export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert Uint8Array to string
 * @param arr - Uint8Array to convert
 * @returns String representation
 */
export function uint8ArrayToString(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

/**
 * Convert ArrayBuffer to base64 string
 * @param buffer - ArrayBuffer to convert
 * @returns Base64 encoded string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer
 * @param base64 - Base64 encoded string
 * @returns ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a random salt
 * @param length - Length of the salt in bytes
 * @returns Random salt as Uint8Array
 */
export function generateSalt(length: number = 16): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Generate a random initialization vector (IV)
 * @param length - Length of the IV in bytes
 * @returns Random IV as Uint8Array
 */
export function generateIV(length: number = 12): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Derive a cryptographic key from a password
 * @param password - Password to derive key from
 * @param salt - Salt for key derivation
 * @param keyLength - Length of the key in bits
 * @param algorithm - Algorithm to use the key with
 * @returns Derived CryptoKey
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  keyLength: number = 256,
  algorithm: string = 'AES-GCM'
): Promise<CryptoKey> {
  const subtle = getCrypto();
  const passwordBuffer = stringToUint8Array(password);
  const passwordKey = await subtle.importKey(
    'raw',
    passwordBuffer as BufferSource,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: algorithm, length: keyLength },
    false,
    ['encrypt', 'decrypt']
  );
}
