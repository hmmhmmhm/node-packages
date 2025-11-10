import emojis from '../emoji.json';
import { utils, divide as bigDivide, multiply as bigMultiply, add as bigAdd, mod as bigMod, compare as bigCompare, floor as bigFloor } from 'biggest';

/**
 * Base2000 encoder/decoder using emojis
 * Converts numbers to/from base-N representation using colorful emojis.
 */
const EMOJIS: string[] = emojis;
const BASE = EMOJIS.length; // Dynamically set based on emoji count
const BASE_STR = BASE.toString();

// Create reverse lookup map for decoding
const EMOJI_TO_INDEX = new Map<string, number>();
EMOJIS.forEach((emoji, index) => {
  EMOJI_TO_INDEX.set(emoji, index);
});

// Threshold for switching to biggest module (around 10^100)
// BigInt can handle much larger numbers, but operations become slow
// We use string length as a proxy for size to avoid BigInt exponentiation issues
const BIGINT_THRESHOLD_LENGTH = 100;

/**
 * Check if a bigint value exceeds the threshold for using biggest
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
 * Encode a number or bigint to base-N emoji representation
 * @param num - The number to encode (can be number, bigint, or string)
 * @param separator - Optional separator between emojis (default: '')
 * @returns Encoded string of emojis
 * 
 * @example
 * encode(0) // '😀'
 * encode(2429) // '😁😀'
 * encode(123456) // emoji representation
 * encode('373493284239852352787678') // handles very large numbers as strings
 */
export function encode(num: number | bigint | string, separator: string = ''): string {
  let numStr: string;
  let useBiggest = false;

  if (typeof num === 'string') {
    // Remove 'n' suffix if present
    const cleanValue = num.replace(/n$/i, '').trim();
    
    // Validate the string is a valid integer
    if (!/^-?\d+$/.test(cleanValue)) {
      throw new Error('Invalid number format');
    }
    
    numStr = cleanValue;
    useBiggest = isStringTooLarge(numStr);
  } else if (typeof num === 'number') {
    if (!Number.isInteger(num)) {
      throw new Error('Only integers can be encoded');
    }
    if (!Number.isSafeInteger(num)) {
      throw new Error(`Number ${num} exceeds safe integer range. Use BigInt or string instead.`);
    }
    numStr = num.toString();
  } else {
    // BigInt
    numStr = num.toString();
    useBiggest = shouldUseBiggest(num);
  }

  // Check for negative numbers
  if (numStr.startsWith('-')) {
    throw new Error('Only non-negative numbers can be encoded');
  }

  // Handle zero
  if (numStr === '0') {
    return EMOJIS[0];
  }

  const result: string[] = [];

  if (useBiggest) {
    // Use biggest module for very large numbers
    let n = numStr;
    
    while (bigCompare(n, '0') > 0) {
      const remainder = bigMod(n, BASE_STR);
      const remainderNum = parseInt(remainder);
      result.unshift(EMOJIS[remainderNum]);
      // Integer division: divide with sufficient precision then floor
      // Use precision of 20 which is enough for accurate integer division
      n = bigFloor(bigDivide(n, BASE_STR, 20));
    }
  } else {
    // Use BigInt for smaller numbers (faster)
    let n = BigInt(numStr);
    
    while (n > 0n) {
      const remainder = Number(n % BigInt(BASE));
      result.unshift(EMOJIS[remainder]);
      n = n / BigInt(BASE);
    }
  }

  return result.join(separator);
}

/**
 * Decode a base-N emoji representation back to a number
 * @param encoded - The encoded string of emojis
 * @param separator - Optional separator between emojis (default: auto-detect)
 * @returns Decoded number as bigint
 * 
 * @example
 * decode('😀') // 0n
 * decode('😁😀') // 2429n
 * decode(emoji_string) // decoded number
 * decode('😀-😁-😂') // with separator
 */
export function decode(encoded: string, separator?: string): bigint {
  if (!encoded || encoded.trim() === '') {
    throw new Error('Encoded string cannot be empty');
  }

  const normalized = encoded.trim();

  let emojiList: string[];

  if (separator !== undefined && separator !== '') {
    // Use provided separator
    emojiList = normalized.split(separator).map(e => e.trim()).filter(e => e.length > 0);
  } else {
    // No separator - need to match emojis from our list
    // Try to match the longest emoji first (greedy matching)
    emojiList = [];
    let remaining = normalized;

    while (remaining.length > 0) {
      let found = false;

      // Try matching from longest to shortest possible emoji
      for (let len = Math.min(remaining.length, 20); len > 0; len--) {
        const candidate = remaining.substring(0, len);
        if (EMOJI_TO_INDEX.has(candidate)) {
          emojiList.push(candidate);
          remaining = remaining.substring(len);
          found = true;
          break;
        }
      }

      if (!found) {
        // Could not match any emoji at current position
        const char = remaining[0];
        throw new Error(`Invalid emoji in encoded string: "${char}"`);
      }
    }
  }

  // Determine if we need to use biggest based on emoji count
  // More than ~90 emojis in base-2000 exceeds 10^100
  const useBiggest = emojiList.length > 90;

  if (useBiggest) {
    // Use biggest module for very large results
    let result = '0';

    for (const emoji of emojiList) {
      const index = EMOJI_TO_INDEX.get(emoji);

      if (index === undefined) {
        throw new Error(`Invalid emoji in encoded string: "${emoji}"`);
      }

      // result = result * BASE + index
      result = bigMultiply(result, BASE_STR);
      result = bigAdd(result, index.toString());
    }

    return BigInt(result);
  } else {
    // Use BigInt for smaller results (faster)
    let result = 0n;

    for (const emoji of emojiList) {
      const index = EMOJI_TO_INDEX.get(emoji);

      if (index === undefined) {
        throw new Error(`Invalid emoji in encoded string: "${emoji}"`);
      }

      result = result * BigInt(BASE) + BigInt(index);
    }

    return result;
  }
}

/**
 * Get the emoji at a specific index
 * @param index - Index (0 to BASE-1)
 * @returns The emoji at that index
 */
export function getEmoji(index: number): string {
  if (index < 0 || index >= BASE) {
    throw new Error(`Index must be between 0 and ${BASE - 1}`);
  }
  return EMOJIS[index];
}

/**
 * Get the base (total number of emojis)
 * @returns The base number
 */
export function getBase(): number {
  return BASE;
}

/**
 * Get the index of a specific emoji
 * @param emoji - The emoji to look up
 * @returns The index of the emoji, or -1 if not found
 */
export function getEmojiIndex(emoji: string): number {
  const index = EMOJI_TO_INDEX.get(emoji);
  return index !== undefined ? index : -1;
}
