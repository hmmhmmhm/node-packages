import divide from "./divide";
import multiply from "./multiply";
import subtract from "./subtract";
import compare, { isEqual } from "./compare";
import { floor } from "./rounding";
import { parseStringNumber, isInteger, isZero } from "./utils";
import abs from "./abs";
import add from "./add";

/**
 * Modulo operation (remainder after division)
 * For positive numbers: a mod n = a - n * floor(a/n)
 * Result always has the same sign as the divisor n
 * @param dividend The number being divided
 * @param divisor The number to divide by
 * @returns Remainder as string
 */
export function mod(dividend: string, divisor: string): string {
  if (isZero(divisor)) {
    throw new Error("Division by zero in modulo operation");
  }

  if (!isInteger(dividend) || !isInteger(divisor)) {
    throw new Error("Modulo operation requires integer arguments");
  }

  if (isZero(dividend)) {
    return "0";
  }

  // Calculate quotient using floor division
  const quotient = divide(dividend, divisor, 0);
  const flooredQuotient = floor(quotient);
  
  // Calculate remainder: dividend - divisor * floor(dividend/divisor)
  const product = multiply(divisor, flooredQuotient);
  const remainder = subtract(dividend, product);
  
  // Ensure result has same sign as divisor (mathematical modulo)
  const divisorParsed = parseStringNumber(divisor);
  const remainderParsed = parseStringNumber(remainder);
  
  if (isZero(remainder)) {
    return "0";
  }
  
  // If remainder and divisor have different signs, adjust
  if (divisorParsed.sign !== remainderParsed.sign) {
    return add(remainder, divisor);
  }
  
  return remainder;
}

/**
 * Euclidean algorithm for Greatest Common Divisor
 * @param a First number as string
 * @param b Second number as string
 * @returns GCD as string
 */
export function gcd(a: string, b: string): string {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("GCD requires integer arguments");
  }

  // Work with absolute values
  let numA = abs(a);
  let numB = abs(b);
  
  if (isZero(numA)) {
    return numB;
  }
  
  if (isZero(numB)) {
    return numA;
  }

  // Euclidean algorithm: gcd(a,b) = gcd(b, a mod b)
  while (!isZero(numB)) {
    const temp = numB;
    numB = mod(numA, numB);
    numA = temp;
  }
  
  return numA;
}

/**
 * Least Common Multiple using the formula: lcm(a,b) = |a*b| / gcd(a,b)
 * @param a First number as string
 * @param b Second number as string
 * @returns LCM as string
 */
export function lcm(a: string, b: string): string {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("LCM requires integer arguments");
  }

  if (isZero(a) || isZero(b)) {
    return "0";
  }

  // lcm(a,b) = |a*b| / gcd(a,b)
  const product = multiply(abs(a), abs(b));
  const gcdResult = gcd(a, b);
  
  return divide(product, gcdResult, 0);
}

/**
 * Remainder operation (different from modulo for negative numbers)
 * Result has the same sign as the dividend
 * @param dividend The number being divided
 * @param divisor The number to divide by
 * @returns Remainder as string
 */
export function remainder(dividend: string, divisor: string): string {
  if (isZero(divisor)) {
    throw new Error("Division by zero in remainder operation");
  }

  if (!isInteger(dividend) || !isInteger(divisor)) {
    throw new Error("Remainder operation requires integer arguments");
  }

  if (isZero(dividend)) {
    return "0";
  }

  // For remainder operation, we use truncated division
  const quotient = divide(dividend, divisor, 0);
  
  // Truncate towards zero (different from floor for negative numbers)
  const truncatedQuotient = quotient.startsWith("-") ? 
    "-" + floor(quotient.substring(1)) : 
    floor(quotient);
  
  // Calculate remainder: dividend - divisor * truncate(dividend/divisor)
  const product = multiply(divisor, truncatedQuotient);
  return subtract(dividend, product);
}