import * as LZString from 'lz-string';
import {
  COMPRESSED_CHAR_MAP,
  COMPRESSED_SEPARATOR_WORD,
  COMPRESSED_TABLE,
  COMPRESSED_FIX_MAP,
} from './constants.js';

/**
 * 필터링 되지 않은 98가지 글자 목록이 여기에 담깁니다.
 */
export let nonFilteredCharMap: string[] = [];

/**
 * 인코딩 테이블이 여기에 담깁니다.
 */
export let encodeTable: string[] = [];

/**
 * 오타 정정을 위한 문자보수 테이블이 여기에 담깁니다.
 */
export let charFixMap: Record<string, string[]> = {};

/**
 * 단어로 구성된 중간자가 여기에 담깁니다.
 */
export let separatorWord: string[] = [];

/**
 * 압축된 글자목록을 불러옵니다.
 */
function loadCharMap(): void {
  const parsedCharMap = LZString.decompressFromEncodedURIComponent(COMPRESSED_CHAR_MAP);
  if (parsedCharMap) {
    nonFilteredCharMap = parsedCharMap.split('');
  }
}

/**
 * 압축된 중간자목록을 불러옵니다.
 */
function loadSeparatorWord(): void {
  const parsedSeparatorWord = LZString.decompressFromEncodedURIComponent(COMPRESSED_SEPARATOR_WORD);
  if (parsedSeparatorWord) {
    let pairSeparatorGroup = '';
    for (let i = 0; i < parsedSeparatorWord.length; i++) {
      pairSeparatorGroup += parsedSeparatorWord[i];
      if (pairSeparatorGroup.length === 2) {
        separatorWord.push(pairSeparatorGroup);
        pairSeparatorGroup = '';
      }
    }
  }
}

/**
 * 압축된 인코딩테이블을 불러옵니다.
 */
function loadEncodeTable(): void {
  const parsedTable = LZString.decompressFromEncodedURIComponent(COMPRESSED_TABLE);
  if (parsedTable) {
    let pairGroup = '';
    for (let i = 0; i < parsedTable.length; i++) {
      pairGroup += parsedTable[i];
      if (pairGroup.length === 2) {
        encodeTable.push(pairGroup);
        pairGroup = '';
      }
    }
  }
}

/**
 * 압축된 문자보수 테이블을 불러옵니다.
 */
function loadCharFixMap(): void {
  const parsedFixMap = LZString.decompressFromEncodedURIComponent(COMPRESSED_FIX_MAP);
  if (parsedFixMap) {
    charFixMap = JSON.parse(parsedFixMap);
  }
}

/**
 * 모든 데이터를 초기화합니다.
 */
export function initializeData(): void {
  loadCharMap();
  loadSeparatorWord();
  loadEncodeTable();
  loadCharFixMap();
}

// 모듈 로드 시 자동으로 데이터를 초기화합니다.
initializeData();
