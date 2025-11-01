import { pow, nthRoot } from "../src/power";

describe("pow", () => {
  test("should handle basic integer powers", () => {
    expect(pow("2", "3")).toBe("8");
    expect(pow("3", "2")).toBe("9");
    expect(pow("10", "3")).toBe("1000");
  });

  test("should handle zero exponent", () => {
    expect(pow("5", "0")).toBe("1");
    expect(pow("999", "0")).toBe("1");
    expect(pow("-5", "0")).toBe("1");
  });

  test("should handle exponent of one", () => {
    expect(pow("5", "1")).toBe("5");
    expect(pow("-7", "1")).toBe("-7");
    expect(pow("123.456", "1")).toBe("123.456");
  });

  test("should handle negative exponents", () => {
    expect(pow("2", "-1")).toBe("0.5");
    expect(pow("10", "-2")).toBe("0.01");
    expect(pow("5", "-1")).toBe("0.2");
  });

  test("should handle negative bases", () => {
    expect(pow("-2", "3")).toBe("-8");
    expect(pow("-2", "4")).toBe("16");
    expect(pow("-3", "2")).toBe("9");
  });

  test("should handle zero base", () => {
    expect(pow("0", "5")).toBe("0");
    expect(pow("0", "100")).toBe("0");
  });

  test("should throw error for zero base with negative exponent", () => {
    expect(() => pow("0", "-1")).toThrow("Cannot raise zero to a negative power");
  });

  test("should handle large numbers", () => {
    expect(pow("2", "10")).toBe("1024");
    expect(pow("3", "5")).toBe("243");
  });

  test("should handle decimal bases", () => {
    expect(pow("1.5", "2")).toBe("2.25");
    expect(pow("0.5", "3")).toBe("0.125");
  });

  test("should throw error for non-integer exponents", () => {
    expect(() => pow("2", "2.5")).toThrow("Non-integer exponents are not supported yet");
    expect(() => pow("3", "1.1")).toThrow("Non-integer exponents are not supported yet");
  });
});

describe("nthRoot", () => {
  test("should calculate square roots", () => {
    expect(nthRoot("4", "2").charAt(0)).toBe("2");
    expect(nthRoot("9", "2").charAt(0)).toBe("3");
    expect(nthRoot("16", "2").charAt(0)).toBe("4");
  });

  test("should calculate cube roots", () => {
    expect(nthRoot("8", "3").charAt(0)).toBe("2");
    expect(nthRoot("27", "3").charAt(0)).toBe("3");
    expect(nthRoot("64", "3").charAt(0)).toBe("4");
  });

  test("should handle n = 1", () => {
    expect(nthRoot("5", "1")).toBe("5");
    expect(nthRoot("123.456", "1")).toBe("123.456");
  });

  test("should handle zero radicand", () => {
    expect(nthRoot("0", "3")).toBe("0");
    expect(nthRoot("0", "5")).toBe("0");
  });

  test("should handle negative radicand with odd root", () => {
    const result = nthRoot("-8", "3");
    expect(result.startsWith("-2")).toBe(true);
  });

  test("should throw error for negative radicand with even root", () => {
    expect(() => nthRoot("-4", "2")).toThrow("Cannot take even root of negative number");
    expect(() => nthRoot("-16", "4")).toThrow("Cannot take even root of negative number");
  });

  test("should throw error for non-positive root degree", () => {
    expect(() => nthRoot("8", "0")).toThrow("Root degree must be positive");
    expect(() => nthRoot("8", "-1")).toThrow("Root degree must be positive");
  });

  test("should throw error for non-integer root degree", () => {
    expect(() => nthRoot("8", "2.5")).toThrow("Root degree must be an integer");
  });

  test("should handle precision parameter", () => {
    const result1 = nthRoot("2", "2", 5);
    const result2 = nthRoot("2", "2", 15);
    // Results should be different when precision is different
    expect(result1).not.toBe(result2);
    expect(result1.length).toBeLessThan(result2.length);
  });

  test("should handle large numbers", () => {
    const result = nthRoot("1000000", "3");
    expect(result.substring(0, 3)).toBe("100");
  });
});