import { divide } from "./divide";
import add from "./add";
import multiply from "./multiply";

/**
 * Function to compute square root using Newton's method
 * @param num - number as string
 * @param precision - precision for the result (default 20)
 * @returns square root of the number
 */
export default function sqrt(num: string, precision: number = 20): string {
  if (typeof num !== "string") {
    throw new Error("Input must be a string");
  }

  // Remove leading/trailing whitespace
  num = num.trim();
  
  // Check for negative numbers
  if (num.startsWith("-")) {
    throw new Error("Cannot compute square root of negative number");
  }
  
  // Handle zero
  if (num === "0" || num === "0.0" || num === "+0") {
    return "0";
  }
  
  // Handle one
  if (num === "1" || num === "1.0" || num === "+1") {
    return "1";
  }

  // Newton's method: x_{n+1} = (x_n + num/x_n) / 2
  let x = num; // Initial guess
  let prevX = "0";
  
  // Iterate until convergence
  for (let i = 0; i < precision * 2; i++) {
    prevX = x;
    // x = (x + num/x) / 2
    const quotient = divide(num, x, precision + 10);
    const sum = add(x, quotient);
    x = divide(sum, "2", precision + 10);
    
    // Check for convergence (simplified)
    if (x === prevX) {
      break;
    }
  }
  
  // Round to desired precision
  const dotIndex = x.indexOf(".");
  if (dotIndex !== -1 && x.length > dotIndex + precision + 1) {
    x = x.substring(0, dotIndex + precision + 1);
  }
  
  return x;
}