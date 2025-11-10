import emojis from '../emoji.json';

/**
 * Base2000 encoder/decoder using emojis
 * Converts numbers to/from base-N representation using colorful emojis.
 */
const EMOJIS: string[] = emojis;
const BASE = EMOJIS.length; // Dynamically set based on emoji count

// Create reverse lookup map for decoding
const EMOJI_TO_INDEX = new Map<string, number>();
EMOJIS.forEach((emoji, index) => {
  EMOJI_TO_INDEX.set(emoji, index);
});

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
    return EMOJIS[0];
  }

  const result: string[] = [];

  while (n > 0n) {
    const remainder = Number(n % BigInt(BASE));
    result.unshift(EMOJIS[remainder]);
    n = n / BigInt(BASE);
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
