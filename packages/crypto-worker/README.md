# crypto-worker

Unified SubtleCrypto utilities for Node.js, browsers, and Cloudflare Workers without external dependencies.

## Features

- 🔐 **Universal**: Works seamlessly in Node.js, browsers, and Cloudflare Workers
- 🚀 **Zero Dependencies**: Uses native SubtleCrypto API - no external crypto libraries needed
- 📘 **TypeScript**: Full type safety with comprehensive JSDoc documentation
- 🔧 **Simple API**: Easy-to-use encryption, decryption, signing, and verification
- ✅ **Well Tested**: Comprehensive test coverage with 55+ tests
- 🔑 **RSA Support**: RSA-OAEP encryption and RSA-PSS/RSASSA-PKCS1-v1_5 signing

## Installation

```bash
npm install crypto-worker
# or
pnpm add crypto-worker
# or
yarn add crypto-worker
```

## Usage

### Check Environment Support

```typescript
import { isSupported } from 'crypto-worker';

// Check if crypto operations are supported
if (isSupported()) {
  console.log('SubtleCrypto is available!');
  // Proceed with crypto operations
} else {
  console.error('SubtleCrypto is not supported in this environment');
  // Fallback or error handling
}
```

### Encryption & Decryption

```typescript
import { encrypt, decrypt, encryptToString, decryptFromString } from 'crypto-worker';

// Basic encryption/decryption
const encrypted = await encrypt('my-secret-data', 'my-password');
const decrypted = await decrypt(encrypted, 'my-password');

// Encrypt to a single base64 string (easier to store/transmit)
const encryptedString = await encryptToString('my-secret-data', 'my-password');
const decryptedString = await decryptFromString(encryptedString, 'my-password');

// With options
const encrypted = await encrypt('my-secret-data', 'my-password', {
  algorithm: 'AES-GCM', // or 'AES-CBC'
  keyLength: 256, // 128, 192, or 256
});
```

### Signing & Verification

```typescript
import { sign, verify, generateKey } from 'crypto-worker';

// Generate a secure random key
const secretKey = generateKey();

// Sign data
const signature = await sign('my-message', secretKey);

// Verify signature
const isValid = await verify('my-message', signature, secretKey);

// With different hash algorithms
const signature = await sign('my-message', secretKey, { hash: 'SHA-512' });
const isValid = await verify('my-message', signature, secretKey, { hash: 'SHA-512' });
```

### Hashing

```typescript
import { hash } from 'crypto-worker';

// Generate SHA-256 hash
const hash256 = await hash('my-data');

// Use different algorithms
const hash384 = await hash('my-data', 'SHA-384');
const hash512 = await hash('my-data', 'SHA-512');
```

### RSA Encryption & Decryption

```typescript
import {
  generateRSAKeyPair,
  encryptRSA,
  decryptRSA,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
} from 'crypto-worker';

// Generate RSA key pair
const keyPair = await generateRSAKeyPair({ modulusLength: 2048 });

// Encrypt with public key
const encrypted = await encryptRSA('secret data', keyPair.publicKey);

// Decrypt with private key
const decrypted = await decryptRSA(encrypted, keyPair.privateKey);

// Export keys for storage
const publicKeyPEM = await exportPublicKey(keyPair.publicKey);
const privateKeyPEM = await exportPrivateKey(keyPair.privateKey);

// Import keys
const importedPublic = await importPublicKey(publicKeyPEM, 'RSA-OAEP', 'SHA-256', ['encrypt']);
const importedPrivate = await importPrivateKey(privateKeyPEM, 'RSA-OAEP', 'SHA-256', ['decrypt']);
```

### RSA Signing & Verification

```typescript
import {
  generateRSASigningKeyPair,
  signRSA,
  verifyRSA,
} from 'crypto-worker';

// Generate RSA key pair for signing
const keyPair = await generateRSASigningKeyPair({ modulusLength: 2048 });

// Sign with private key (RSA-PSS by default)
const signature = await signRSA('my message', keyPair.privateKey);

// Verify with public key
const isValid = await verifyRSA('my message', signature, keyPair.publicKey);

// Use RSASSA-PKCS1-v1_5 (legacy)
const signature = await signRSA('my message', keyPair.privateKey, {
  algorithm: 'RSASSA-PKCS1-v1_5',
  hash: 'SHA-256',
});
const isValid = await verifyRSA('my message', signature, keyPair.publicKey, {
  algorithm: 'RSASSA-PKCS1-v1_5',
  hash: 'SHA-256',
});
```

### Utility Functions

```typescript
import {
  stringToUint8Array,
  uint8ArrayToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  generateSalt,
  generateIV,
} from 'crypto-worker';

// Convert between string and Uint8Array
const buffer = stringToUint8Array('hello');
const text = uint8ArrayToString(buffer);

// Convert between ArrayBuffer and base64
const base64 = arrayBufferToBase64(buffer.buffer);
const arrayBuffer = base64ToArrayBuffer(base64);

// Generate random values
const salt = generateSalt(16); // 16 bytes
const iv = generateIV(12); // 12 bytes for AES-GCM
```

## API Reference

### Encryption

#### `encrypt(data, password, options?)`
Encrypts data using AES-GCM or AES-CBC.

- **data**: `string | Uint8Array` - Data to encrypt
- **password**: `string` - Password for encryption
- **options**: `EncryptOptions` - Optional encryption settings
  - `algorithm`: `'AES-GCM' | 'AES-CBC'` (default: `'AES-GCM'`)
  - `keyLength`: `128 | 192 | 256` (default: `256`)
  - `iv`: `Uint8Array` - Custom initialization vector
