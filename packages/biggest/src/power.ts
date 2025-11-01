import multiply from "./multiply";
import divide from "./divide";
import compare, { isEqual } from "./compare";
import { parseStringNumber, isInteger, isZero } from "./utils";

/**
 * Raises a number to an integer power (simple repeated multiplication)
 * @param base Base number as string
 * @param exponent Integer exponent as string
 * @returns Result as string
 */
function powerInteger(base: string, exponent: string): string {
  if (isZero(exponent)) {
    return "1";
  }
  
  if (isZero(base)) {
    return "0";
  }
  
  if (isEqual(exponent, "1")) {
    return base;
  }
  
  const expParsed = parseStringNumber(exponent);
  let isNegativeExp = expParsed.sign === -1;
  let absExp = expParsed.integerPart;
  
  // Simple repeated multiplication for now (can optimize later)
  let result = "1";
  let counter = "0";
  
  while (compare(counter, absExp) < 0) {
    result = multiply(result, base);
    counter = add(counter, "1");
  }
  
  // If exponent was negative, return 1/result
  if (isNegativeExp) {
    return divide("1", result, 20);
  }
  
  return result;
}

/**
 * Divides a number by 2 (integer division) 
 * @param num Number as string
 * @returns Result as string
 */
function divideByTwo(num: string): string {
  if (isZero(num)) return "0";
  if (isEqual(num, "1")) return "0";
  
  // Use existing divide function
  return divide(num, "2", 0);
}

/**
 * Raises a number to a power
 * @param base Base number as string
 * @param exponent Exponent as string
 * @returns Result as string
 */
export function pow(base: string, exponent: string): string {
  if (!isInteger(exponent)) {
    throw new Error("Non-integer exponents are not supported yet");
  }
  
  if (isZero(base) && compare(exponent, "0") < 0) {
    throw new Error("Cannot raise zero to a negative power");
  }
  
  return powerInteger(base, exponent);
}

/**
 * Calculates the nth root of a number using Newton's method
 * @param radicand The number to find the root of
 * @param n The root degree (must be positive integer)
 * @param precision Number of decimal places (default 20)
 * @returns Result as string
 */
export function nthRoot(radicand: string, n: string, precision: number = 20): string {
  if (!isInteger(n)) {
    throw new Error("Root degree must be an integer");
  }
  
  if (compare(n, "0") <= 0) {
    throw new Error("Root degree must be positive");
  }
  
  if (isZero(radicand)) {
    return "0";
  }
  
  if (isEqual(n, "1")) {
    return radicand;
  }
  
  const radicandParsed = parseStringNumber(radicand);
  
  if (isEqual(n, "2")) {
    // For even root of negative number, handle before calling sqrt
    if (radicandParsed.sign === -1) {
      throw new Error("Cannot take even root of negative number");
    }
    // Use existing sqrt function with precision parameter
    const sqrt = require("./sqrt").default;
    return sqrt(radicand, precision);
  }
  
  // For negative radicand and even root, throw error
  if (radicandParsed.sign === -1) {
    const nParsed = parseStringNumber(n);
    const nLastDigit = nParsed.integerPart[nParsed.integerPart.length - 1];
    const nLastDigitValue = nLastDigit.charCodeAt(0) - "0".charCodeAt(0);
    
    if (nLastDigitValue % 2 === 0) {
      throw new Error("Cannot take even root of negative number");
    }
  }
  
  const absRadicand = radicandParsed.sign === -1 ? radicandParsed.integerPart + (radicandParsed.fractionalPart ? "." + radicandParsed.fractionalPart : "") : radicand;
  
  // Newton's method: x_{n+1} = (1/n) * ((n-1)*x_n + radicand/x_n^(n-1))
  let x = absRadicand; // Initial guess
  
  // Better initial guess
  if (compare(absRadicand, "1") > 0) {
    x = divide(absRadicand, n, precision + 5);
  } else {
    x = absRadicand;
  }
  
  const tolerance = "0." + "0".repeat(precision) + "1";
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    // x_n^(n-1)
    const xPowerNMinus1 = powerInteger(x, subtract(n, "1"));
    
    // radicand / x_n^(n-1)
    const quotient = divide(absRadicand, xPowerNMinus1, precision + 5);
    
    // (n-1) * x_n
    const nMinus1TimesX = multiply(subtract(n, "1"), x);
    
    // (n-1) * x_n + radicand / x_n^(n-1)
    const sum = add(nMinus1TimesX, quotient);
    
    // x_{n+1} = sum / n
    const newX = divide(sum, n, precision + 5);
    
    // Check convergence
    const diff = abs(subtract(newX, x));
    if (compare(diff, tolerance) < 0) {
      x = newX;
      break;
    }
    
    x = newX;
  }
  
  // Round to specified precision
  const result = divide(x, "1", precision);
  
  // Apply original sign for odd roots
  if (radicandParsed.sign === -1) {
    return "-" + result;
  }
  
  return result;
}

// Import helper functions directly
import add from "./add";
import subtract from "./subtract";
import abs from "./abs";