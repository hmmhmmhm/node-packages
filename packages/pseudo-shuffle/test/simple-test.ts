import { encode, decode } from "pseudo-shuffle";

describe("pseudo-shuffle", () => {
  it("Should be same value (-8 ~ 102)", () => {
    for (let index = -8; index <= 102; index++) {
      const encoded = encode({
        min: -5,
        max: 100,
        index,
      });
      const decoded = decode({
        min: -5,
        max: 100,
        index: encoded,
      });

      expect(decoded).toBe(index);
    }
  });
});
