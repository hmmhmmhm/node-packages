/**
 * 복합 다진수를 10진수로 변환합니다.
 */
export function decimalBase(maxMatrix: number[], indexMatrix: number[]): number {
  let indexDecimal = 0;
  for (let i = indexMatrix.length - 1; i >= 0; i--) {
    let tempIndex = Number(indexMatrix[i]);
    for (let m = i + 1; m < indexMatrix.length; m++) {
      tempIndex *= Number(maxMatrix[m]);
    }
    indexDecimal += tempIndex;
  }
  return indexDecimal;
}

/**
 * 10진수를 복합 다진수로 변환합니다.
 */
export function multipleBase(maxMatrix: number[], indexDecimal: number): number[] {
  let temp = Number(indexDecimal);
  const result: number[] = [];
  for (let i = maxMatrix.length - 1; i >= 0; i--) {
    const up = Math.floor(temp / maxMatrix[i]);
    const down = temp - maxMatrix[i] * up;
    temp = up;
    result.push(down);
  }
  if (temp !== 0) result.push(temp);
  result.reverse();
  return result;
}

/**
 * 주어진 인덱스에 대해 예상되는 인코딩 길이를 계산합니다.
 */
export function expectLength(index: number): number {
  let maxLength = 1;
  for (;;) {
    const fullCase = Math.pow(72, maxLength);
    if (index + 1 <= fullCase) break;
    maxLength++;
  }
  return maxLength;
}
