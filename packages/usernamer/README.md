# Usernamer

Generate memorable usernames from numbers using multi-level word combinations in Korean and English.

## Features

- **Deterministic**: Same number always generates the same username
- **Multi-language**: Supports Korean and English
- **Tree-shakable**: Only loads the language data you need
- **Universal**: Works in both Node.js and browsers
- **Type-safe**: Written in TypeScript with full type definitions
- **Large range**: Supports 0 to 100,000,000+ (1억+)

## Installation

```bash
npm install usernamer
# or
pnpm add usernamer
# or
yarn add usernamer
```

## Usage

### CLI

You can use the CLI to quickly test encoding and decoding (default language: English):

```bash
# Encode a number to username (default: English)
npx usernamer encode 12345
# Output: wearing hat calm bumblebee

# Encode with Korean
npx usernamer encode 12345 --language korean
npx usernamer encode 12345 -l ko
# Output: 모자를 쓴 평온한 웰시코기

# Decode a username back to number
npx usernamer decode "adorable alpaca"
# Output: 100

# Decode Korean username
npx usernamer decode "귀여운 알파카" --language korean
npx usernamer decode "귀여운 알파카" -l ko
# Output: 100

# Show encoding information
npx usernamer info

# Show help
npx usernamer --help
```

**Language Options:**
- `--language korean` or `-l ko` for Korean
- `--language english` or `-l en` for English (default)

### Basic Example

```typescript
// English (default)
import { encode, decode } from 'usernamer';

encode(0);           // "alpaca"
encode(100);         // "adorable alpaca"
encode(10000);       // "wearing hat alpaca"
encode(1000000);     // "sunny day alpaca"

// Decode usernames back to numbers
decode("alpaca");                // 0
decode("adorable alpaca");       // 100
decode("sunny day alpaca");      // 1000000
```

### Korean Support

```typescript
// Korean
import { encode, decode } from 'usernamer/ko';

encode(0);           // "알파카"
encode(100);         // "귀여운 알파카"
encode(10000);       // "모자를 쓴 알파카"
encode(1000000);     // "맑은 날 알파카"

// Decode
decode("알파카");                // 0
decode("귀여운 알파카");          // 100
decode("맑은 날 알파카");        // 1000000
```

**Bundle Size:**
- `usernamer` (English): ~3.4 KB gzipped
- `usernamer/ko` (Korean): ~4.1 KB gzipped

### Overflow Handling

For numbers >= 100,000,000 (1억), a numeric suffix is automatically added:

```typescript
// English
import { encode, decode } from 'usernamer';
encode(100000000);   // "winter day alpaca 0"
encode(123456789);   // "snowy day holding letter clever seahorse 9"

// Korean
import { encode as encodeKo, decode as decodeKo } from 'usernamer/ko';
encodeKo(100000000);   // "겨울날의 알파카 0"
encodeKo(123456789);   // "눈 오는 날의 편지를 든 총명한 해마 9"
```

### Utility Functions

```typescript
import { getMaxCombinableIndex, requiresSuffix } from 'usernamer';

// Get maximum index without numeric suffix
getMaxCombinableIndex();  // 100000000

// Check if an index requires a suffix
requiresSuffix(99999999);   // false
requiresSuffix(100000000);  // true
```

## How It Works

The generator uses 4 levels of words, each containing 100 items:

- **Level 1**: Base nouns (animals, objects)
- **Level 2**: Adjectives (cute, lovely, etc.)
- **Level 3**: Actions or accessories (wearing a hat, holding a flower, etc.)
- **Level 4**: Contexts or themes (sunny day, spring season, etc.)

Numbers are encoded in base-100 using these levels:

```
index = level4 × 100³ + level3 × 100² + level2 × 100 + level1
```

### Korean Format
```
"level4 level3 level2 level1"
"맑은 날 모자를 쓴 귀여운 알파카"
```

### English Format
```
"level4 level3 level2 level1"
"sunny day hat-wearing adorable alpaca"
```

## API

### `encode(index: number, language?: Language): string`

Encodes a number into a memorable username.

- **index**: Number to encode (0 to any positive integer)
- **language**: `'korean'` or `'english'` (default: `'korean'`)
- **Returns**: Generated username

### `decode(username: string, language?: Language): number`

Decodes a username back to its original number.

- **username**: Username to decode
- **language**: `'korean'` or `'english'` (default: `'korean'`)
- **Returns**: Original index number

### `getMaxCombinableIndex(): number`

Returns the maximum index that can be encoded without a numeric suffix (100,000,000).

### `requiresSuffix(index: number): boolean`

Checks if an index will require a numeric suffix.

## Browser Support

The package works in all modern browsers that support ES modules.

```html
<script type="module">
  // English (default)
  import { encode } from 'https://unpkg.com/usernamer/dist/index.modern.js';
  
  const username = encode(12345);
  console.log(username);  // "wearing crown sugary lizard"
</script>

<script type="module">
  // Korean
  import { encode } from 'https://unpkg.com/usernamer/dist/ko/usernamer.js';
  
  const username = encode(12345);
  console.log(username);  // "왕관을 쓴 감미로운 북극토끼"
</script>
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Test
pnpm run test

# Watch mode
pnpm run watch
```

## License

MIT

## Author

hmmhmmhm
