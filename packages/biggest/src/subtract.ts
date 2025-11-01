import {
  addAbsolute,
  compareAbsolute,
  parseNumber,
  subtractAbsolute,
} from "./utils";

export function subtract(left: string, right: string): string {
  const num1 = parseNumber(left);
  const num2 = parseNumber(right);

  let resultSign = 1;
  let result = "";

  // If the signs are different, add them
  if (num1.sign !== num2.sign) {
    num2.sign = num1.sign;
    result = addAbsolute(num1, num2);
    resultSign = num1.sign;
  } else {
    // If the signs are the same, subtract them
    let cmp = compareAbsolute(num1, num2);
    if (cmp === 0) {
      return "0";
    } else if (cmp > 0) {
      result = subtractAbsolute(num1, num2);
      resultSign = num1.sign;
    } else {
      result = subtractAbsolute(num2, num1);
      resultSign = -num1.sign;
    }
  }

  if (result === "0") {
    return "0";
  } else {
    return (resultSign === -1 ? "-" : "") + result;
  }
}

export default subtract;
