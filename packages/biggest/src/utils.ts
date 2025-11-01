/**
 * Function to parse a number into sign, integer part, and fractional part
 * @param num
 * @returns
 */
export function parseNumber(num: string) {
  if (typeof num !== "number") num = num.toString();

  let sign = 1;
  if (num.startsWith("-")) {
    sign = -1;
    num = num.substring(1);
  }
  let [integerPart, fractionalPart] = num.split(".");
  if (!fractionalPart) fractionalPart = "";
  return {
    sign,
    integerPart,
    fractionalPart,
  };
}

/**
 * Enhanced number parsing that handles edge cases and normalizes zero
 * @param num Number as string
 * @returns Object with sign, integer part, and fractional part
 */
export function parseStringNumber(num: string) {
  if (typeof num !== "string") {
    num = String(num);
  }

  let sign = 1;
  if (num.startsWith("-")) {
    sign = -1;
    num = num.substring(1);
  } else if (num.startsWith("+")) {
    num = num.substring(1);
  }

  if (!num || num === "") {
    return { sign: 1, integerPart: "0", fractionalPart: "" };
  }

  let [integerPart, fractionalPart] = num.split(".");
  if (!integerPart) integerPart = "0";
  if (!fractionalPart) fractionalPart = "";

  integerPart = integerPart.replace(/^0+/, "") || "0";
  
  if (integerPart === "0" && (!fractionalPart || fractionalPart.replace(/0/g, "") === "")) {
    sign = 1;
  }

  return {
    sign,
    integerPart,
    fractionalPart,
  };
}

/**
 * Checks if a number is an integer
 * @param num Number as string
 * @returns true if integer, false otherwise
 */
export function isInteger(num: string): boolean {
  const parsed = parseStringNumber(num);
  return !parsed.fractionalPart || parsed.fractionalPart === "";
}

/**
 * Checks if a number is zero
 * @param num Number as string
 * @returns true if zero, false otherwise
 */
export function isZero(num: string): boolean {
  const parsed = parseStringNumber(num);
  return parsed.integerPart === "0" && (!parsed.fractionalPart || parsed.fractionalPart.replace(/0/g, "") === "");
}

/**
 * Adds 1 to a positive integer string
 * @param num Positive integer as string
 * @returns Result as string
 */
export function addOne(num: string): string {
  let result = "";
  let carry = 1;
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = num[i];
    let digitValue = 0;
    
    if (digit >= "0" && digit <= "9") {
      digitValue = digit.charCodeAt(0) - "0".charCodeAt(0);
    }
    
    let sum = digitValue + carry;
    result = String(sum % 10) + result;
    carry = sum >= 10 ? 1 : 0;
  }
  
  if (carry > 0) {
    result = "1" + result;
  }
  
  return result;
}

/**
 * Subtracts 1 from a positive integer string (assuming num > 0)
 * @param num Positive integer as string
 * @returns Result as string
 */
export function subtractOne(num: string): string {
  if (num === "0") return "0";
  
  let result = "";
  let borrow = 1;
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = num[i];
    let digitValue = 0;
    
    if (digit >= "0" && digit <= "9") {
      digitValue = digit.charCodeAt(0) - "0".charCodeAt(0);
    }
    
    let diff = digitValue - borrow;
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    
    result = String(diff) + result;
  }
  
  result = result.replace(/^0+/, "") || "0";
  
  return result;
}

/**
 * Function to compare absolute values of two parsed numbers
 * @param a
 * @param b
 * @returns
 */
export function compareAbsolute(a: any, b: any): number {
  // Pad integer parts to equal length
  const maxIntLen = Math.max(a.integerPart.length, b.integerPart.length);
  const intA = a.integerPart.padStart(maxIntLen, "0");
  const intB = b.integerPart.padStart(maxIntLen, "0");

  // Compare integer parts
  if (intA > intB) return 1;
  if (intA < intB) return -1;

  // If integer parts are equal, compare fractional parts
  const maxFracLen = Math.max(a.fractionalPart.length, b.fractionalPart.length);
  const fracA = a.fractionalPart.padEnd(maxFracLen, "0");
  const fracB = b.fractionalPart.padEnd(maxFracLen, "0");

  if (fracA > fracB) return 1;
  if (fracA < fracB) return -1;

  // Numbers are equal
  return 0;
}

/**
 * Function to add two numbers based on absolute values
 * @param num1
 * @param num2
 * @returns
 */
export function addAbsolute(num1: any, num2: any): string {
  const maxFractionLength = Math.max(
    num1.fractionalPart.length,
    num2.fractionalPart.length
  );
  const frac1 = num1.fractionalPart.padEnd(maxFractionLength, "0");
  const frac2 = num2.fractionalPart.padEnd(maxFractionLength, "0");

  let fractionalSum = "";
  let carry = 0;
  for (let i = maxFractionLength - 1; i >= 0; i--) {
    let sum = parseInt(frac1[i] || "0") + parseInt(frac2[i] || "0") + carry;
    fractionalSum = (sum % 10) + fractionalSum;
    carry = Math.floor(sum / 10);
  }

  const int1 = num1.integerPart;
  const int2 = num2.integerPart;

  let integerSum = "";
  let i = int1.length - 1;
  let j = int2.length - 1;
  while (i >= 0 || j >= 0 || carry > 0) {
    const digit1 = i >= 0 ? parseInt(int1[i]) : 0;
    const digit2 = j >= 0 ? parseInt(int2[j]) : 0;
    const sum = digit1 + digit2 + carry;
    integerSum = (sum % 10) + integerSum;
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }

  let result = integerSum;
  fractionalSum = fractionalSum.replace(/0+$/, "");
  if (fractionalSum) {
    result += "." + fractionalSum;
  }

  return result;
}

