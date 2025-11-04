/**
 * Browser-compatible FE1 Format Preserving Encryption implementation
 * Based on node-fe1-fpe but using Web Crypto API instead of Node.js crypto
 */

// BigInt buffer conversion utilities
function toBigIntBE(buffer: Uint8Array): bigint {
  let result = 0n;
  for (let i = 0; i < buffer.length; i++) {
    result = (result << 8n) | BigInt(buffer[i]);
  }
  return result;
}

function toBufferBE(value: bigint, length: number): Uint8Array {
  const buffer = new Uint8Array(length);
  let num = value;
  for (let i = length - 1; i >= 0; i--) {
    buffer[i] = Number(num & 0xFFn);
    num = num >> 8n;
  }
  return buffer;
}

function encode(long: bigint): Uint8Array {
  return toBufferBE(long, 8);
}

function toBeBytes(num: number | bigint): Uint8Array {
  // Ensure num is a valid integer before converting to BigInt
  if (typeof num === 'number') {
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      throw new Error(`Invalid number for BigInt conversion: ${num}`);
    }
  }
  return toBufferBE(BigInt(num), 8);
}

function assureBigInt(n: number | bigint): bigint {
  if (typeof n === 'bigint') return n;
  if (typeof n === 'number') {
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      throw new Error(`Invalid number for BigInt conversion: ${n}`);
    }
  }
  return BigInt(n);
}

// String to UTF-16LE buffer conversion
function stringToUtf16LE(str: string): Uint8Array {
  const buffer = new Uint8Array(str.length * 2);
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    buffer[i * 2] = charCode & 0xFF;
    buffer[i * 2 + 1] = (charCode >> 8) & 0xFF;
  }
  return buffer;
}

// Prime factorization
const factorCache: { [key: string]: [bigint, bigint] } = {};

class PrimeGenerator {
  private markedNotPrimeMap: { [key: number]: number[] } = {};
  private seq = 1;

  next(): number {
    while (true) {
      this.seq += 1;
      if (!this.markedNotPrimeMap[this.seq]) {
        this.markedNotPrimeMap[this.seq ** 2] = [this.seq];
        return this.seq;
      }
      const primes = this.markedNotPrimeMap[this.seq];
      primes.forEach((prime) => {
        const nextMultipleOfPrime = prime + this.seq;
        if (this.markedNotPrimeMap[nextMultipleOfPrime]) {
          this.markedNotPrimeMap[nextMultipleOfPrime].push(prime);
        } else {
          this.markedNotPrimeMap[nextMultipleOfPrime] = [prime];
        }
      });
      delete this.markedNotPrimeMap[this.seq];
    }
  }
}

function factor(n: bigint): [bigint, bigint] {
  const primes = new PrimeGenerator();
  let a = 1n;
  let b = 1n;
  let p: bigint;

  for (let k = 0n; n > 1n; k++) {
    p = BigInt(primes.next());
    if (n % p === 0n) {
      while (n % p === 0n) {
        b *= p;
        if (a < b) {
          [a, b] = [b, a];
        }
        n /= p;
      }
    }
  }

  if (a <= 1 || b <= 1) {
    throw new Error('Could not factor n for use in FPE, prime numbers cannot be used as modulus');
  }

  return [a, b];
}

function getCachedFactor(num: number | bigint): [bigint, bigint] {
  const key = String(num);
  if (factorCache[key] === undefined) {
    factorCache[key] = factor(assureBigInt(num));
  }
  return factorCache[key];
}

// HMAC-SHA256 implementation using Web Crypto API
async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  // Ensure proper ArrayBuffer type for Web Crypto API
  const keyBuffer = new Uint8Array(key);
  const dataBuffer = new Uint8Array(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  return new Uint8Array(signature);
}

// Concatenate multiple Uint8Arrays
function concatBuffers(...buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(buf, offset);
    offset += buf.length;
  }
  return result;
}

class FPEEncryptor {
  private keyByte: Uint8Array;
  private macNT: Uint8Array | null = null;

  constructor(key: string | Uint8Array) {
    this.keyByte = typeof key === 'string' ? stringToUtf16LE(key) : key;
    // macNT will be initialized asynchronously
  }

  async initialize(modulus: bigint, tweak: string | Uint8Array): Promise<void> {
    const nBin = encode(modulus);
    const tweakByte = typeof tweak === 'string' ? stringToUtf16LE(tweak) : tweak;
    
    const data = concatBuffers(
      toBeBytes(nBin.length),
      nBin,
      toBeBytes(tweakByte.length),
      tweakByte
    );
    
    this.macNT = await hmacSha256(this.keyByte, data);
  }

  async format(roundNumber: number, r: bigint): Promise<bigint> {
    if (!this.macNT) {
      throw new Error('FPEEncryptor not initialized');
    }
    
    const rBin = encode(r);
    const data = concatBuffers(
      this.macNT,
      toBeBytes(roundNumber),
      toBeBytes(rBin.length),
      rBin
    );
    
    const mac = await hmacSha256(this.keyByte, data);
    return toBigIntBE(mac);
  }
}

/**
 * Generic Z_n FPE encryption, FE1 scheme.
 */
export async function encrypt(
  modulus: number,
  subject: number,
  key: string | Uint8Array,
  tweak: string | Uint8Array,
  rounds: number = 3
): Promise<number> {
  if (!Number.isInteger(rounds) || rounds < 1) {
    throw Error('Parameter <round> must be a positive integer.');
  }

  const modulusBigInt = assureBigInt(modulus);
  const cipher = new FPEEncryptor(key);
  await cipher.initialize(modulusBigInt, tweak);
  
  const [firstFactor, secondFactor] = getCachedFactor(modulus);

  let right: bigint;
  let x = BigInt(subject);

  for (let i = 0; i < rounds; i++) {
    right = x % secondFactor;
    const formatResult = await cipher.format(i, right);
    x = (firstFactor * right) + ((formatResult + x / secondFactor) % firstFactor);
  }

  return Number(x);
}

/**
 * Generic Z_n FPE decryption, FE1 scheme.
 */
export async function decrypt(
  modulus: number,
  cryptedSubject: number,
  key: string | Uint8Array,
  tweak: string | Uint8Array,
  rounds: number = 3
): Promise<number> {
  if (!Number.isInteger(rounds) || rounds < 1) {
    throw Error('Parameter <round> must be a positive integer.');
  }

  const modulusBigInt = assureBigInt(modulus);
  const cipher = new FPEEncryptor(key);
  await cipher.initialize(modulusBigInt, tweak);
  
  const [firstFactor, secondFactor] = getCachedFactor(modulus);

  let modulu: bigint;
  let right: bigint;
  let left: bigint;
  let x = BigInt(cryptedSubject);

  for (let i = rounds - 1; i >= 0; i--) {
    right = x / firstFactor;
    const formatResult = await cipher.format(i, right);
    modulu = (formatResult - (x % firstFactor)) % firstFactor;
    left = modulu > 0n ? firstFactor - modulu : -modulu;
    x = (secondFactor * left) + right;
  }

  return Number(x);
}

export default { encrypt, decrypt };
