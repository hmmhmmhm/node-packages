const fs = require('fs');
const path = require('path');

/**
 * 압축된 데이터 파일들로부터 constants.ts 파일을 생성합니다.
 */
function generateConstants() {
  const sourcesDir = path.join(__dirname, '../sources');
  const srcDir = path.join(__dirname, '../src');

  // 압축된 데이터 파일들 읽기
  const charMap = fs.readFileSync(path.join(sourcesDir, 'compress_charmap.txt'), 'utf8').trim();
  const separatorWord = fs.readFileSync(path.join(sourcesDir, 'compress_seperatormap.txt'), 'utf8').trim();
  const table = fs.readFileSync(path.join(sourcesDir, 'compress_table.txt'), 'utf8').trim();
  const fixMap = fs.readFileSync(path.join(sourcesDir, 'compress_fixmap.txt'), 'utf8').trim();

  // constants.ts 파일 내용 생성
  const content = `/**
 * 압축된 글자목록입니다.
 */
export const COMPRESSED_CHAR_MAP = '${charMap}';

/**
 * 압축된 중간자목록입니다.
 */
export const COMPRESSED_SEPARATOR_WORD = '${separatorWord}';

/**
 * 압축된 인코딩 테이블입니다.
 */
export const COMPRESSED_TABLE = '${table}';

/**
 * 압축된 문자보수 테이블입니다.
 */
export const COMPRESSED_FIX_MAP = '${fixMap}';

/**
 * 디버그 모드 플래그
 */
export let isDebug = false;

/**
 * 디버그 모드 설정
 */
export function setDebug(value: boolean): void {
  isDebug = value;
}
`;

  // constants.ts 파일 쓰기
  fs.writeFileSync(path.join(srcDir, 'constants.ts'), content);
  console.log('✓ constants.ts 파일이 성공적으로 생성되었습니다.');
}

// 스크립트 실행
try {
  generateConstants();
} catch (error) {
  console.error('✗ constants.ts 생성 중 오류 발생:', error.message);
  process.exit(1);
}
