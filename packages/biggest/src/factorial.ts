import multiply from "./multiply";
import compare, { isEqual } from "./compare";
import { parseStringNumber, isInteger, isZero, addOne } from "./utils";

/**
 * Calculates factorial of a non-negative integer
 * n! = n × (n-1) × (n-2) × ... × 2 × 1
 * Special cases: 0! = 1, 1! = 1
 * @param n Non-negative integer as string
 * @returns Factorial as string
 */
export function factorial(n: string): string {
  if (!isInteger(n)) {
    throw new Error("Factorial is only defined for integers");
  }

  const parsed = parseStringNumber(n);
  
  if (parsed.sign === -1) {
    throw new Error("Factorial is not defined for negative numbers");
  }

  if (isZero(n) || isEqual(n, "1")) {
    return "1";
  }

  // Calculate n! = n × (n-1) × (n-2) × ... × 2 × 1
  let result = "1";
  let current = "2";
  
  while (compare(current, n) <= 0) {
    result = multiply(result, current);
    current = addOne(current);
  }
  
  return result;
}

/**
 * Calculates the number of ways to choose r items from n items (combinations)
 * C(n,r) = n! / (r! × (n-r)!)
 * @param n Total number of items
 * @param r Number of items to choose
 * @returns Number of combinations as string
 */
export function combination(n: string, r: string): string {
  if (!isInteger(n) || !isInteger(r)) {
    throw new Error("Combination requires integer arguments");
  }

  const nParsed = parseStringNumber(n);
  const rParsed = parseStringNumber(r);
  
  if (nParsed.sign === -1 || rParsed.sign === -1) {
    throw new Error("Combination is not defined for negative numbers");
  }

  if (compare(r, n) > 0) {
    return "0"; // C(n,r) = 0 when r > n
  }

  if (isZero(r) || isEqual(r, n)) {
    return "1"; // C(n,0) = C(n,n) = 1
  }

  // Optimize: C(n,r) = C(n,n-r), use the smaller value
  const nMinusR = require("./subtract").default(n, r);
  if (compare(r, nMinusR) > 0) {
    r = nMinusR;
  }

  // Calculate C(n,r) = n! / (r! × (n-r)!)
  // But we can optimize this to avoid calculating large factorials:
  // C(n,r) = (n × (n-1) × ... × (n-r+1)) / (r × (r-1) × ... × 1)
  
  let numerator = "1";
  let denominator = "1";
  let i = "0";
  
  while (compare(i, r) < 0) {
    // numerator *= (n - i)
    const nMinusI = require("./subtract").default(n, i);
    numerator = multiply(numerator, nMinusI);
    
    // denominator *= (i + 1)
    const iPlus1 = addOne(i);
    denominator = multiply(denominator, iPlus1);
    
    i = addOne(i);
  }
  
  return require("./divide").default(numerator, denominator, 0);
}

/**
 * Calculates the number of ways to arrange r items from n items (permutations)
 * P(n,r) = n! / (n-r)!
 * @param n Total number of items
 * @param r Number of items to arrange
 * @returns Number of permutations as string
 */
export function permutation(n: string, r: string): string {
  if (!isInteger(n) || !isInteger(r)) {
    throw new Error("Permutation requires integer arguments");
  }

  const nParsed = parseStringNumber(n);
  const rParsed = parseStringNumber(r);
  
  if (nParsed.sign === -1 || rParsed.sign === -1) {
    throw new Error("Permutation is not defined for negative numbers");
  }

  if (compare(r, n) > 0) {
    return "0"; // P(n,r) = 0 when r > n
  }

  if (isZero(r)) {
    return "1"; // P(n,0) = 1
  }

  // Calculate P(n,r) = n × (n-1) × ... × (n-r+1)
  let result = "1";
  let i = "0";
  
  while (compare(i, r) < 0) {
    // result *= (n - i)
    const nMinusI = require("./subtract").default(n, i);
    result = multiply(result, nMinusI);
    i = addOne(i);
  }
  
  return result;
}