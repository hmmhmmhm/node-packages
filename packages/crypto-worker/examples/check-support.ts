/**
 * Example: Check if crypto operations are supported
 */

import { isSupported, encrypt, decrypt } from '../src/index';

async function main() {
  // Check if SubtleCrypto is supported
  if (!isSupported()) {
    console.error('❌ SubtleCrypto is not supported in this environment');
    console.error('This library requires a modern environment with Web Crypto API support');
    process.exit(1);
  }

  console.log('✅ SubtleCrypto is supported!');
  console.log('You can safely use all crypto operations.\n');

  // Example: Use crypto operations
  try {
    const data = 'Hello, World!';
    const password = 'my-secure-password';

    console.log('Encrypting data...');
    const encrypted = await encrypt(data, password);
    console.log('✓ Encryption successful');

    console.log('Decrypting data...');
    const decrypted = await decrypt(encrypted, password);
    console.log('✓ Decryption successful');

    console.log(`\nOriginal: ${data}`);
    console.log(`Decrypted: ${decrypted}`);
    console.log(`Match: ${data === decrypted ? '✓' : '✗'}`);
  } catch (error) {
    console.error('Error during crypto operations:', error);
    process.exit(1);
  }
}

main();
