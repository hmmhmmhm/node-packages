# Base6000

A base-6000 encoding/decoding library using 6000 English words. Convert numbers to memorable word sequences.

## Encoding Capacity

The number of unique values that can be represented grows exponentially with the number of words:

| Words | Possible Combinations | Equivalent Bits |
|-------|----------------------|-----------------|
| 1 Word    | 6 Thousand (6,000) | ~12.55 bits     |
| 2 Word    | 36 Million (36,000,000) | ~25.10 bits     |
| 3 Word    | 216 Billion (216,000,000,000) | ~37.65 bits     |
| 4 Word    | 1.296 Quadrillion (1,296,000,000,000,000) | ~50.20 bits     |
| 5 Word    | 7.776 Quintillion (7,776,000,000,000,000,000) | ~62.75 bits     |
| 6 Word    | 46.66 Sextillion (46,660,000,000,000,000,000,000) | ~75.30 bits     |
| 7 Word    | 280 Septillion (280,000,000,000,000,000,000,000,000) | ~87.85 bits     |
| 8 Word    | 1.68 Nonillion (1,680,000,000,000,000,000,000,000,000,000) | ~100.40 bits    |
| 9 Word    | 10.08 Decillion (10,080,000,000,000,000,000,000,000,000,000,000) | ~112.95 bits    |
| 10 Word    | 60.48 Undecillion (60,480,000,000,000,000,000,000,000,000,000,000,000) | ~125.50 bits    |
| 11 Word    | 362.9 Tredecillion (362,900,000,000,000,000,000,000,000,000,000,000,000,000) | ~138.05 bits    |

For comparison:
- **UUID (128 bits)**: ~10.2 words in base6000
- **SHA-256 (256 bits)**: ~20.4 words in base6000
- **64-bit integer**: ~5.1 words in base6000

### Encoding Examples

```bash
npx base6000 encode 123456
# Output: u-meeting

npx base6000 encode 999999
# Output: hub-calendar

npx base6000 encode 1234567892
# Output: go-swift-woods

npx base6000 encode 9876543210
# Output: tom-column-element

npx base6000 encode 373493284239852352787678
# Output: i-de-figures-divided-bizrate-continues-enforcement
```

## Features

- **Encode/Decode Numbers**: Convert numbers to base-6000 word representation
- **BigInt Support**: Handle arbitrarily large numbers
- **6000 English Words**: Memorable and pronounceable word dictionary
- **Fast & Efficient**: Optimized encoding/decoding algorithms
- **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install base6000
# or
pnpm add base6000
# or
yarn add base6000
```

## Quick Start

### CLI Usage

```bash
# Using npx (no installation required)
npx base6000 encode 123456
npx base6000 decode "u-meeting"

# After installation
base6000 encode 123456
base6000 decode "u-meeting"
```

### Programmatic Usage

```typescript
import { encode, decode, getWord } from 'base6000';

// Basic encoding
encode(123456);           // 'u-meeting'
decode('u-meeting');      // 123456n

// Get word at specific index
getWord(0);               // 'a'
getWord(20);              // 'u'
```

## API Reference

### `encode(num: number | bigint | string, separator?: string): string`

Encode a number to base-6000 word representation.

**Important**: For numbers larger than `Number.MAX_SAFE_INTEGER` (2^53-1), use `BigInt` or `string` to avoid precision loss.

```typescript
encode(0);                // 'a'
encode(6000);             // 'b-a'
encode(123456);           // 'u-meeting'
encode(123456, '_');      // 'u_meeting' (custom separator)

// Large numbers - use string or BigInt
encode('373493284239852352787678');  // 'i-de-figures-divided-bizrate-continues-enforcement'
encode(373493284239852352787678n);   // Same result

// Unsafe number will throw error
encode(9007199254740992);  // ❌ Error: exceeds safe integer range
encode('9007199254740992'); // ✅ Works correctly
```

### `decode(encoded: string, separator?: string): bigint`

Decode a base-6000 word representation back to a number.

```typescript
decode('a');              // 0n
decode('b-a');            // 6000n
decode('u-meeting');      // 123456n
decode('U-MEETING');      // 123456n (case-insensitive)

