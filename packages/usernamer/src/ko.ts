/**
 * Korean-only entry point for better tree-shaking
 */

import koreanLevel1 from '../data/korean/level1.json';
import koreanLevel2 from '../data/korean/level2.json';
import koreanLevel3 from '../data/korean/level3.json';
import koreanLevel4 from '../data/korean/level4.json';
import { createEncoder, createDecoder, getMaxCombinableIndex, requiresSuffix } from './core';

const koreanData = {
  level1: koreanLevel1,
  level2: koreanLevel2,
  level3: koreanLevel3,
  level4: koreanLevel4,
};

/**
 * Encode a number to a Korean username
 */
export const encode = createEncoder(koreanData, ' ');

/**
 * Decode a Korean username back to a number
 */
export const decode = createDecoder(koreanData);

export { getMaxCombinableIndex, requiresSuffix };
