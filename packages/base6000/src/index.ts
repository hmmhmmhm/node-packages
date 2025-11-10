import words from '../english.json';
import { utils, divide as bigDivide, multiply as bigMultiply, add as bigAdd, mod as bigMod, compare as bigCompare, floor as bigFloor } from 'biggest';

/**
 * Base6000 encoder/decoder using English words
 * Converts numbers to/from base-6000 representation using 6000 English words
 */

const BASE = 6000;
const BASE_STR = '6000';
const WORDS: string[] = words;

// Create reverse lookup map for decoding
const WORD_TO_INDEX = new Map<string, number>();
WORDS.forEach((word, index) => {
  WORD_TO_INDEX.set(word.toLowerCase(), index);
});

// Threshold for switching to biggest module (around 10^100)
// BigInt can handle much larger numbers, but operations become slow
// We use string length as a proxy for size to avoid BigInt exponentiation issues
const BIGINT_THRESHOLD_LENGTH = 100;

/**
 * Check if a bigint is too large for efficient BigInt operations
 */
function shouldUseBiggest(n: bigint): boolean {
  const str = n.toString();
  const cleaned = str.replace(/^-/, '');
  return cleaned.length > BIGINT_THRESHOLD_LENGTH;
}

/**
 * Check if a string representation of a number is too large
 */
function isStringTooLarge(str: string): boolean {
  const cleaned = str.replace(/^-/, '');
  return cleaned.length > BIGINT_THRESHOLD_LENGTH;
}

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

  // Determine if we should use biggest module
  const useBiggest = shouldUseBiggest(n);
  const numStr = n.toString();
  
  const result: string[] = [];

  if (useBiggest) {
    // Use biggest module for very large numbers
    let num = numStr;
    
    while (bigCompare(num, '0') > 0) {
      const remainder = bigMod(num, BASE_STR);
      const remainderNum = parseInt(remainder);
      result.unshift(WORDS[remainderNum]);
      // Integer division: divide with sufficient precision then floor
      // Use precision of 20 which is enough for accurate integer division
      num = bigFloor(bigDivide(num, BASE_STR, 20));
    }
  } else {
    // Use BigInt for smaller numbers (faster)
    let num = n;
    
    while (num > 0n) {
      const remainder = Number(num % BigInt(BASE));
      result.unshift(WORDS[remainder]);
      num = num / BigInt(BASE);
    }
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
  
  // Estimate if result will be large based on number of words
  // Each word represents log(6000) ≈ 3.78 decimal digits
  // So 27 words ≈ 102 digits (above threshold)
  const estimatedDigits = wordList.length * 3.78;
  const useBiggest = estimatedDigits > 90; // Use threshold slightly below 100 for safety
  
  if (useBiggest) {
    // Use biggest module for very large results
    let result = '0';

    for (const word of wordList) {
      const index = WORD_TO_INDEX.get(word);

      if (index === undefined) {
        throw new Error(`Invalid word in encoded string: "${word}"`);
      }

      // result = result * BASE + index
      result = bigMultiply(result, BASE_STR);
      result = bigAdd(result, index.toString());
    }

    // Convert back to BigInt for return
    return BigInt(result);
  } else {
    // Use BigInt for smaller results (faster)
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
