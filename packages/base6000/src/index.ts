import words from '../english.json';

/**
 * Base6000 encoder/decoder using English words
 * Converts numbers to/from base-6000 representation using 6000 English words
 */

const BASE = 6000;
const WORDS: string[] = words;

// Create reverse lookup map for decoding
const WORD_TO_INDEX = new Map<string, number>();
WORDS.forEach((word, index) => {
  WORD_TO_INDEX.set(word.toLowerCase(), index);
});

/**
 * Encode a number or bigint to base-6000 word representation
 * @param num - The number to encode (can be number, bigint, or string)
 * @param separator - Optional separator between words (default: '-')
 * @returns Encoded string of words
 * 
 * @example
 * encode(0) // 'A'
 * encode(6000) // 'B-A'
 * encode(123456) // 'U-Lvi'
 * encode('373493284239852352787678') // handles very large numbers as strings
 */
export function encode(num: number | bigint | string, separator: string = '-'): string {
  // Convert to BigInt safely
  let n: bigint;
  
  if (typeof num === 'string') {
    // Remove 'n' suffix if present and convert to BigInt
    const cleanValue = num.replace(/n$/i, '').trim();
    try {
      n = BigInt(cleanValue);
    } catch (e) {
      throw new Error('Invalid number format');
    }
  } else if (typeof num === 'number') {
    if (!Number.isInteger(num)) {
      throw new Error('Only integers can be encoded');
    }
    if (!Number.isSafeInteger(num)) {
      throw new Error(`Number ${num} exceeds safe integer range. Use BigInt or string instead.`);
    }
    n = BigInt(num);
  } else {
    n = num;
  }
  
  if (n < 0n) {
    throw new Error('Only non-negative numbers can be encoded');
  }
  
  if (n === 0n) {
    return WORDS[0];
  }

  const result: string[] = [];
  
  while (n > 0n) {
    const remainder = Number(n % BigInt(BASE));
    result.unshift(WORDS[remainder]);
    n = n / BigInt(BASE);
  }

  return result.join(separator);
}

/**
 * Decode a base-6000 word representation back to a number
 * @param encoded - The encoded string of words
 * @param separator - Optional separator between words (default: auto-detect all special characters)
 * @returns Decoded number as bigint
 * 
 * @example
 * decode('a') // 0n
 * decode('b-a') // 6000n
 * decode('u-meeting') // 123456n
 * decode('high-categories-are-momentum') // hyphen separator
 * decode('high categories are momentum') // space separator
 * decode('high_categories_are_momentum') // underscore separator
 * decode('high/categories/are/momentum') // slash separator
 * decode('high+categories+are+momentum') // plus separator
 * decode('high@categories@are@momentum') // any special character works
 */
export function decode(encoded: string, separator?: string): bigint {
  if (!encoded || encoded.trim() === '') {
    throw new Error('Encoded string cannot be empty');
  }

  // Normalize to lowercase for case-insensitive matching
  const normalized = encoded.toLowerCase().trim();
  
  let wordList: string[];
  
  if (separator !== undefined) {
    // Use provided separator
    wordList = normalized.split(separator).map(w => w.trim()).filter(w => w.length > 0);
  } else {
    // Auto-detect separator: split by any non-alphanumeric characters
    // This allows -, _, /, +, @, space, and any other special characters as separators
    wordList = normalized.split(/[^a-z0-9]+/).filter(w => w.length > 0);
  }
  
  let result = 0n;

  for (const word of wordList) {
    const index = WORD_TO_INDEX.get(word);
    
    if (index === undefined) {
      throw new Error(`Invalid word in encoded string: "${word}"`);
    }

    result = result * BigInt(BASE) + BigInt(index);
  }

  return result;
}

/**
 * Get the word at a specific index
 * @param index - Index (0-5999)
 * @returns The word at that index
 */
export function getWord(index: number): string {
  if (index < 0 || index >= BASE) {
    throw new Error(`Index must be between 0 and ${BASE - 1}`);
  }
  return WORDS[index];
}
