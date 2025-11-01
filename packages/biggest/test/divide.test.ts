import divide from "../src/divide";

const TIME_OUT = 10;

describe("divide function test", () => {
  test(
    "Dividing positive numbers",
    async () => {
      expect(divide("10", "2")).toBe("5");
      expect(divide("100", "25")).toBe("4");
      expect(divide("7", "2")).toBe("3.5");
    },
    TIME_OUT
  );

  test(
    "Dividing negative numbers",
    async () => {
      expect(divide("-10", "2")).toBe("-5");
      expect(divide("10", "-2")).toBe("-5");
      expect(divide("-10", "-2")).toBe("5");
    },
    TIME_OUT
  );

  test(
    "Dividing decimals",
    async () => {
      expect(divide("3.14", "2")).toBe("1.57");
      expect(divide("1", "3")).toBe("0.33333333333333333333");
      expect(divide("0.1", "0.3")).toBe("0.33333333333333333333");
    },
    TIME_OUT
  );

  test(
    "Dividing by zero",
    async () => {
      expect(() => divide("10", "0")).toThrow();
      expect(() => divide("-5", "0")).toThrow();
      expect(() => divide("0", "0")).toThrow();
    },
    TIME_OUT
  );

  test(
    "Dividing zero",
    async () => {
      expect(divide("0", "5")).toBe("0");
      expect(divide("0", "-3")).toBe("0");
      expect(divide("0", "0.1")).toBe("0");
    },
    TIME_OUT
  );

  test(
    "Dividing large numbers",
    async () => {
      expect(divide("1000000000000000", "1000000")).toBe("1000000000");
      expect(divide("9999999999", "3")).toBe("3333333333");
    },
    TIME_OUT
  );

  test(
    "Dividing small numbers",
    async () => {
      expect(divide("0.0000001", "0.0001")).toBe("0.001");
      expect(divide("0.000000001", "0.000000003")).toBe(
        "0.33333333333333333333"
      );
    },
    TIME_OUT
  );

  test(
    "Precision test",
    async () => {
      expect(divide("1", "3", 5)).toBe("0.33333");
      expect(divide("2", "3", 10)).toBe("0.6666666667");
    },
    TIME_OUT
  );

  test(
    "Rounding test",
    async () => {
      expect(divide("10", "3", 2)).toBe("3.33");
      expect(divide("1", "6", 3)).toBe("0.167");
    },
    TIME_OUT
  );
});
