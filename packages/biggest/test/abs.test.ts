import abs from "../src/abs";

describe("abs function", () => {
  test("should return absolute value of positive number", () => {
    expect(abs("123.456")).toBe("123.456");
  });

  test("should return absolute value of negative number", () => {
    expect(abs("-123.456")).toBe("123.456");
  });

  test("should handle positive sign", () => {
    expect(abs("+123.456")).toBe("123.456");
  });

  test("should handle zero", () => {
    expect(abs("0")).toBe("0");
    expect(abs("-0")).toBe("0");
    expect(abs("+0")).toBe("0");
  });

  test("should handle very large numbers", () => {
    expect(abs("-999999999999999999999999.123456789")).toBe("999999999999999999999999.123456789");
  });

  test("should handle whitespace", () => {
    expect(abs("  -123.456  ")).toBe("123.456");
  });

  test("should throw error for non-string input", () => {
    expect(() => abs(123 as any)).toThrow("Input must be a string");
  });
});