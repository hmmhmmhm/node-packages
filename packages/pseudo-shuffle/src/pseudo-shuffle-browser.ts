import * as fe1 from "./fe1-browser";

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

export const encode = async ({
  index,
  min,
  max,
  privateKey = defaultKey,
  publicKey = defaultKey,
}: IPsuedoShuffleOption): Promise<number> => {
  // Validate inputs
  if (!Number.isFinite(index) || !Number.isInteger(index)) {
    throw new Error(`Invalid index: ${index}. Must be a finite integer.`);
  }
  if (!Number.isFinite(min) || !Number.isInteger(min)) {
    throw new Error(`Invalid min: ${min}. Must be a finite integer.`);
  }
  if (!Number.isFinite(max) || !Number.isInteger(max)) {
    throw new Error(`Invalid max: ${max}. Must be a finite integer.`);
  }
  if (min >= max) {
    throw new Error(`Invalid range: min (${min}) must be less than max (${max}).`);
  }

  // Algorithm can be applied only when the difference
  // between the min and max values is at least 4.
  if (max - min < 3) return index;

  // Algorithms can only be applied when the
  // range difference between min and max is prime number.
  // Therefore, when the range difference is not prime number,
  // the algorithm is applied while leaving the last index intact.
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
    (await fe1.encrypt(
      max - min + 1,
      index - min,
      privateKey,
      publicKey
    )) + min
  );
};

export const decode = async ({
  index,
  min,
  max,
  privateKey = defaultKey,
  publicKey = defaultKey,
}: IPsuedoShuffleOption): Promise<number> => {
  // Validate inputs
  if (!Number.isFinite(index) || !Number.isInteger(index)) {
    throw new Error(`Invalid index: ${index}. Must be a finite integer.`);
  }
  if (!Number.isFinite(min) || !Number.isInteger(min)) {
    throw new Error(`Invalid min: ${min}. Must be a finite integer.`);
  }
  if (!Number.isFinite(max) || !Number.isInteger(max)) {
    throw new Error(`Invalid max: ${max}. Must be a finite integer.`);
  }
  if (min >= max) {
    throw new Error(`Invalid range: min (${min}) must be less than max (${max}).`);
  }

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
      (await encode({
        index: Math.ceil(min + (max - min) / 2),
        max,
        min,
        privateKey,
        publicKey,
      }))
    )
      return max + 1;
  }
  return (
    (await fe1.decrypt(
      max - min + 1,
      index - min,
      privateKey,
      publicKey
    )) + min
  );
};
