import { addStrings } from "./utils";

/**
 * Function to remove leading zeros from the result
 * @param str
 * @returns
 */
export function removeLeadingZerosFromResult(str: string): string {
  if (str[0] === "-") {
    return "-" + removeLeadingZerosFromResult(str.slice(1));
  }
  let [integerPart, fractionalPart] = str.split(".");
  integerPart = integerPart.replace(/^0+/, "") || "0";
  if (fractionalPart !== undefined) {
    return integerPart + "." + fractionalPart;
  } else {
    return integerPart;
  }
}

/**
 * Rounds the result to the specified precision
 * @param result
 * @param precision
 * @returns
 */
export function roundResult(result: string, precision: number): string {
  let [integerPart, fractionalPart] = result.split(".");
  if (!fractionalPart) {
    return result;
  }

  // Check if there are additional digits
  if (fractionalPart.length <= precision) {
    fractionalPart = fractionalPart.padEnd(precision + 1, "0");
  }

  // Get the digit to be rounded
  let roundingDigit = parseInt(fractionalPart[precision]);

  let fractionToRound = fractionalPart.slice(0, precision);

  if (roundingDigit >= 5) {
    // Combine integer and fractional parts to create a large number
    let combinedNumber = integerPart + fractionToRound;

    // Add 1
    let incrementedNumber = addStrings(combinedNumber, "1");

    // Separate into new integer and fractional parts
    let combinedLength = integerPart.length + fractionToRound.length;
    let incrementedLength = incrementedNumber.length;
    let lengthDifference = incrementedLength - combinedLength;
    let newIntegerPartLength = integerPart.length + lengthDifference;

    let newIntegerPart = incrementedNumber.slice(0, newIntegerPartLength);
    let newFractionalPart = incrementedNumber.slice(newIntegerPartLength);

    result = newIntegerPart;
    if (newFractionalPart) {
      result += "." + newFractionalPart;
    }
  } else {
    // No rounding needed
    result = integerPart;
    if (fractionToRound) {
      result += "." + fractionToRound;
    }
  }

  // Remove unnecessary trailing zeros in the fractional part
  result = result.replace(/(\.\d*?[1-9])0+$/g, "$1");
  result = result.replace(/\.0+$/, "");
  result = result.replace(/\.$/, "");

  return result;
}
