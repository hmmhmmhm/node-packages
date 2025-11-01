import { isDebug } from './constants.js';
import {
  nonFilteredCharMap,
  encodeTable,
  charFixMap,
  separatorWord,
} from './data-loader.js';
import { multipleBase, decimalBase } from './base-converter.js';

/**
 * 글자를 순서 값으로 디코딩합니다.
 */
export function decode(code: string, separator: string = '-'): number | null {
  if (code === undefined || code === null || String(code).length === 0) {
    return null;
  }

  // 구분자와 공백을 제거한 후 배열화 합니다.
  let decodedCode = String(code)
    .split(separator)
    .join('')
    .split(' ')
    .join('')
    .split('');

  let isWrongTypeExist: string | null = null;

  // 두글자 단위로 단위/대시라는 구분자 표현이
  // 포함되어 있는지 확인 후 있다면 삭제합니다.
  let separatorDecodedCode = '';
  let pairGroup = '';
  const pairLength = decodedCode.length - (decodedCode.length % 2 === 1 ? 1 : 0);
  for (let i = 0; i <= pairLength - 1; i++) {
    pairGroup += decodedCode[i];
    if (pairGroup.length === 2) {
      const pairGroupStr = String(pairGroup);
      if (separatorWord.indexOf(pairGroupStr) !== -1) {
        pairGroup = '';
        continue;
      }
      separatorDecodedCode += pairGroup;
      pairGroup = '';
    }
  }
  // 마지막 남은 수의 72진법을 추가합니다.
  if (decodedCode.length % 2 === 1) {
    const lastOne = decodedCode[decodedCode.length - 1];
    separatorDecodedCode += lastOne;
  }

  // 구분자를 삭제한 코드를 반영합니다.
  decodedCode = separatorDecodedCode.split('');

  // 잘못 입력된 오탈자가 있는지 검사합니다.
  for (let n = 0; n <= decodedCode.length - 1; n++) {
    // 잘못된 오탈자가 존재하면 해당 글자의 수정을 시도합니다.
    if (nonFilteredCharMap.indexOf(decodedCode[n]) === -1) {
      isWrongTypeExist = decodedCode[n];

      // 오탈자 수정 목록을 선회합니다.
      for (const charFixMapIndex of Object.keys(charFixMap)) {
        // 수정가능한 글자가 있는지 확인합니다.
        let fixableType: string | null = null;
        for (const charFixMapValue of charFixMap[charFixMapIndex]) {
          if (charFixMapValue === decodedCode[n]) {
            fixableType = charFixMapIndex;
            break;
          }
        }

        // 수정가능한 글자가 있다면
        // 수정한 후 다음 글자를 검사합니다.
        if (fixableType !== null) {
          isWrongTypeExist = null;
          decodedCode[n] = fixableType;
          break;
        }
      }
    }
  }

  if (isWrongTypeExist !== null) {
    // 디버깅 모드가 아니라면 그냥 null을 반환시킵니다.
    if (!isDebug) return null;

    // 수정 불가능한 오탈자가 존재하면 오류를 발생시킵니다.
    throw new Error(
      `Unrecognized code: ${code}\nWrong Typo: ${isWrongTypeExist}`
    );
  }

  // 해석된 72진법 배열이 여기에 담깁니다.
  let decodedMatrix: number[] = [];

  // 짝수단위 인코딩을 해석합니다.
  pairGroup = '';
  const pairLength2 = decodedCode.length - (decodedCode.length % 2 === 1 ? 1 : 0);
  for (let i = 0; i <= pairLength2 - 1; i++) {
    pairGroup += decodedCode[i];
    if (pairGroup.length === 2) {
      const pairIndex = encodeTable.indexOf(pairGroup);

      // 84진법 사전에서 확인되지 않는 단어가 발견될 시
      // 인식할 수 없는 코드로 간주해서 오류를 발생시킵니다.
      if (pairIndex === -1) {
        // 디버깅 모드가 아니라면 그냥 null을 반환시킵니다.
        if (!isDebug) return null;

        throw new Error(
          `Unrecognized code: ${code}\nWrong Format: ${pairGroup}`
        );
      }

      const pairMatrix = multipleBase([72, 72], pairIndex);

      decodedMatrix = decodedMatrix.concat(pairMatrix);
      pairGroup = '';
    }
  }

  // 마지막 남은 수의 72진법을 해석합니다.
  if (decodedCode.length % 2 === 1) {
    const lastOne = [
      nonFilteredCharMap.indexOf(decodedCode[decodedCode.length - 1]),
    ];
    decodedMatrix = decodedMatrix.concat(lastOne);
  }

  // 최대 값 범위 배열을 생성합니다.
  const max: number[] = [];
  for (let i = 0; i <= decodedMatrix.length - 1; i++) {
    max.push(72);
  }

  // 10진수 색인번호로 변환합니다.
  const decodedIndex = decimalBase(max, decodedMatrix);

  return decodedIndex;
}
