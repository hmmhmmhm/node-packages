/**
 * Core encoding/decoding logic without language data
 */

export type Language = 'korean' | 'english';

export interface LevelData {
  level1: string[];
  level2: string[];
  level3: string[];
  level4: string[];
}

// Constants
const ITEMS_PER_LEVEL = 100;
const MAX_COMBINABLE_INDEX = ITEMS_PER_LEVEL ** 4; // 100,000,000 (1억)

/**
 * Validate language data structure
 */
function validateData(data: LevelData): void {
  const levels = [data.level1, data.level2, data.level3, data.level4];
  
  for (let i = 0; i < levels.length; i++) {
    if (!Array.isArray(levels[i]) || levels[i].length !== ITEMS_PER_LEVEL) {
      throw new Error(`Invalid data: level${i + 1} must have exactly ${ITEMS_PER_LEVEL} items`);
    }
  }
}

/**
 * Create encode function for specific language data
 */
export function createEncoder(data: LevelData, separator: string = ' ') {
  validateData(data);
  
  return function encode(index: number): string {
    // Validate input
    if (!Number.isInteger(index) || index < 0) {
      throw new Error('Index must be a non-negative integer');
    }

    // Handle overflow (index >= 100,000,000)
    // Use mixed base system: base-100 for first 4 levels, then base-10 for 5th level
    // Example: 123,456,789 = encode(12,345,678) + " 9"
    let suffix = '';
    if (index >= MAX_COMBINABLE_INDEX) {
      const lastDigit = index % 10;
      suffix = ` ${lastDigit}`;
      index = Math.floor(index / 10);
    }

    // Decompose index into base-100 digits
    // index = d4 * 100^3 + d3 * 100^2 + d2 * 100 + d1
    const d1 = index % ITEMS_PER_LEVEL;
    const d2 = Math.floor(index / ITEMS_PER_LEVEL) % ITEMS_PER_LEVEL;
    const d3 = Math.floor(index / (ITEMS_PER_LEVEL ** 2)) % ITEMS_PER_LEVEL;
    const d4 = Math.floor(index / (ITEMS_PER_LEVEL ** 3)) % ITEMS_PER_LEVEL;

    const parts: string[] = [];

    // Build username from level4 to level1
    // Format: "level4 level3 level2 level1"
    // Only include levels that have non-zero values
    if (d4 > 0) {
      parts.push(data.level4[d4 - 1]);
    }
    if (d3 > 0) {
      parts.push(data.level3[d3 - 1]);
    }
    if (d2 > 0) {
      parts.push(data.level2[d2 - 1]);
    }
    
    parts.push(data.level1[d1]);

    return parts.join(separator) + suffix;
  };
}

/**
 * Create decode function for specific language data
 */
export function createDecoder(data: LevelData) {
  validateData(data);
  
  return function decode(username: string): number {
    if (!username || username.trim() === '') {
      throw new Error('Username cannot be empty');
    }

    const normalized = username.trim();

    // Check for numeric suffix (overflow handling)
    const suffixMatch = normalized.match(/\s+(\d+)$/);
    let overflowNumber = 0;
    let usernameWithoutSuffix = normalized;

    if (suffixMatch) {
      overflowNumber = parseInt(suffixMatch[1], 10);
      usernameWithoutSuffix = normalized.substring(0, normalized.length - suffixMatch[0].length);
    }

    // Create reverse lookup maps
    // level1: stores array index (0-99)
    // level2/3/4: stores digit value (1-100), since we only include them when d > 0
    const level1Map = new Map(data.level1.map((word: string, idx: number) => [word, idx]));
    const level2Map = new Map(data.level2.map((word: string, idx: number) => [word, idx + 1]));
    const level3Map = new Map(data.level3.map((word: string, idx: number) => [word, idx + 1]));
    const level4Map = new Map(data.level4.map((word: string, idx: number) => [word, idx + 1]));

    // Parse username by trying to match words from each level
    // We need to handle the fact that words can contain spaces
    let remaining = usernameWithoutSuffix;
    let d1 = 0, d2 = 0, d3 = 0, d4 = 0;

    // Try to match level4 first (longest prefix)
    let matched = false;
    for (const [word, value] of level4Map.entries()) {
      if (remaining.startsWith(word)) {
        d4 = value;
        remaining = remaining.substring(word.length).trim();
        matched = true;
        break;
      }
    }

    // Try to match level3
    matched = false;
    for (const [word, value] of level3Map.entries()) {
      if (remaining.startsWith(word)) {
        d3 = value;
        remaining = remaining.substring(word.length).trim();
        matched = true;
        break;
      }
    }

    // Try to match level2
    matched = false;
    for (const [word, value] of level2Map.entries()) {
      if (remaining.startsWith(word)) {
        d2 = value;
        remaining = remaining.substring(word.length).trim();
        matched = true;
        break;
      }
    }

    // Match level1 (required)
    matched = false;
    for (const [word, value] of level1Map.entries()) {
      if (remaining === word) {
        d1 = value;
        matched = true;
        break;
      }
    }

    if (!matched) {
      throw new Error(`Invalid username: could not parse "${username}"`);
    }

    // Reconstruct index
    const baseIndex = d4 * (ITEMS_PER_LEVEL ** 3) + d3 * (ITEMS_PER_LEVEL ** 2) + d2 * ITEMS_PER_LEVEL + d1;

    // Handle overflow with mixed base system
    // If suffix exists, the original index was: (baseIndex * 10) + suffix
    if (suffixMatch) {
      return baseIndex * 10 + overflowNumber;
    }

    return baseIndex;
  };
}

/**
 * Get the maximum index that can be encoded without numeric suffix
 */
export function getMaxCombinableIndex(): number {
  return MAX_COMBINABLE_INDEX;
}

/**
 * Check if an index requires a numeric suffix
 */
export function requiresSuffix(index: number): boolean {
  return index >= MAX_COMBINABLE_INDEX;
}
