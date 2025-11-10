# Base2000

A base-N encoding/decoding library using colorful emojis. Convert numbers to memorable emoji sequences.

**Note**: This package uses 2,000 carefully selected colorful emojis that render properly across all platforms. Only emojis that display in full color (not undefined codepoints) are included.

## Encoding Capacity

The number of unique values that can be represented grows exponentially with the number of emojis (Base: 2,000):

| Emojis | Possible Combinations | Equivalent Bits |
|--------|----------------------|-----------------|
| 1 Emoji    | 2,000 | ~10.97 bits     |
| 2 Emojis   | 4.00 Million | ~21.93 bits     |
| 3 Emojis   | 8.00 Billion | ~32.90 bits     |
| 4 Emojis   | 16.0 Trillion | ~43.86 bits     |
| 5 Emojis   | 32.0 Quadrillion | ~54.83 bits     |
| 6 Emojis   | 64.0 Quintillion | ~65.79 bits     |
| 7 Emojis   | 128 Sextillion | ~76.76 bits     |
| 8 Emojis   | 256 Octillion | ~87.72 bits     |
| 9 Emojis   | 512 Nonillion | ~98.69 bits    |
| 10 Emojis  | 1.02 Decillion | ~109.66 bits    |
| 11 Emojis  | 2.05 Undecillion | ~120.62 bits    |
| 12 Emojis  | 4.10 Duodecillion | ~131.59 bits    |

### Encoding Examples

```bash
npx base2000 encode 2000
# Output: 😁😀

npx base2000 encode 38557435
# Output: 😇🤹🏾🔱

npx base2000 encode 89752472641731123
# Output: 😁🤙🏽🥊🃁🇨🇲👔

npx base2000 encode 9875895267443635214141
# Output: 🌃🚴🏼👯↙️🪢📡

npx base2000 encode 43785237458756783457242745611
# Output: 🙋🏄🏿😾🏃🗝🥾🦸👆🏻‼️

npx base2000 encode 525421411452342311245233457643456
# Output: 👚🌿💪⤵️🥾🇦🇽📩🙏🏻🫓👧🏿
```

## Features

- **Encode/Decode Numbers**: Convert numbers to base-2000 emoji representation
- **BigInt Support**: Handle arbitrarily large numbers
- **Fast & Efficient**: Optimized encoding/decoding algorithms
- **TypeScript**: Full TypeScript support with type definitions
- **Visual & Fun**: Use emojis for memorable identifiers

## Installation

```bash
npm install base2000
# or
pnpm add base2000
# or
yarn add base2000
```

## Quick Start

### CLI Usage

```bash
# Using npx (no installation required)
npx base2000 encode 123456
npx base2000 decode "🤮😌"

# After installation
base2000 encode 123456
base2000 decode "🤮😌"
```

### Programmatic Usage

```typescript
import { encode, decode, getEmoji } from 'base2000';

// Basic encoding
encode(123456);           // '🤮😌'
decode('🤮😌');           // 123456n

// Get emoji at specific index
getEmoji(0);              // '😀'
getEmoji(20);             // '😔'
```

## API Reference

### `encode(num: number | bigint | string, separator?: string): string`

Encode a number to base-2000 emoji representation.

**Important**: For numbers larger than `Number.MAX_SAFE_INTEGER` (2^53-1), use `BigInt` or `string` to avoid precision loss.

```typescript
encode(0);                // '😀'
encode(2000);             // '😁😀'
encode(123456);           // '😲🚶🏽'
encode(123456, ' ');      // '😲 🚶🏽' (custom separator)

// Large numbers - use string or BigInt
encode('373493284239852352787678');  // Works correctly
encode(373493284239852352787678n);   // Same result

// Unsafe number will throw error
encode(9007199254740992);  // ❌ Error: exceeds safe integer range
encode('9007199254740992'); // ✅ Works correctly
```

### `decode(encoded: string, separator?: string): bigint`

Decode a base-2000 emoji representation back to a number.

```typescript
decode('😀');             // 0n
decode('😁😀');           // 2000n
decode('😲🚶🏽');         // 123456n

// With separator
decode('😲 🚶🏽', ' ');   // 123456n
decode('😲-🚶🏽', '-');   // 123456n
```