// Auto-detects separators
decode('high-categories-are-momentum');  // Works with hyphen
decode('high_categories_are_momentum');  // Works with underscore
decode('high categories are momentum');  // Works with space
```

### `getWord(index: number): string`

Get the word at a specific index (0-5999).

```typescript
getWord(0);               // 'a'
getWord(1);               // 'b'
getWord(26);              // 'ai'
getWord(20);              // 'u'
```

## CLI Usage

The package includes a command-line interface for quick encoding/decoding.

### Installation

```bash
# Global installation
npm install -g base6000

# Or use with npx (no installation required)
npx base6000 --help
```

### Commands

```bash
# Encode a number
base6000 encode <number> [options]

# Decode a string
base6000 decode <encoded> [options]
```

### Options

- `--separator <sep>` - Custom separator (default: '-')
- `-h, --help` - Show help message

### Examples

```bash
# Basic encoding
base6000 encode 123456
# Output: u-meeting

# Custom separator
base6000 encode 123456 --separator _
# Output: u_meeting

# Decoding
base6000 decode "u-meeting"
# Output: 123456

# Decoding with auto-detected separator
base6000 decode "u meeting"
# Output: 123456

# Large numbers
base6000 encode 987654321
# Output: am-rebate-auto
```

## Use Cases

### Memorable Identifiers

```typescript
import { encode, decode } from 'base6000';

// Convert timestamp to memorable identifier
const timestamp = Date.now();
const memorable = encode(timestamp);
console.log(`Session ID: ${memorable}`);

// Decode back to timestamp
const decoded = decode(memorable);
```

### Large Number Encoding

```typescript
import { encode, decode } from 'base6000';

// Encode very large numbers
const largeNumber = '373493284239852352787678';
const encoded = encode(largeNumber);
// 'i-de-figures-divided-bizrate-continues-enforcement'

const decoded = decode(encoded);
// 373493284239852352787678n
```

## How It Works

Base6000 works like any positional numeral system (like binary, decimal, or hexadecimal), but uses 6000 as the base instead of 2, 10, or 16.

- **Base-10 (Decimal)**: Uses digits 0-9
- **Base-16 (Hexadecimal)**: Uses digits 0-9 and A-F
- **Base-6000**: Uses 6000 English words

### Example

The number `123456` in base-6000:

```
123456 ÷ 6000 = 20 remainder 3456
20 ÷ 6000 = 0 remainder 20

Reading remainders from bottom to top: [20, 3456]
Word at index 20: 'U'
Word at index 3456: 'Lvi'

Result: 'U-Lvi'
```

### Advantages

- **Memorable**: Words are easier to remember than random characters
- **Pronounceable**: Can be spoken and communicated verbally
- **Compact**: More efficient than base-64 for large numbers
- **URL-Safe**: No special characters needed
- **Human-Friendly**: Suitable for OTP codes and user-facing identifiers

## Performance

The library is optimized for performance:

- Encoding/decoding operations complete in < 1ms for most numbers
- Supports BigInt for arbitrarily large numbers
- Efficient Map-based lookup for decoding
- Zero dependencies

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { encode, decode } from 'base6000';

// All functions are fully typed
const encoded: string = encode(123456);
const decoded: bigint = decode(encoded);
```

## Error Handling

The library throws descriptive errors for invalid inputs:

```typescript
encode(-1);                    // Error: Only non-negative numbers can be encoded
encode(3.14);                  // Error: Only integers can be encoded
decode('');                    // Error: Encoded string cannot be empty
decode('InvalidWord');         // Error: Invalid word in encoded string
getWord(6000);                 // Error: Index must be between 0 and 5999
```

## Browser Support

Works in all modern browsers and Node.js environments that support:
- ES2020+
- BigInt

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

hmmhmmhm

## Repository

https://github.com/hmmhmmhm/node-packages/tree/main/packages/base6000
