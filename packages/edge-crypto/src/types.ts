/**
 * Supported encryption algorithms
 */
export type EncryptionAlgorithm = 'AES-GCM' | 'AES-CBC' | 'RSA-OAEP';

/**
 * Supported signing algorithms
 */
export type SigningAlgorithm = 'HMAC' | 'RSASSA-PKCS1-v1_5' | 'RSA-PSS' | 'ECDSA';

/**
 * Supported hash algorithms
 */
export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

/**
 * Options for encryption operations
 */
export interface EncryptOptions {
  /**
   * Algorithm to use for encryption
   * @default 'AES-GCM'
   */
  algorithm?: EncryptionAlgorithm;
  
  /**
   * Initialization vector (IV) for encryption
   * If not provided, a random IV will be generated
   */
  iv?: Uint8Array;
  
  /**
   * Key length in bits
   * @default 256
   */
  keyLength?: 128 | 192 | 256;
}

/**
 * Options for decryption operations
 */
export interface DecryptOptions {
  /**
   * Algorithm used for encryption
   * @default 'AES-GCM'
   */
  algorithm?: EncryptionAlgorithm;
  
  /**
   * Key length in bits
   * @default 256
   */
  keyLength?: 128 | 192 | 256;
}

/**
 * Options for signing operations
 */
export interface SignOptions {
  /**
   * Algorithm to use for signing
   * @default 'HMAC'
   */
  algorithm?: SigningAlgorithm;
  
  /**
   * Hash algorithm to use
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
}

/**
 * Options for verification operations
 */
export interface VerifyOptions {
  /**
   * Algorithm used for signing
   * @default 'HMAC'
   */
  algorithm?: SigningAlgorithm;
  
  /**
   * Hash algorithm used
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
}

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  /**
   * Encrypted data as base64 string
   */
  data: string;
  
  /**
   * Initialization vector as base64 string
   */
  iv: string;
  
  /**
   * Salt used for key derivation as base64 string
   */
  salt: string;
  
  /**
   * Algorithm used for encryption
   */
  algorithm: EncryptionAlgorithm;
}

/**
 * Key pair for asymmetric cryptography
 */
export interface CryptoKeyPair {
  /**
   * Public key
   */
  publicKey: CryptoKey;
  
  /**
   * Private key
   */
  privateKey: CryptoKey;
}

/**
 * RSA key generation options
 */
export interface RSAKeyOptions {
  /**
   * Modulus length in bits
   * @default 2048
   */
  modulusLength?: 2048 | 4096;
  
  /**
   * Hash algorithm for RSA operations
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
}

/**
 * RSA encryption options
 */
export interface RSAEncryptOptions {
  /**
   * Hash algorithm for RSA-OAEP
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
}

/**
 * RSA decryption options
 */
export interface RSADecryptOptions {
  /**
   * Hash algorithm for RSA-OAEP
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
}

/**
 * RSA signing options
 */
export interface RSASignOptions {
  /**
   * Algorithm to use for signing
   * @default 'RSA-PSS'
   */
  algorithm?: 'RSA-PSS' | 'RSASSA-PKCS1-v1_5';
  
  /**
   * Hash algorithm to use
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
  
  /**
   * Salt length for RSA-PSS (in bytes)
   * @default 32
   */
  saltLength?: number;
}

/**
 * RSA verification options
 */
export interface RSAVerifyOptions {
  /**
   * Algorithm used for signing
   * @default 'RSA-PSS'
   */
  algorithm?: 'RSA-PSS' | 'RSASSA-PKCS1-v1_5';
  
  /**
   * Hash algorithm used
   * @default 'SHA-256'
   */
  hash?: HashAlgorithm;
  
  /**
   * Salt length for RSA-PSS (in bytes)
   * @default 32
   */
  saltLength?: number;
}