/**
 * Function to subtract two numbers based on absolute values (assuming num1 >= num2)
 * @param num1
 * @param num2
 * @returns
 */
export function subtractAbsolute(num1: any, num2: any): string {
  let maxFractionLength = Math.max(
    num1.fractionalPart.length,
    num2.fractionalPart.length
  );
  const frac1 = num1.fractionalPart.padEnd(maxFractionLength, "0");
  const frac2 = num2.fractionalPart.padEnd(maxFractionLength, "0");

  let fractionalDiff = "";
  let borrow = 0;
  for (let i = maxFractionLength - 1; i >= 0; i--) {
    let digit1 = parseInt(frac1[i]) - borrow;
    let digit2 = parseInt(frac2[i]);
    if (digit1 < digit2) {
      digit1 += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    let diff = digit1 - digit2;
    fractionalDiff = diff + fractionalDiff;
  }

  let int1 = num1.integerPart;
  let int2 = num2.integerPart.padStart(int1.length, "0");

  let integerDiff = "";
  for (let i = int1.length - 1; i >= 0; i--) {
    let digit1 = parseInt(int1[i]) - borrow;
    let digit2 = parseInt(int2[i]);
    if (digit1 < digit2) {
      digit1 += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    let diff = digit1 - digit2;
    integerDiff = diff + integerDiff;
  }

  integerDiff = integerDiff.replace(/^0+/, "") || "0";
  fractionalDiff = fractionalDiff.replace(/0+$/, "");

  let result = integerDiff;
  if (fractionalDiff) {
    result += "." + fractionalDiff;
  }

  return result;
}

/**
 * Function to remove leading zeros
 * @param str
 * @returns
 */
export function removeLeadingZeros(str: string): string {
  return str.replace(/^0+/, "") || "0";
}

/**
 * Function to remove trailing zeros
 * @param str
 * @returns
 */
export function removeTrailingZeros(str: string): string {
  return str.replace(/0+$/, "") || "0";
}

/**
 * Function to subtract two numbers (num1 - num2, assuming num1 >= num2)
 * @param num1
 * @param num2
 * @returns
 */
export function subtractStrings(num1: string, num2: string): string {
  let result = "";
  let borrow = 0;
  num1 = num1.split("").reverse().join("");
  num2 = num2.split("").reverse().join("");

  for (let i = 0; i < num1.length; i++) {
    let digit1 = parseInt(num1[i]) - borrow;
    let digit2 = parseInt(num2[i] || "0");
    if (digit1 < digit2) {
      digit1 += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    result = digit1 - digit2 + result;
  }

  return removeLeadingZeros(result);
}

/**
 * Function to multiply a number by a single digit
 * @param num
 * @param digit
 * @returns
 */
export function multiplyDigit(num: string, digit: string): string {
  let result = "";
  let carry = 0;
  let digitNum = parseInt(digit);
  let numArray = num.split("").reverse();

  for (let i = 0; i < numArray.length; i++) {
    let product = parseInt(numArray[i]) * digitNum + carry;
    result = (product % 10) + result;
    carry = Math.floor(product / 10);
  }

  if (carry > 0) {
    result = carry + result;
  }

  return result;
}

/**
 * Function to compare two numbers
 * @param num1
 * @param num2
 * @returns 1 if num1 > num2, -1 if num1 < num2, 0 if num1 == num2
 */
export function compare(num1: string, num2: string): number {
  num1 = removeLeadingZeros(num1);
  num2 = removeLeadingZeros(num2);
  if (num1.length > num2.length) return 1;
  if (num1.length < num2.length) return -1;
  for (let i = 0; i < num1.length; i++) {
    if (num1[i] > num2[i]) return 1;
    if (num1[i] < num2[i]) return -1;
  }
  return 0;
}

/**
 * Function to add two numbers
 * @param num1
 * @param num2
 * @returns sum of num1 and num2
 */
export function addStrings(num1: string, num2: string): string {
  let result = "";
  let carry = 0;
  let num1Arr = num1.split("").reverse();
  let num2Arr = num2.split("").reverse();

  let maxLength = Math.max(num1Arr.length, num2Arr.length);
  for (let i = 0; i < maxLength; i++) {
    let digit1 = parseInt(num1Arr[i] || "0");
    let digit2 = parseInt(num2Arr[i] || "0");
    let sum = digit1 + digit2 + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
  }
  if (carry > 0) {
    result = carry + result;
  }
  return result;
}

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
