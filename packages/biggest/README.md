# 🔢 biggest

[![Wiki](https://img.shields.io/badge/📖_Wiki-deepwiki-blue)](https://deepwiki.com/hmmhmmhm/node-packages)

[![Biggest](https://hmart.app/en/biggest/og.png)](https://hmart.app/biggest)

**[🔗 Showcase and Introduction Page](https://hmart.app/biggest)**

> Tiny 2kb, zero deps, infinite precision: Biggest for all your big integer + big decimal needs.

Biggest is a `Lightweight`, `Zero Dependency` JavaScript library for safe and precise arithmetic operations on `Big Integer` + `Big Decimal`. It excels at handling both Big Decimal and Big Integer computations with ease. 🧮

## Features 🌟

- 🔢 **Complete Big Number Suite**: Basic arithmetic (add, subtract, multiply, divide, abs)
- 📊 **Advanced Comparisons**: compare, min, max, equality checks
- 🔄 **Rounding Operations**: floor, ceil, round, truncate with custom precision
- ⚡ **Power Operations**: exponentiation, square root, nth root calculations
- 🧮 **Modular Arithmetic**: mod, gcd, lcm with proper mathematical semantics
- 🎲 **Combinatorics**: factorial, combinations, permutations for large numbers
- 🔒 **Zero Dependencies**: Pure string-based implementation, no external libraries
- 🪶 **Lightweight**: Only 2kb in size
- 💻 **Full TypeScript Support**: Complete type definitions included
- 🎯 **Infinite Precision**: Handle arbitrarily large integers and precise decimals
- 🔀 **Seamless Integration**: Works with both Big Decimal and Big Number operations

## Installation 📥

```bash
npm install biggest
```

## Usage 🚀

### Basic Arithmetic

```javascript
import { add, subtract, multiply, divide } from "biggest";

console.log(add("10000000000000000000000", "0.00000000005"));
// '10000000000000000000000.00000000005'

console.log(subtract("-9999999999999999999999.9", "0.1"));
// '-10000000000000000000000'

console.log(multiply("123456789123456789", "0.000000001"));
// '123456789.123456789'

console.log(divide("1000000000000000000000", "0.1"));
// '10000000000000000000000'
```

### Advanced Operations

```javascript
import {
  compare,
  min,
  max,
  floor,
  ceil,
  round,
  pow,
  sqrt,
  nthRoot,
  mod,
  gcd,
  lcm,
  factorial,
} from "biggest";

// Comparison operations
console.log(compare("123.456", "123.457")); // -1 (less than)
console.log(min("999999999999999999999", "1000000000000000000000")); // '999999999999999999999'
console.log(max("5.67", "5.68", "5.69")); // '5.69'

// Rounding operations
console.log(floor("5.99")); // '5'
console.log(ceil("5.01")); // '6'
console.log(round("5.5")); // '6'

// Power operations
console.log(pow("2", "100")); // '1267650600228229401496703205376'
console.log(sqrt("2")); // '1.41421356237309504880'
console.log(nthRoot("27", "3")); // '3'

// Modular arithmetic
console.log(mod("17", "5")); // '2'
console.log(gcd("48", "18")); // '6'
console.log(lcm("12", "18")); // '36'

// Factorial and combinatorics
console.log(factorial("10")); // '3628800'
```

## API 📚

### Basic Arithmetic Operations

#### `add(left: string, right: string): string`

Adds two numbers represented as strings.

#### `subtract(left: string, right: string): string`

Subtracts the second number from the first, both represented as strings.

#### `multiply(left: string, right: string): string`

Multiplies two numbers represented as strings.

#### `divide(left: string, right: string, precision: number = 20): string`

Divides the first number by the second, both represented as strings. The `precision` parameter determines the number of decimal places in the result (default is 20).

#### `abs(num: string): string`

Returns the absolute value of a number.

### Comparison Operations

#### `compare(a: string, b: string): number`

Compares two numbers. Returns:

- `1` if a > b
- `-1` if a < b
- `0` if a == b

#### `isEqual(a: string, b: string): boolean`

Checks if two numbers are equal.

#### `isGreaterThan(a: string, b: string): boolean`

Checks if the first number is greater than the second.

#### `isLessThan(a: string, b: string): boolean`

Checks if the first number is less than the second.

#### `min(a: string, b: string, ...rest: string[]): string`

Returns the smallest number from the given arguments.

#### `max(a: string, b: string, ...rest: string[]): string`

Returns the largest number from the given arguments.

### Rounding Operations

#### `floor(num: string): string`

Rounds down to the nearest integer (towards negative infinity).

#### `ceil(num: string): string`

Rounds up to the nearest integer (towards positive infinity).

#### `round(num: string): string`

Rounds to the nearest integer using "round half up" strategy.

#### `truncate(num: string): string`

Removes the fractional part (rounds towards zero).

#### `roundToPrecision(num: string, precision: number): string`

Rounds to the specified number of decimal places.

### Power Operations

#### `pow(base: string, exponent: string): string`

Raises a number to an integer power. Supports negative exponents.

#### `sqrt(num: string, precision: number = 20): string`

Calculates the square root of a number using Newton's method.

#### `nthRoot(radicand: string, n: string, precision: number = 20): string`

Calculates the nth root of a number. The `n` parameter must be a positive integer.

### Modular Arithmetic

#### `mod(dividend: string, divisor: string): string`

Mathematical modulo operation. The result always has the same sign as the divisor.

#### `remainder(dividend: string, divisor: string): string`

Programming remainder operation. The result has the same sign as the dividend.

#### `gcd(a: string, b: string): string`

Calculates the Greatest Common Divisor using the Euclidean algorithm.

#### `lcm(a: string, b: string): string`

Calculates the Least Common Multiple using the formula: lcm(a,b) = |a×b| / gcd(a,b).

### Factorial and Combinatorics

#### `factorial(n: string): string`

Calculates the factorial of a non-negative integer (n!).

#### `combination(n: string, r: string): string`

Calculates the number of ways to choose r items from n items (nCr).

#### `permutation(n: string, r: string): string`

Calculates the number of ways to arrange r items from n items (nPr).

## Why Biggest? 🤔

JavaScript's native number type has limitations when dealing with very large numbers or high precision decimals. Biggest overcomes these limitations by:

- 🔢 Representing numbers as strings, allowing for arbitrary-length integers
- 🎯 Providing high-precision decimal arithmetic
- 🐛 Avoiding floating-point errors common in JavaScript's native math operations

## Performance 🚀

Biggest is optimized for performance while maintaining accuracy. It's suitable for applications requiring precise calculations with large numbers, such as financial systems, scientific computing, or cryptography.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 👏

- Thanks to all contributors who have helped shape Biggest
- Inspired by the need for reliable big number arithmetic in JavaScript
