import { add } from "./add.js";
import compare from "./compare.js";
import { parseStringNumber, addOne, subtractOne } from "./utils";


/**
 * Rounds down to the nearest integer (towards negative infinity)
 * @param num Number as string
 * @returns Floor value as string
 */
export function floor(num: string): string {
  const parsed = parseStringNumber(num);
  
  // If no fractional part, return the number as is
  if (!parsed.fractionalPart || parsed.fractionalPart === "") {
    return parsed.sign === -1 && parsed.integerPart !== "0" ? "-" + parsed.integerPart : parsed.integerPart;
  }
  
  // If positive, just return integer part
  if (parsed.sign === 1) {
    return parsed.integerPart;
  }
  
  // If negative, subtract 1 from integer part
  const decremented = addOne(parsed.integerPart);
  return "-" + decremented;
}

/**
 * Rounds up to the nearest integer (towards positive infinity)
 * @param num Number as string
 * @returns Ceiling value as string
 */
export function ceil(num: string): string {
  const parsed = parseStringNumber(num);
  
  // If no fractional part, return the number as is
  if (!parsed.fractionalPart || parsed.fractionalPart === "") {
    return parsed.sign === -1 && parsed.integerPart !== "0" ? "-" + parsed.integerPart : parsed.integerPart;
  }
  
  // If negative, just return integer part (with sign)
  if (parsed.sign === -1) {
    return "-" + parsed.integerPart;
  }
  
  // If positive, add 1 to integer part
  const incremented = addOne(parsed.integerPart);
  return incremented;
}

/**
 * Removes the fractional part (rounds towards zero)
 * @param num Number as string
 * @returns Truncated value as string
 */
export function truncate(num: string): string {
  const parsed = parseStringNumber(num);
  
  // Return just the integer part with appropriate sign
  if (parsed.sign === -1 && parsed.integerPart !== "0") {
    return "-" + parsed.integerPart;
  }
  
  return parsed.integerPart;
}

/**
 * Rounds to the nearest integer using "round half up" strategy
 * @param num Number as string
 * @returns Rounded value as string
 */
export function round(num: string): string {
  const parsed = parseStringNumber(num);
  
  // If no fractional part, return the number as is
  if (!parsed.fractionalPart || parsed.fractionalPart === "") {
    return parsed.sign === -1 && parsed.integerPart !== "0" ? "-" + parsed.integerPart : parsed.integerPart;
  }
  
  // Check first digit of fractional part for rounding decision
  const firstFracDigit = parsed.fractionalPart[0];
  let firstFracValue = 0;
  
  if (firstFracDigit >= "0" && firstFracDigit <= "9") {
    firstFracValue = firstFracDigit.charCodeAt(0) - "0".charCodeAt(0);
  }
  
  // If first fractional digit is < 5, truncate
  if (firstFracValue < 5) {
    return truncate(num);
  }
  
  // If first fractional digit is >= 5, round up
  if (parsed.sign === 1) {
    // Positive number: add 1 to integer part
    const incremented = addOne(parsed.integerPart);
    return incremented;
  } else {
    // Negative number: subtract 1 from absolute value (making it more negative)
    const incremented = addOne(parsed.integerPart);
    return "-" + incremented;
  }
}

/**
 * Rounds to specified number of decimal places
 * @param num Number as string
 * @param precision Number of decimal places
 * @returns Rounded value as string
 */
export function roundToPrecision(num: string, precision: number): string {
  if (precision < 0) {
    throw new Error("Precision must be non-negative");
  }
  
  const parsed = parseStringNumber(num);
  
  // If no fractional part and precision > 0, add zeros
  if (!parsed.fractionalPart || parsed.fractionalPart === "") {
    if (precision === 0) {
      return parsed.sign === -1 && parsed.integerPart !== "0" ? "-" + parsed.integerPart : parsed.integerPart;
    }
    
    const zeros = "0".repeat(precision);
    const result = parsed.integerPart + "." + zeros;
    return parsed.sign === -1 && parsed.integerPart !== "0" ? "-" + result : result;
  }
  
  // If precision is 0, use regular round function
  if (precision === 0) {
    return round(num);
  }
  
  // If fractional part is shorter than precision, pad with zeros
  if (parsed.fractionalPart.length <= precision) {
    const paddedFrac = parsed.fractionalPart.padEnd(precision, "0");
    const result = parsed.integerPart + "." + paddedFrac;
    return parsed.sign === -1 && parsed.integerPart !== "0" ? "-" + result : result;
  }
  
  // Get the digit at precision position for rounding decision
  const roundingDigit = parsed.fractionalPart[precision];
  let roundingValue = 0;
  
  if (roundingDigit >= "0" && roundingDigit <= "9") {
    roundingValue = roundingDigit.charCodeAt(0) - "0".charCodeAt(0);
  }
  
  // Take the required precision digits
  let resultFrac = parsed.fractionalPart.substring(0, precision);
  let resultInt = parsed.integerPart;
  
  // Round if needed
  if (roundingValue >= 5) {
    // Create a number from integer + fractional parts for rounding
    const combinedNumber = resultInt + resultFrac;
    const incrementedNumber = addOne(combinedNumber);
    
    // Split back into integer and fractional parts
    if (incrementedNumber.length > combinedNumber.length) {
      // Carry occurred, integer part grew
      resultInt = incrementedNumber.substring(0, incrementedNumber.length - precision);
      resultFrac = incrementedNumber.substring(incrementedNumber.length - precision);
    } else {
      resultInt = incrementedNumber.substring(0, incrementedNumber.length - precision);
      resultFrac = incrementedNumber.substring(incrementedNumber.length - precision);
    }
  }
  
  // Remove trailing zeros from fractional part
  resultFrac = resultFrac.replace(/0+$/, "");
  
  // Construct result
  let result = resultInt;
  if (resultFrac !== "") {
    result += "." + resultFrac;
  }
  
  return parsed.sign === -1 && result !== "0" ? "-" + result : result;
}