### `getEmoji(index: number): string`

Get the emoji at a specific index (0-1999).

```typescript
getEmoji(0);              // '😀'
getEmoji(1);              // '😁'
getEmoji(2);              // '😂'
```

### `getEmojiIndex(emoji: string): number`

Get the index of a specific emoji.

```typescript
getEmojiIndex('😀');      // 0
getEmojiIndex('😁');      // 1
getEmojiIndex('😂');      // 2
getEmojiIndex('unknown'); // -1
```

### `getBase(): number`

Get the total number of emojis in the base.

```typescript
getBase();                // 2000
```

## CLI Usage

The package includes a command-line interface for quick encoding/decoding.

### Installation

```bash
# Global installation
npm install -g base2000

# Or use with npx (no installation required)
npx base2000 --help
```

### Commands

```bash
# Encode a number
base2000 encode <number> [options]

# Decode a string
base2000 decode <encoded> [options]
```

### Options

- `--separator <sep>` - Custom separator (default: none)
- `-h, --help` - Show help message

### Examples

```bash
# Basic encoding
base2000 encode 123456
# Output: 🤮😌

# Custom separator
base2000 encode 123456 --separator " "
# Output: 🤮 😌

# Decoding
base2000 decode "🤮😌"
# Output: 123456

# Decoding with separator
base2000 decode "🤮 😌" --separator " "
# Output: 123456

# Large numbers
base2000 encode 987654321
# Output: 🥳🥳🤪😡
```

## Use Cases

### Memorable Identifiers

```typescript
import { encode, decode } from 'base2000';

// Convert timestamp to memorable emoji identifier
const timestamp = Date.now();
const memorable = encode(timestamp);
console.log(`Session ID: ${memorable}`);

// Decode back to timestamp
const decoded = decode(memorable);
```

### URL Shortening

```typescript
import { encode } from 'base2000';

// Convert database ID to emoji-based short URL
const dbId = 123456789;
const shortCode = encode(dbId);
console.log(`Short URL: https://example.com/${shortCode}`);
// Output: https://example.com/😍🥳🤪😌
```

### Large Number Encoding

```typescript
import { encode, decode } from 'base2000';

// Encode very large numbers
const largeNumber = '373493284239852352787678';
const encoded = encode(largeNumber);
console.log(encoded); // Emoji representation

const decoded = decode(encoded);
console.log(decoded); // 373493284239852352787678n
```

## How It Works

Base2000 works like any positional numeral system (like binary, decimal, or hexadecimal), but uses 2000 as the base instead of 2, 10, or 16.

- **Base-10 (Decimal)**: Uses digits 0-9
- **Base-16 (Hexadecimal)**: Uses digits 0-9 and A-F
- **Base-2000**: Uses 2000 emojis

### Example

The number `123456` in base-2000:

```
123456 ÷ 2000 = 61 remainder 1456
61 ÷ 2000 = 0 remainder 61

Reading remainders from bottom to top: [61, 1456]
Emoji at index 61: (emoji at position 61)
Emoji at index 1456: (emoji at position 1456)

Result: (corresponding emoji sequence)
```

### Advantages

- **Visual**: Emojis are more visually distinctive than alphanumeric characters
- **Memorable**: Emoji sequences can be easier to remember
- **Fun**: Makes identifiers more engaging and user-friendly
- **Compact**: More efficient than base-64 for large numbers

## Performance

The library is optimized for performance:

- Encoding/decoding operations complete in < 1ms for most numbers
- Supports BigInt for arbitrarily large numbers
- Efficient Map-based lookup for decoding
- Zero dependencies

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { encode, decode } from 'base2000';

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
decode('invalid');             // Error: Invalid emoji in encoded string
getEmoji(3000);                // Error: Index must be between 0 and 1999
```

## Browser Support

Works in all modern browsers and Node.js environments that support:
- ES2020+
- BigInt
- Unicode/Emoji support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

hmmhmmhm

## Repository

https://github.com/hmmhmmhm/node-packages/tree/main/packages/base2000
