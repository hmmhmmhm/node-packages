/**
 * Usernamer - Generate memorable usernames from numbers (English)
 * 
 * For Korean, use:
 * - import { encode, decode } from 'usernamer/ko'
 */

import englishLevel1 from '../data/english/level1.json';
import englishLevel2 from '../data/english/level2.json';
import englishLevel3 from '../data/english/level3.json';
import englishLevel4 from '../data/english/level4.json';
import { createEncoder, createDecoder } from './core';

export { getMaxCombinableIndex, requiresSuffix } from './core';

const englishData = {
  level1: englishLevel1,
  level2: englishLevel2,
  level3: englishLevel3,
  level4: englishLevel4,
};

const encoder = createEncoder(englishData, ' ');
const decoder = createDecoder(englishData);

/**
 * Encode a number (0 to 100,000,000+) into a memorable username
 * 
 * @param index - Number to encode (0 to any positive integer)
 * @returns Generated username in English
 * 
 * @example
 * encode(0)        // "alpaca"
 * encode(100)      // "adorable alpaca"
 * encode(10000)    // "wearing hat alpaca"
 * encode(1000000)  // "sunny day alpaca"
 */
export function encode(index: number): string {
  return encoder(index);
}

/**
 * Decode a username back to its original index
 * 
 * @param username - Username to decode (English)
 * @returns Original index number
 * 
 * @example
 * decode("alpaca")                 // 0
 * decode("adorable alpaca")        // 100
 * decode("wearing hat alpaca")    // 10000
 * decode("sunny day alpaca")      // 1000000
 */
export function decode(username: string): number {
  return decoder(username);
}

