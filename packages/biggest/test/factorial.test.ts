import { factorial, combination, permutation } from "../src/factorial";

describe("factorial", () => {
  test("should calculate basic factorials", () => {
    expect(factorial("0")).toBe("1");
    expect(factorial("1")).toBe("1");
    expect(factorial("2")).toBe("2");
    expect(factorial("3")).toBe("6");
    expect(factorial("4")).toBe("24");
    expect(factorial("5")).toBe("120");
  });

  test("should calculate larger factorials", () => {
    expect(factorial("6")).toBe("720");
    expect(factorial("7")).toBe("5040");
    expect(factorial("10")).toBe("3628800");
  });

  test("should handle very large factorials", () => {
    // 20! = 2432902008176640000
    expect(factorial("20")).toBe("2432902008176640000");
  });

  test("should throw error for negative numbers", () => {
    expect(() => factorial("-1")).toThrow("Factorial is not defined for negative numbers");
    expect(() => factorial("-5")).toThrow("Factorial is not defined for negative numbers");
  });

  test("should throw error for non-integers", () => {
    expect(() => factorial("5.5")).toThrow("Factorial is only defined for integers");
    expect(() => factorial("3.14")).toThrow("Factorial is only defined for integers");
  });
});

describe("combination", () => {
  test("should calculate basic combinations", () => {
    expect(combination("5", "2")).toBe("10"); // C(5,2) = 10
    expect(combination("5", "3")).toBe("10"); // C(5,3) = 10
    expect(combination("4", "2")).toBe("6");  // C(4,2) = 6
    expect(combination("6", "3")).toBe("20"); // C(6,3) = 20
  });

  test("should handle edge cases", () => {
    expect(combination("5", "0")).toBe("1"); // C(n,0) = 1
    expect(combination("5", "5")).toBe("1"); // C(n,n) = 1
    expect(combination("5", "6")).toBe("0"); // C(n,r) = 0 when r > n
  });

  test("should handle large combinations", () => {
    expect(combination("10", "3")).toBe("120"); // C(10,3) = 120
    expect(combination("15", "5")).toBe("3003"); // C(15,5) = 3003
  });

  test("should use symmetry optimization", () => {
    // C(10,8) should equal C(10,2) = 45
    expect(combination("10", "8")).toBe("45");
    expect(combination("10", "2")).toBe("45");
  });

  test("should throw error for negative numbers", () => {
    expect(() => combination("-5", "2")).toThrow("Combination is not defined for negative numbers");
    expect(() => combination("5", "-2")).toThrow("Combination is not defined for negative numbers");
  });

  test("should throw error for non-integers", () => {
    expect(() => combination("5.5", "2")).toThrow("Combination requires integer arguments");
    expect(() => combination("5", "2.5")).toThrow("Combination requires integer arguments");
  });
});

describe("permutation", () => {
  test("should calculate basic permutations", () => {
    expect(permutation("5", "2")).toBe("20"); // P(5,2) = 20
    expect(permutation("5", "3")).toBe("60"); // P(5,3) = 60
    expect(permutation("4", "2")).toBe("12"); // P(4,2) = 12
    expect(permutation("6", "3")).toBe("120"); // P(6,3) = 120
  });

  test("should handle edge cases", () => {
    expect(permutation("5", "0")).toBe("1"); // P(n,0) = 1
    expect(permutation("5", "5")).toBe("120"); // P(5,5) = 5! = 120
    expect(permutation("5", "6")).toBe("0"); // P(n,r) = 0 when r > n
  });

  test("should handle large permutations", () => {
    expect(permutation("10", "3")).toBe("720"); // P(10,3) = 720
    expect(permutation("8", "4")).toBe("1680"); // P(8,4) = 1680
  });

  test("should throw error for negative numbers", () => {
    expect(() => permutation("-5", "2")).toThrow("Permutation is not defined for negative numbers");
    expect(() => permutation("5", "-2")).toThrow("Permutation is not defined for negative numbers");
  });

  test("should throw error for non-integers", () => {
    expect(() => permutation("5.5", "2")).toThrow("Permutation requires integer arguments");
    expect(() => permutation("5", "2.5")).toThrow("Permutation requires integer arguments");
  });

  test("should relate to combinations correctly", () => {
    // P(n,r) = C(n,r) × r!
    // P(5,3) = C(5,3) × 3! = 10 × 6 = 60
    expect(permutation("5", "3")).toBe("60");
    expect(combination("5", "3")).toBe("10");
  });
});