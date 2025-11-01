import {
  compare,
  multiplyDigit,
  parseNumber,
  removeLeadingZeros,
  removeLeadingZerosFromResult,
  roundResult,
  subtractStrings,
} from "./utils";

export function divide(
  left: string,
  right: string,
  precision: number = 20
): string {
  // Modified long division algorithm
  function longDivision(
    dividend: string,
    divisor: string,
    precision: number
  ): string {
    let result = "";
    let remainder = "";
    let dividendIndex = 0;
    let decimalPointAdded = false;
    let decimalPlaces = 0;

    // Calculate one more digit than the desired precision
    let maxDecimalPlaces = precision + 1;

    while (
      dividendIndex < dividend.length ||
      (decimalPlaces <= maxDecimalPlaces && compare(remainder, "0") !== 0)
    ) {
      if (dividendIndex < dividend.length) {
        remainder += dividend[dividendIndex];
        dividendIndex++;
      } else {
        if (!decimalPointAdded) {
          result += ".";
          decimalPointAdded = true;
        }
        remainder += "0";
      }

      remainder = removeLeadingZeros(remainder);

      let quotientDigit = "0";
      if (compare(remainder, divisor) >= 0) {
        // Find the quotient digit using binary search
        let low = 0;
        let high = 10;
        while (low < high) {
          let mid = Math.floor((low + high) / 2);
          let product = multiplyDigit(divisor, mid.toString());
          if (compare(product, remainder) <= 0) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        quotientDigit = (low - 1).toString();
        let subtractProduct = multiplyDigit(divisor, quotientDigit);
        remainder = subtractStrings(remainder, subtractProduct);
      }

      result += quotientDigit;

      // Increase decimalPlaces after the decimal point is added
      if (decimalPointAdded) {
        decimalPlaces++;
        if (decimalPlaces > maxDecimalPlaces) {
          break;
        }
      }
    }

    // Round the result
    result = roundResult(result, precision);

    return result || "0";
  }

  let num1 = parseNumber(left);
  let num2 = parseNumber(right);

  if (num2.integerPart === "0" && num2.fractionalPart === "") {
    throw new Error("Division by zero");
  }

  // Convert to whole numbers (integer part + fractional part)
  let wholeNum1 = num1.integerPart + num1.fractionalPart;
  let wholeNum2 = num2.integerPart + num2.fractionalPart;

  // Adjust decimal places
  let decimalPlacesNum1 = num1.fractionalPart.length;
  let decimalPlacesNum2 = num2.fractionalPart.length;
  let scale = decimalPlacesNum2 - decimalPlacesNum1;

  if (scale > 0) {
    wholeNum1 = wholeNum1 + "0".repeat(scale);
  } else if (scale < 0) {
    wholeNum2 = wholeNum2 + "0".repeat(-scale);
  }

  // Remove leading zeros
  wholeNum1 = removeLeadingZeros(wholeNum1);
  wholeNum2 = removeLeadingZeros(wholeNum2);

  // Determine the sign of the result
  let resultSign = num1.sign * num2.sign;

  // Perform division
  let quotient = longDivision(wholeNum1, wholeNum2, precision);

  // Remove leading zeros from the integer part of the result
  quotient = removeLeadingZerosFromResult(quotient);

  // Apply the sign to the result
  if (resultSign === -1 && quotient !== "0") {
    quotient = "-" + quotient;
  }

  return quotient;
}

export default divide;
