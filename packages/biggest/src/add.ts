import { compareAbsolute, parseNumber } from "./utils";

/**
 * Adds two numbers represented as strings.
 * @param left
 * @param right
 * @returns
 */
export function add(left: string, right: string): string {
  // Parse input numbers
  let leftParsed = parseNumber(left);
  let rightParsed = parseNumber(right);

  if (leftParsed.sign === rightParsed.sign) {
    // If signs are the same, perform addition
    let sign = leftParsed.sign;

    // Pad fractional parts to equal length
    let maxFracLen = Math.max(
      leftParsed.fractionalPart.length,
      rightParsed.fractionalPart.length
    );
    leftParsed.fractionalPart = leftParsed.fractionalPart.padEnd(
      maxFracLen,
      "0"
    );
    rightParsed.fractionalPart = rightParsed.fractionalPart.padEnd(
      maxFracLen,
      "0"
    );

    // Pad integer parts to equal length
    let maxIntLen = Math.max(
      leftParsed.integerPart.length,
      rightParsed.integerPart.length
    );
    leftParsed.integerPart = leftParsed.integerPart.padStart(maxIntLen, "0");
    rightParsed.integerPart = rightParsed.integerPart.padStart(maxIntLen, "0");

    // Combine integer and fractional parts
    let leftCombined = leftParsed.integerPart + leftParsed.fractionalPart;
    let rightCombined = rightParsed.integerPart + rightParsed.fractionalPart;

    // Perform digit-by-digit addition
    let result = "";
    let carry = 0;
    for (let i = leftCombined.length - 1; i >= 0; i--) {
      let sum = parseInt(leftCombined[i]) + parseInt(rightCombined[i]) + carry;
      carry = Math.floor(sum / 10);
      result = (sum % 10).toString() + result;
    }
    if (carry > 0) {
      result = carry.toString() + result;
    }

    // Restore decimal point
    if (maxFracLen > 0) {
      let integerResult = result.slice(0, -maxFracLen);
      let fractionalResult = result.slice(-maxFracLen);
      result = integerResult + "." + fractionalResult;
    }

    // Remove unnecessary zeros
    result = result.replace(/^0+(?!\.|$)/, ""); // Remove leading zeros
    result = result.replace(/(\.\d*?)0+$/, "$1"); // Remove trailing zeros in fractional part
    result = result.replace(/\.$/, ""); // Remove decimal point if fractional part is empty

    // Apply sign
    if (sign === -1 && result !== "0") {
      result = "-" + result;
    }

    return result;
  } else {
    // If signs are different, perform subtraction
    let compare = compareAbsolute(leftParsed, rightParsed);
    let sign = compare >= 0 ? leftParsed.sign : rightParsed.sign;

    // Determine which number is larger in absolute value
    let minuend = compare >= 0 ? leftParsed : rightParsed;
    let subtrahend = compare >= 0 ? rightParsed : leftParsed;

    // Pad fractional parts to equal length
    let maxFracLen = Math.max(
      minuend.fractionalPart.length,
      subtrahend.fractionalPart.length
    );
    minuend.fractionalPart = minuend.fractionalPart.padEnd(maxFracLen, "0");
    subtrahend.fractionalPart = subtrahend.fractionalPart.padEnd(
      maxFracLen,
      "0"
    );

    // Pad integer parts to equal length
    let maxIntLen = Math.max(
      minuend.integerPart.length,
      subtrahend.integerPart.length
    );
    minuend.integerPart = minuend.integerPart.padStart(maxIntLen, "0");
    subtrahend.integerPart = subtrahend.integerPart.padStart(maxIntLen, "0");

    // Combine integer and fractional parts
    let minuendCombined = minuend.integerPart + minuend.fractionalPart;
    let subtrahendCombined = subtrahend.integerPart + subtrahend.fractionalPart;

    // Perform digit-by-digit subtraction
    let result = "";
    let borrow = 0;
    for (let i = minuendCombined.length - 1; i >= 0; i--) {
      let diff =
        parseInt(minuendCombined[i]) - parseInt(subtrahendCombined[i]) - borrow;
      if (diff < 0) {
        diff += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }
      result = diff.toString() + result;
    }

    // Restore decimal point
    if (maxFracLen > 0) {
      let integerResult = result.slice(0, -maxFracLen);
      let fractionalResult = result.slice(-maxFracLen);
      result = integerResult + "." + fractionalResult;
    }

    // Remove unnecessary zeros
    result = result.replace(/^0+(?!\.|$)/, ""); // Remove leading zeros
    result = result.replace(/(\.\d*?)0+$/, "$1"); // Remove trailing zeros in fractional part
    result = result.replace(/\.$/, ""); // Remove decimal point if fractional part is empty

    // Handle case where result is zero
    if (result === "") {
      result = "0";
    }

    // Apply sign
    if (sign === -1 && result !== "0") {
      result = "-" + result;
    }

    return result;
  }
}

export default add;
