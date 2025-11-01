import sqrt from "../src/sqrt";

describe("sqrt function", () => {
  test("should compute square root of perfect squares", () => {
    expect(sqrt("4")).toBe("2");
    expect(sqrt("9")).toBe("3");
    expect(sqrt("16")).toBe("4");
  });

  test("should handle zero", () => {
    expect(sqrt("0")).toBe("0");
    expect(sqrt("0.0")).toBe("0");
  });

  test("should handle one", () => {
    expect(sqrt("1")).toBe("1");
    expect(sqrt("1.0")).toBe("1");
  });

  test("should compute square root with precision", () => {
    const result = sqrt("2", 10);
    expect(result.substring(0, 12)).toBe("1.4142135623");
  });

  test("should handle large numbers", () => {
    const result = sqrt("100");
    expect(result).toBe("10");
  });

  test("should handle decimal numbers", () => {
    const result = sqrt("0.25");
    expect(result).toBe("0.5");
  });

  test("should throw error for negative numbers", () => {
    expect(() => sqrt("-4")).toThrow("Cannot compute square root of negative number");
  });

  test("should throw error for non-string input", () => {
    expect(() => sqrt(4 as any)).toThrow("Input must be a string");
  });
});