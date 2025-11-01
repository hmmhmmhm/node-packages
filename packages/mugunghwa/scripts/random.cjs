#!/usr/bin/env node
const { encode } = require('../dist/index.cjs');

/**
 * 숫자에 단위를 추가하는 함수
 */
function formatNumber(num) {
  const str = String(num);
  let result = str;
  
  if (str.length > 4) {
    const manIndex = str.length - 4;
    result = str.slice(0, manIndex) + '만' + str.slice(manIndex);
  }
  
  if (str.length > 8) {
    const eokIndex = result.indexOf('만') - 4;
    if (eokIndex > 0) {
      result = result.slice(0, eokIndex) + '억' + result.slice(eokIndex);
    }
  }
  
  if (str.length > 12) {
    const joIndex = result.indexOf('억') - 4;
    if (joIndex > 0) {
      result = result.slice(0, joIndex) + '조' + result.slice(joIndex);
    }
  }
  
  return result;
}

/**
 * 랜덤 인코딩 생성
 */
function randomEncode(min = 1, max = 100000000) {
  const index = Math.floor(Math.random() * (max - min)) + min;
  const code = encode(index);
  
  console.log(`${code} (${formatNumber(index)})`);
}

// 기본값: 10개의 랜덤 코드 생성
const count = parseInt(process.argv[2], 10) || 10;
const min = parseInt(process.argv[3], 10) || 26873855;
const max = parseInt(process.argv[4], 10) || 1934917631;

console.log(`Generating ${count} random codes between ${formatNumber(min)} and ${formatNumber(max)}:\n`);

for (let i = 1; i <= count; i++) {
  randomEncode(min, max);
}
