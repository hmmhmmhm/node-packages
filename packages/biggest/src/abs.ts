/**
 * Function to get the absolute value of a number
 * @param num - number as string
 * @returns absolute value of the number
 */
export default function abs(num: string): string {
  if (typeof num !== "string") {
    throw new Error("Input must be a string");
  }

  // Remove leading/trailing whitespace
  num = num.trim();
  
  // Remove sign if present
  if (num.startsWith("-") || num.startsWith("+")) {
    return num.substring(1);
  }
  
  return num;
}