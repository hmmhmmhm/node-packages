import subtract from "../src/subtract";

describe("subtract function test", () => {
  test("Subtracting positive numbers", () => {
    expect(subtract("123", "456")).toBe("-333");
    expect(subtract("1000", "1")).toBe("999");
    expect(subtract("9999", "9998")).toBe("1");
  });

  test("Subtracting negative numbers", () => {
    expect(subtract("-5", "-3")).toBe("-2");
    expect(subtract("-10", "5")).toBe("-15");
    expect(subtract("10", "-5")).toBe("15");
  });

  test("Subtracting zero", () => {
    expect(subtract("0", "0")).toBe("0");
    expect(subtract("10", "0")).toBe("10");
    expect(subtract("0", "10")).toBe("-10");
    expect(subtract("-5", "0")).toBe("-5");
  });

  test("Subtracting decimal numbers", () => {
    expect(subtract("3.14", "2.14")).toBe("1");
    expect(subtract("-1.5", "0.5")).toBe("-2");
    expect(subtract("0.3", "0.1")).toBe("0.2");
    expect(subtract("0.8", "0.7")).toBe("0.1");
  });

  test("Subtracting large numbers", () => {
    expect(subtract("10000000000000000", "1")).toBe("9999999999999999");
    expect(subtract("9876543210987654321", "1234567890123456789")).toBe(
      "8641975320864197532"
    );
  });

  test("Subtracting numbers with different digits", () => {
    expect(subtract("1000", "0.1")).toBe("999.9");
    expect(subtract("1000", "999.999")).toBe("0.001");
  });

  test("Subtracting resulting in negative numbers", () => {
    expect(subtract("100", "200")).toBe("-100");
    expect(subtract("0.1", "0.2")).toBe("-0.1");
  });
});
