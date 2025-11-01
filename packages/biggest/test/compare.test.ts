import compare, { isEqual, isGreaterThan, isLessThan, min, max } from "../src/compare";

describe("compare", () => {
  test("should compare positive integers correctly", () => {
    expect(compare("123", "456")).toBe(-1);
    expect(compare("456", "123")).toBe(1);
    expect(compare("123", "123")).toBe(0);
  });

  test("should compare negative integers correctly", () => {
    expect(compare("-123", "-456")).toBe(1);
    expect(compare("-456", "-123")).toBe(-1);
    expect(compare("-123", "-123")).toBe(0);
  });

  test("should compare positive and negative numbers correctly", () => {
    expect(compare("123", "-456")).toBe(1);
    expect(compare("-123", "456")).toBe(-1);
    expect(compare("0", "-0")).toBe(0);
  });

  test("should compare decimal numbers correctly", () => {
    expect(compare("123.456", "123.789")).toBe(-1);
    expect(compare("123.789", "123.456")).toBe(1);
    expect(compare("123.456", "123.456")).toBe(0);
  });

  test("should compare very large numbers correctly", () => {
    expect(compare("999999999999999999999999", "1000000000000000000000000")).toBe(-1);
    expect(compare("1000000000000000000000000", "999999999999999999999999")).toBe(1);
  });

  test("should compare very small decimal numbers correctly", () => {
    expect(compare("0.000000000000000001", "0.000000000000000002")).toBe(-1);
    expect(compare("0.000000000000000002", "0.000000000000000001")).toBe(1);
  });

  test("should handle zero correctly", () => {
    expect(compare("0", "0")).toBe(0);
    expect(compare("0", "-0")).toBe(0);
    expect(compare("0.0", "0")).toBe(0);
    expect(compare("0", "1")).toBe(-1);
    expect(compare("1", "0")).toBe(1);
  });
});

describe("isEqual", () => {
  test("should check equality correctly", () => {
    expect(isEqual("123", "123")).toBe(true);
    expect(isEqual("123", "456")).toBe(false);
    expect(isEqual("123.456", "123.456")).toBe(true);
    expect(isEqual("0", "-0")).toBe(true);
  });
});

describe("isGreaterThan", () => {
  test("should check greater than correctly", () => {
    expect(isGreaterThan("456", "123")).toBe(true);
    expect(isGreaterThan("123", "456")).toBe(false);
    expect(isGreaterThan("123", "123")).toBe(false);
  });
});

describe("isLessThan", () => {
  test("should check less than correctly", () => {
    expect(isLessThan("123", "456")).toBe(true);
    expect(isLessThan("456", "123")).toBe(false);
    expect(isLessThan("123", "123")).toBe(false);
  });
});

describe("min", () => {
  test("should find minimum of two numbers", () => {
    expect(min("123", "456")).toBe("123");
    expect(min("456", "123")).toBe("123");
    expect(min("-123", "-456")).toBe("-456");
  });

  test("should find minimum of multiple numbers", () => {
    expect(min("123", "456", "789", "12")).toBe("12");
    expect(min("-10", "-20", "-5", "-30")).toBe("-30");
  });
});

describe("max", () => {
  test("should find maximum of two numbers", () => {
    expect(max("123", "456")).toBe("456");
    expect(max("456", "123")).toBe("456");
    expect(max("-123", "-456")).toBe("-123");
  });

  test("should find maximum of multiple numbers", () => {
    expect(max("123", "456", "789", "12")).toBe("789");
    expect(max("-10", "-20", "-5", "-30")).toBe("-5");
  });
});