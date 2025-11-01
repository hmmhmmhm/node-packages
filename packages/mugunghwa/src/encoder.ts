import { nonFilteredCharMap, encodeTable } from './data-loader.js';
import { multipleBase, decimalBase, expectLength } from './base-converter.js';

/**
 * 순서 값을 글자로 인코딩합니다.
 */
export function encode(index: number, separator: string = '-'): string | null {
  // 숫자가 아닌지 여부를 확인합니다.
  // (음수와 소수점 숫자 또한 거부합니다.)
  if (
    index === null ||
    index === undefined ||
    isNaN(index) ||
    index < 0 ||
    index % 1 !== 0
  ) {
    return null;
  }

  // 인코딩 되는 글자길이 확인
  const maxLength = expectLength(index);

  // 고정범위 배열 생성
  const max: number[] = [];
  for (let i = 0; i < maxLength; i++) {
    max.push(72);
  }

  // 10진수를 다진수 배열로 변환
  const matrix = multipleBase(max, index);

  let pairEncodedWord = '';

  // 인코딩 시작
  if (max.length === 1) {
    // 인코딩 되는 자릿수가 1개일땐 72진법 그대로 적용
    pairEncodedWord += nonFilteredCharMap[matrix[0]];
  } else {
    // 2개씩 모아서 10진화 한 후 인코딩 적용
    const pairGroupLength = maxLength - (maxLength % 2);
    let pairGroup: number[] = [];
    for (let i = 0; i < pairGroupLength; i++) {
      pairGroup.push(matrix[i]);
      if (pairGroup.length === 2) {
        const pairIndex = decimalBase([72, 72], pairGroup);

        // 오버플로우가 발생하면 null 처리
        if (typeof encodeTable[pairIndex] === 'undefined') {
          return null;
        }
        pairEncodedWord += encodeTable[pairIndex];
        pairGroup = [];
      }
    }

    // 마지막 하나가 남으면 남은 수는 72진법 그대로 적용
    if (maxLength % 2 === 1) {
      const lastOne = matrix[matrix.length - 1];
      if (typeof nonFilteredCharMap[lastOne] === 'undefined') {
        return null;
      }
      pairEncodedWord += nonFilteredCharMap[lastOne];
    }
  }

  // 코드를 쪼갠 후 구분자를 붙입니다.
  const code: string[] = [];
  for (let i = 0; i <= pairEncodedWord.length - 1; i++) {
    code.push(pairEncodedWord[i]);
    if (pairEncodedWord.length - 1 !== i && (i + 1) % 2 === 0) {
      code.push(separator);
    }
  }
  return code.join('');
}
