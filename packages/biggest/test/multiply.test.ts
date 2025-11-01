import multiply from "../src/multiply";

describe("multiply function test", () => {
  test("Multiplying positive numbers", () => {
    expect(multiply("2", "3")).toBe("6");
    expect(multiply("10", "5")).toBe("50");
    expect(multiply("123", "456")).toBe("56088");
  });

  test("Multiplying negative numbers", () => {
    expect(multiply("-2", "3")).toBe("-6");
    expect(multiply("2", "-3")).toBe("-6");
    expect(multiply("-2", "-3")).toBe("6");
  });

  test("Multiplying with zero", () => {
    expect(multiply("0", "5")).toBe("0");
    expect(multiply("10", "0")).toBe("0");
    expect(multiply("0", "0")).toBe("0");
  });

  test("Multiplying decimal numbers", () => {
    expect(multiply("0.5", "2")).toBe("1");
    expect(multiply("1.5", "2.5")).toBe("3.75");
    expect(multiply("0.1", "0.1")).toBe("0.01");
  });

  test("Multiplying large numbers", () => {
    expect(multiply("999999999", "999999999")).toBe("999999998000000001");
    expect(multiply("1234567890", "9876543210")).toBe("12193263111263526900");
    expect(
      multiply(
        "123456789012345678901234567890",
        "987654321098765432109876543210"
      )
    ).toBe("121932631137021795226185032733622923332237463801111263526900");
  });

  test("Multiplying with one", () => {
    expect(multiply("1", "5")).toBe("5");
    expect(multiply("10", "1")).toBe("10");
    expect(multiply("-1", "5")).toBe("-5");
  });

  test("Multiplying numbers with many decimal places", () => {
    expect(multiply("0.1234567890", "0.9876543210")).toBe(
      "0.121932631112635269"
    );
    expect(multiply("1.23456789", "9.87654321")).toBe("12.1932631112635269");
  });

  test("Various combinations", () => {
    expect(multiply("-0.5", "2.5")).toBe("-1.25");
    expect(multiply("100", "0.01")).toBe("1");
    expect(multiply("-0.1", "-10")).toBe("1");
  });
});
