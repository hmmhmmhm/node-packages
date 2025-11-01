import { parseNumber, removeLeadingZeros, removeTrailingZeros } from "./utils";

/**
 * Multiplies two numbers represented as strings.
 * @param left
 * @param right
 * @returns
 */
export function multiply(left: string, right: string): string {
  let num1 = parseNumber(left);
  let num2 = parseNumber(right);

  // Calculate total decimal places
  let totalDecimalPlaces =
    num1.fractionalPart.length + num2.fractionalPart.length;

  // Combine integer and fractional parts to convert to whole numbers
  let wholeNum1 = num1.integerPart + num1.fractionalPart;
  let wholeNum2 = num2.integerPart + num2.fractionalPart;

  // Remove leading zeros
  wholeNum1 = removeLeadingZeros(wholeNum1);
  wholeNum2 = removeLeadingZeros(wholeNum2);

  // If either number is 0, the result is 0
  if (wholeNum1 === "0" || wholeNum2 === "0") {
    return "0";
  }

  // Initialize array to store the result
  let result = Array(wholeNum1.length + wholeNum2.length).fill(0);

  // Perform multiplication (as if calculating by hand)
  for (let i = wholeNum1.length - 1; i >= 0; i--) {
    for (let j = wholeNum2.length - 1; j >= 0; j--) {
      let mul = parseInt(wholeNum1[i]) * parseInt(wholeNum2[j]);
      let p1 = i + j;
      let p2 = i + j + 1;
      let sum = mul + result[p2];

      result[p2] = sum % 10;
      result[p1] += Math.floor(sum / 10);
    }
  }

  // Convert result array to string
  let resultStr = result.join("");

  // Remove leading zeros
  resultStr = removeLeadingZeros(resultStr);

  // Adjust decimal point position
  if (totalDecimalPlaces > 0) {
    // Add leading '0' if result string is shorter than total decimal places
    if (resultStr.length <= totalDecimalPlaces) {
      resultStr = resultStr.padStart(totalDecimalPlaces + 1, "0");
    }

    let integerPart = resultStr.slice(0, -totalDecimalPlaces);
    let fractionalPart = resultStr.slice(-totalDecimalPlaces);

    // Remove trailing zeros
    fractionalPart = removeTrailingZeros(fractionalPart);

    if (fractionalPart !== "0") {
      resultStr = integerPart + "." + fractionalPart;
    } else {
      resultStr = integerPart;
    }
  }

  // Determine the sign of the result
  let resultSign = num1.sign * num2.sign;

  if (resultSign === -1 && resultStr !== "0") {
    resultStr = "-" + resultStr;
  }

  return resultStr;
}

export default multiply;
