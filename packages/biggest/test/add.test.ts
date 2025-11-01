import add from "../src/add";

describe("add function test", () => {
  test("Adding positive numbers", () => {
    expect(add("123", "456")).toBe("579");
    expect(add("999999", "1")).toBe("1000000");
    expect(add("0.1", "0.2")).toBe("0.3");
  });

  test("Adding negative numbers", () => {
    expect(add("-5", "-3")).toBe("-8");
    expect(add("-10", "5")).toBe("-5");
    expect(add("10", "-5")).toBe("5");
  });

  test("Adding zero", () => {
    expect(add("0", "0")).toBe("0");
    expect(add("0", "10")).toBe("10");
    expect(add("-5", "0")).toBe("-5");
  });

  test("Adding decimal numbers", () => {
    expect(add("3.14", "2.86")).toBe("6");
    expect(add("-1.5", "0.5")).toBe("-1");
    expect(add("0.1", "0.2")).toBe("0.3");
    expect(add("0.1", "0.7")).toBe("0.8");
  });

  test("Adding large numbers", () => {
    expect(add("9999999999999999", "1")).toBe("10000000000000000");
    expect(add("1234567890123456789", "9876543210987654321")).toBe(
      "11111111101111111110"
    );
  });

  test("Adding numbers with different digits", () => {
    expect(add("1000", "0.1")).toBe("1000.1");
    expect(add("0.001", "999.999")).toBe("1000");
  });
});
