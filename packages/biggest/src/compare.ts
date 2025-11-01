import { parseStringNumber } from "./utils";

/**
 * Compares two numbers represented as strings
 * @param a First number as string
 * @param b Second number as string
 * @returns 1 if a > b, -1 if a < b, 0 if a == b
 */
export default function compare(a: string, b: string): number {
  // Handle empty or invalid inputs
  if (a === undefined || a === null || b === undefined || b === null) {
    throw new Error("Invalid input: both numbers must be provided");
  }

  // Parse both numbers
  const numA = parseStringNumber(a);
  const numB = parseStringNumber(b);

  // Handle sign comparison first
  if (numA.sign !== numB.sign) {
    return numA.sign > numB.sign ? 1 : -1;
  }

  // Both numbers have the same sign, compare absolute values
  const absCompare = compareAbsoluteValues(numA, numB);
  
  // If both negative, invert the result
  const result = numA.sign === -1 ? -absCompare : absCompare;
  
  // Ensure we return 0 instead of -0
  return result === 0 ? 0 : result;
}

/**
 * Compares absolute values of two parsed numbers
 * @param a Parsed number A
 * @param b Parsed number B
 * @returns 1 if |a| > |b|, -1 if |a| < |b|, 0 if |a| == |b|
 */
function compareAbsoluteValues(a: any, b: any): number {
  // Compare integer part lengths first
  const intLenA = a.integerPart.length;
  const intLenB = b.integerPart.length;
  
  if (intLenA > intLenB) return 1;
  if (intLenA < intLenB) return -1;

  // Integer parts have same length, compare digit by digit
  for (let i = 0; i < intLenA; i++) {
    const digitA = a.integerPart[i];
    const digitB = b.integerPart[i];
    if (digitA > digitB) return 1;
    if (digitA < digitB) return -1;
  }

  // Integer parts are equal, compare fractional parts
  const maxFracLen = a.fractionalPart.length > b.fractionalPart.length 
    ? a.fractionalPart.length 
    : b.fractionalPart.length;
  
  for (let i = 0; i < maxFracLen; i++) {
    const digitA = i < a.fractionalPart.length ? a.fractionalPart[i] : "0";
    const digitB = i < b.fractionalPart.length ? b.fractionalPart[i] : "0";
    if (digitA > digitB) return 1;
    if (digitA < digitB) return -1;
  }

  // Numbers are equal
  return 0;
}

/**
 * Checks if two numbers are equal
 * @param a First number as string
 * @param b Second number as string
 * @returns true if a == b, false otherwise
 */
export function isEqual(a: string, b: string): boolean {
  return compare(a, b) === 0;
}

/**
 * Checks if first number is greater than second
 * @param a First number as string
 * @param b Second number as string
 * @returns true if a > b, false otherwise
 */
export function isGreaterThan(a: string, b: string): boolean {
  return compare(a, b) === 1;
}

/**
 * Checks if first number is less than second
 * @param a First number as string
 * @param b Second number as string
 * @returns true if a < b, false otherwise
 */
export function isLessThan(a: string, b: string): boolean {
  return compare(a, b) === -1;
}

/**
 * Finds the minimum of two or more numbers
 * @param a First number as string
 * @param b Second number as string
 * @param rest Additional numbers
 * @returns The smallest number as string
 */
export function min(a: string, b: string, ...rest: string[]): string {
  let minimum = compare(a, b) <= 0 ? a : b;
  
  for (const num of rest) {
    if (compare(num, minimum) < 0) {
      minimum = num;
    }
  }
  
  return minimum;
}

/**
 * Finds the maximum of two or more numbers
 * @param a First number as string
 * @param b Second number as string
 * @param rest Additional numbers
 * @returns The largest number as string
 */
export function max(a: string, b: string, ...rest: string[]): string {
  let maximum = compare(a, b) >= 0 ? a : b;
  
  for (const num of rest) {
    if (compare(num, maximum) > 0) {
      maximum = num;
    }
  }
  
  return maximum;
}