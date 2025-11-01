import { mod, gcd, lcm, remainder } from "../src/modular";

describe("mod", () => {
  test("should calculate basic modulo operations", () => {
    expect(mod("10", "3")).toBe("1");
    expect(mod("17", "5")).toBe("2");
    expect(mod("20", "4")).toBe("0");
  });

  test("should handle zero dividend", () => {
    expect(mod("0", "5")).toBe("0");
    expect(mod("0", "-3")).toBe("0");
  });

  test("should handle negative numbers correctly", () => {
    // Mathematical modulo: result has same sign as divisor
    expect(mod("-10", "3")).toBe("2");  // -10 + 4*3 = 2
    expect(mod("10", "-3")).toBe("-2"); // 10 - 4*3 = -2 (adjusted to match divisor sign)
    expect(mod("-10", "-3")).toBe("-1"); // -10 + 3*(-3) = -1
  });

  test("should handle large numbers", () => {
    expect(mod("999999999999999999999", "7")).toBe("5");
    expect(mod("123456789123456789", "1000")).toBe("789");
  });

  test("should throw error for zero divisor", () => {
    expect(() => mod("10", "0")).toThrow("Division by zero in modulo operation");
  });

  test("should throw error for non-integer arguments", () => {
    expect(() => mod("10.5", "3")).toThrow("Modulo operation requires integer arguments");
    expect(() => mod("10", "3.5")).toThrow("Modulo operation requires integer arguments");
  });
});

describe("gcd", () => {
  test("should calculate basic GCD", () => {
    expect(gcd("12", "18")).toBe("6");
    expect(gcd("48", "18")).toBe("6");
    expect(gcd("17", "13")).toBe("1"); // Coprime numbers
  });

  test("should handle zero arguments", () => {
    expect(gcd("0", "5")).toBe("5");
    expect(gcd("10", "0")).toBe("10");
    expect(gcd("0", "0")).toBe("0");
  });

  test("should handle negative numbers", () => {
    expect(gcd("-12", "18")).toBe("6");
    expect(gcd("12", "-18")).toBe("6");
    expect(gcd("-12", "-18")).toBe("6");
  });

  test("should handle identical numbers", () => {
    expect(gcd("15", "15")).toBe("15");
    expect(gcd("-7", "-7")).toBe("7");
  });

  test("should handle large numbers", () => {
    expect(gcd("123456789", "987654321")).toBe("9");
    expect(gcd("999999999999", "111111111111")).toBe("111111111111");
  });

  test("should throw error for non-integer arguments", () => {
    expect(() => gcd("12.5", "18")).toThrow("GCD requires integer arguments");
    expect(() => gcd("12", "18.5")).toThrow("GCD requires integer arguments");
  });
});

describe("lcm", () => {
  test("should calculate basic LCM", () => {
    expect(lcm("12", "18")).toBe("36");
    expect(lcm("4", "6")).toBe("12");
    expect(lcm("7", "3")).toBe("21"); // Coprime numbers
  });

  test("should handle zero arguments", () => {
    expect(lcm("0", "5")).toBe("0");
    expect(lcm("10", "0")).toBe("0");
  });

  test("should handle negative numbers", () => {
    expect(lcm("-12", "18")).toBe("36");
    expect(lcm("12", "-18")).toBe("36");
    expect(lcm("-12", "-18")).toBe("36");
  });

  test("should handle identical numbers", () => {
    expect(lcm("15", "15")).toBe("15");
    expect(lcm("-7", "-7")).toBe("7");
  });

  test("should handle large numbers", () => {
    expect(lcm("123", "456")).toBe("18696");
  });

  test("should throw error for non-integer arguments", () => {
    expect(() => lcm("12.5", "18")).toThrow("LCM requires integer arguments");
    expect(() => lcm("12", "18.5")).toThrow("LCM requires integer arguments");
  });
});

describe("remainder", () => {
  test("should calculate basic remainder operations", () => {
    expect(remainder("10", "3")).toBe("1");
    expect(remainder("17", "5")).toBe("2");
    expect(remainder("20", "4")).toBe("0");
  });

  test("should handle zero dividend", () => {
    expect(remainder("0", "5")).toBe("0");
    expect(remainder("0", "-3")).toBe("0");
  });

  test("should handle negative numbers correctly", () => {
    // Remainder: result has same sign as dividend
    expect(remainder("-10", "3")).toBe("-1");  // -10 - (-3)*3 = -1
    expect(remainder("10", "-3")).toBe("1");   // 10 - (-3)*3 = 1
    expect(remainder("-10", "-3")).toBe("-1"); // -10 - 3*(-3) = -1
  });

  test("should throw error for zero divisor", () => {
    expect(() => remainder("10", "0")).toThrow("Division by zero in remainder operation");
  });

  test("should throw error for non-integer arguments", () => {
    expect(() => remainder("10.5", "3")).toThrow("Remainder operation requires integer arguments");
    expect(() => remainder("10", "3.5")).toThrow("Remainder operation requires integer arguments");
  });

  test("should differ from modulo for negative numbers", () => {
    // Show the difference between mod and remainder for negative numbers
    expect(mod("-10", "3")).toBe("2");      // Mathematical modulo
    expect(remainder("-10", "3")).toBe("-1"); // Programming remainder
    
    expect(mod("10", "-3")).toBe("-2");     // Mathematical modulo  
    expect(remainder("10", "-3")).toBe("1"); // Programming remainder
  });
});