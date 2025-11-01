import { floor, ceil, truncate, round, roundToPrecision } from "../src/rounding";

describe("floor", () => {
  test("should floor positive integers", () => {
    expect(floor("5")).toBe("5");
    expect(floor("0")).toBe("0");
  });

  test("should floor positive decimals", () => {
    expect(floor("5.1")).toBe("5");
    expect(floor("5.9")).toBe("5");
    expect(floor("0.1")).toBe("0");
    expect(floor("0.9")).toBe("0");
  });

  test("should floor negative integers", () => {
    expect(floor("-5")).toBe("-5");
    expect(floor("-0")).toBe("0");
  });

  test("should floor negative decimals", () => {
    expect(floor("-5.1")).toBe("-6");
    expect(floor("-5.9")).toBe("-6");
    expect(floor("-0.1")).toBe("-1");
    expect(floor("-0.9")).toBe("-1");
  });

  test("should handle large numbers", () => {
    expect(floor("999999999999999999999.1")).toBe("999999999999999999999");
    expect(floor("-999999999999999999999.1")).toBe("-1000000000000000000000");
  });
});

describe("ceil", () => {
  test("should ceil positive integers", () => {
    expect(ceil("5")).toBe("5");
    expect(ceil("0")).toBe("0");
  });

  test("should ceil positive decimals", () => {
    expect(ceil("5.1")).toBe("6");
    expect(ceil("5.9")).toBe("6");
    expect(ceil("0.1")).toBe("1");
    expect(ceil("0.9")).toBe("1");
  });

  test("should ceil negative integers", () => {
    expect(ceil("-5")).toBe("-5");
    expect(ceil("-0")).toBe("0");
  });

  test("should ceil negative decimals", () => {
    expect(ceil("-5.1")).toBe("-5");
    expect(ceil("-5.9")).toBe("-5");
    expect(ceil("-0.1")).toBe("-0");
    expect(ceil("-0.9")).toBe("-0");
  });

  test("should handle large numbers", () => {
    expect(ceil("999999999999999999999.1")).toBe("1000000000000000000000");
    expect(ceil("-999999999999999999999.1")).toBe("-999999999999999999999");
  });
});

describe("truncate", () => {
  test("should truncate positive numbers", () => {
    expect(truncate("5")).toBe("5");
    expect(truncate("5.1")).toBe("5");
    expect(truncate("5.9")).toBe("5");
    expect(truncate("0.9")).toBe("0");
  });

  test("should truncate negative numbers", () => {
    expect(truncate("-5")).toBe("-5");
    expect(truncate("-5.1")).toBe("-5");
    expect(truncate("-5.9")).toBe("-5");
    expect(truncate("-0.9")).toBe("0");
  });

  test("should handle large numbers", () => {
    expect(truncate("999999999999999999999.123456789")).toBe("999999999999999999999");
    expect(truncate("-999999999999999999999.123456789")).toBe("-999999999999999999999");
  });
});

describe("round", () => {
  test("should round positive numbers", () => {
    expect(round("5")).toBe("5");
    expect(round("5.4")).toBe("5");
    expect(round("5.5")).toBe("6");
    expect(round("5.6")).toBe("6");
    expect(round("0.4")).toBe("0");
    expect(round("0.5")).toBe("1");
  });

  test("should round negative numbers", () => {
    expect(round("-5")).toBe("-5");
    expect(round("-5.4")).toBe("-5");
    expect(round("-5.5")).toBe("-6");
    expect(round("-5.6")).toBe("-6");
    expect(round("-0.4")).toBe("0");
    expect(round("-0.5")).toBe("-1");
  });

  test("should handle large numbers", () => {
    expect(round("999999999999999999999.4")).toBe("999999999999999999999");
    expect(round("999999999999999999999.5")).toBe("1000000000000000000000");
  });
});

describe("roundToPrecision", () => {
  test("should round to specified precision", () => {
    expect(roundToPrecision("5.123", 2)).toBe("5.12");
    expect(roundToPrecision("5.126", 2)).toBe("5.13");
    expect(roundToPrecision("5.125", 2)).toBe("5.13");
  });

  test("should handle precision of 0", () => {
    expect(roundToPrecision("5.4", 0)).toBe("5");
    expect(roundToPrecision("5.5", 0)).toBe("6");
  });

  test("should pad with zeros when needed", () => {
    expect(roundToPrecision("5", 2)).toBe("5.00");
    expect(roundToPrecision("5.1", 3)).toBe("5.100");
  });

  test("should handle negative numbers", () => {
    expect(roundToPrecision("-5.123", 2)).toBe("-5.12");
    expect(roundToPrecision("-5.126", 2)).toBe("-5.13");
  });

  test("should remove trailing zeros", () => {
    expect(roundToPrecision("5.100", 2)).toBe("5.1");
    expect(roundToPrecision("5.000", 2)).toBe("5");
  });
});