- **Returns**: `Promise<EncryptedData>`

#### `decrypt(encryptedData, password, options?)`
Decrypts data encrypted with `encrypt()`.

- **encryptedData**: `EncryptedData` - Encrypted data object
- **password**: `string` - Password used for encryption
- **options**: `DecryptOptions` - Optional decryption settings
- **Returns**: `Promise<string>`

### Signing

#### `sign(data, secret, options?)`
Signs data using HMAC.

- **data**: `string | Uint8Array` - Data to sign
- **secret**: `string` - Secret key for signing
- **options**: `SignOptions` - Optional signing settings
  - `algorithm`: `'HMAC'` (default)
  - `hash`: `'SHA-256' | 'SHA-384' | 'SHA-512'` (default: `'SHA-256'`)
- **Returns**: `Promise<string>` - Base64 encoded signature

#### `verify(data, signature, secret, options?)`
Verifies a signature.

- **data**: `string | Uint8Array` - Original data
- **signature**: `string` - Base64 encoded signature
- **secret**: `string` - Secret key used for signing
- **options**: `VerifyOptions` - Optional verification settings
- **Returns**: `Promise<boolean>`

#### `hash(data, algorithm?)`
Generates a hash of data.

- **data**: `string | Uint8Array` - Data to hash
- **algorithm**: `'SHA-256' | 'SHA-384' | 'SHA-512'` (default: `'SHA-256'`)
- **Returns**: `Promise<string>` - Base64 encoded hash

### RSA Functions

#### `generateRSAKeyPair(options?)`
Generates an RSA key pair for encryption/decryption.

- **options**: `RSAKeyOptions` - Optional key generation settings
  - `modulusLength`: `2048 | 4096` (default: `2048`)
  - `hash`: `'SHA-256' | 'SHA-384' | 'SHA-512'` (default: `'SHA-256'`)
- **Returns**: `Promise<CryptoKeyPair>`

#### `generateRSASigningKeyPair(options?)`
Generates an RSA key pair for signing/verification.

- **options**: `RSAKeyOptions` - Optional key generation settings
- **Returns**: `Promise<CryptoKeyPair>`

#### `encryptRSA(data, publicKey, options?)`
Encrypts data using RSA-OAEP.

- **data**: `string | Uint8Array` - Data to encrypt
- **publicKey**: `CryptoKey` - Public key for encryption
- **options**: `RSAEncryptOptions` - Optional encryption settings
- **Returns**: `Promise<string>` - Base64 encoded encrypted data

#### `decryptRSA(encryptedData, privateKey, options?)`
Decrypts data using RSA-OAEP.

- **encryptedData**: `string` - Base64 encoded encrypted data
- **privateKey**: `CryptoKey` - Private key for decryption
- **options**: `RSADecryptOptions` - Optional decryption settings
- **Returns**: `Promise<string>` - Decrypted data

#### `signRSA(data, privateKey, options?)`
Signs data using RSA-PSS or RSASSA-PKCS1-v1_5.

- **data**: `string | Uint8Array` - Data to sign
- **privateKey**: `CryptoKey` - Private key for signing
- **options**: `RSASignOptions` - Optional signing settings
  - `algorithm`: `'RSA-PSS' | 'RSASSA-PKCS1-v1_5'` (default: `'RSA-PSS'`)
  - `hash`: `'SHA-256' | 'SHA-384' | 'SHA-512'` (default: `'SHA-256'`)
  - `saltLength`: `number` (default: `32`, RSA-PSS only)
- **Returns**: `Promise<string>` - Base64 encoded signature

#### `verifyRSA(data, signature, publicKey, options?)`
Verifies an RSA signature.

- **data**: `string | Uint8Array` - Original data
- **signature**: `string` - Base64 encoded signature
- **publicKey**: `CryptoKey` - Public key for verification
- **options**: `RSAVerifyOptions` - Optional verification settings
- **Returns**: `Promise<boolean>`

#### `exportPublicKey(key)` / `exportPrivateKey(key)`
Exports a key to base64 format (SPKI for public, PKCS8 for private).

- **key**: `CryptoKey` - Key to export
- **Returns**: `Promise<string>` - Base64 encoded key

#### `importPublicKey(keyData, algorithm, hash, keyUsages)` / `importPrivateKey(...)`
Imports a key from base64 format.

- **keyData**: `string` - Base64 encoded key
- **algorithm**: `'RSA-OAEP' | 'RSA-PSS' | 'RSASSA-PKCS1-v1_5'`
- **hash**: `'SHA-256' | 'SHA-384' | 'SHA-512'`
- **keyUsages**: `KeyUsage[]` - Key usage array
- **Returns**: `Promise<CryptoKey>`

### Utility Functions

#### `isSupported()`
Checks if SubtleCrypto is supported in the current environment.

- **Returns**: `boolean` - True if SubtleCrypto is available, false otherwise
- **Example**:
  ```typescript
  if (isSupported()) {
    // Safe to use crypto operations
  }
  ```

## Platform Support

- ✅ Node.js 20+
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Cloudflare Workers
- ✅ Deno
- ✅ Bun

> **Note**: Node.js 18 and earlier versions may have limited or no SubtleCrypto support in certain environments. We recommend using Node.js 20 or later for full compatibility.

## Security Notes

- Uses PBKDF2 with 100,000 iterations for key derivation
- Generates cryptographically secure random IVs and salts
- AES-GCM provides authenticated encryption (recommended)
- All cryptographic operations use the native SubtleCrypto API

## License

MIT © hmmhmmhm
