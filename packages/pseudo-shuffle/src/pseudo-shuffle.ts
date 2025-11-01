import fe1 from "node-fe1-fpe";

export interface IPsuedoShuffleOption {
  /**
   * The starting value of the shuffleable range.
   */
  min: number;
  /**
   * The ending value of the shuffleable range.
   *
   * Algorithm can be applied only when the difference
   * between the min and max values is at least 4.
   */
  max: number;
  /**
   * The index value to be shuffled.
   */
  index: number;
  /**
   * The private key used to encrypt the index value.
   *
   * If not specified, the default value is used.
   * (**Default value:** `psuedo-shuffle`)
   */
  privateKey?: string;
  /**
   * The public key used to encrypt the index value.
   *
   * If not specified, the default value is used.
   * (**Default value:** `psuedo-shuffle`)
   */
  publicKey?: string;
}

const defaultKey = "psuedo-shuffle";

export const encode = ({
  index,
  min,
  max,
  privateKey,
  publicKey,
}: IPsuedoShuffleOption): number => {
  // Algorithm can be applied only when the difference
  // between the min and max values is at least 4.
  if (max - min < 3) return index;

  // Algorithms can only be applied when the
  // range difference between min and max is prime number.
  // Therefore, when the range difference is not prime number,
  // the algorithm is applied while leaving the last index intact.
  // if ((max - min) % 2 === 0) {
  //   if (index === max) return index
  //   --max
  // }
  if ((max - min) % 2 === 0) {
    const middle = Math.ceil(min + (max - min) / 2);
    if (index === middle) return max;
    if (index === max) index = middle;
    --max;
  }

  // Algorithm does not apply to index
  // values that are not in the range.
  if (index < min || index > max) return index;

  return (
    fe1.encrypt(
      max - min + 1,
      index - min,
      privateKey ?? defaultKey,
      publicKey ?? defaultKey
    ) + min
  );
};

export const decode = ({
  index,
  min,
  max,
  privateKey,
  publicKey,
}: IPsuedoShuffleOption): number => {
  // Algorithm can be applied only when the difference
  // between the min and max values is at least 4.
  if (max - min < 3) return index;

  // Algorithms can only be applied when the
  // range difference between min and max is prime number.
  // Therefore, when the range difference is not prime number,
  // the algorithm is applied while leaving the last index intact.

  const isNonPrime = (max - min) % 2 === 0;
  if (isNonPrime) {
    if (index > max - 1) {
      return Math.ceil(min + (max - min) / 2);
    }
    --max;
  }

  // Algorithm does not apply to index
  // values that are not in the range.
  if (index < min || index > max) return index;

  if (isNonPrime) {
    if (
      index ===
      encode({
        index: Math.ceil(min + (max - min) / 2),
        max,
        min,
        privateKey: privateKey ?? defaultKey,
        publicKey: publicKey ?? defaultKey,
      })
    )
      return max + 1;
  }
  return (
    fe1.decrypt(
      max - min + 1,
      index - min,
      privateKey ?? defaultKey,
      publicKey ?? defaultKey
    ) + min
  );
};
