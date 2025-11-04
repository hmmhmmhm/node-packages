# 🔀 pseudo-shuffle

[![Wiki](https://img.shields.io/badge/📖_Wiki-deepwiki-blue)](https://deepwiki.com/hmmhmmhm/node-packages)
[![Actual Image](https://i.imgur.com/w1Iz3h1.png)](https://i.imgur.com/w1Iz3h1.png)

[![Pseudo Shuffle](https://hmart.app/ko/pseudo-shuffle/og.png)](https://hmart.app/ko/pseudo-shuffle)

**[🔗 Showcase and Introduction Page](https://hmart.app/ko/pseudo-shuffle)**

> 📜 Make the index look like it is shuffled according to the range so that it is not conflicted without the actual shuffle.

<br>

## 🚀 Usage

### 1. Install

```bash
npm install pseudo-shuffle
```

### 2. **Browser and Node.js Support**

This package works in both Node.js and browser environments!

**Node.js:**
```ts
import { encode, decode } from "pseudo-shuffle";
```

**Browser (ESM):**
```html
<script type="module">
  import { encode, decode } from 'pseudo-shuffle';
  // Use encode/decode - they return Promises in the browser
</script>
```

**Note:** In the browser, `encode` and `decode` are **async functions** that return Promises. Make sure to use `await` or `.then()` when calling them.

### 3. **Basic Encode - Decode Example**

**Node.js (synchronous):**
```ts
import { encode, decode } from "pseudo-shuffle";

const encoded = encode({
  min: 0,
  max: 100,
  index: 3,
});
console.log(`encoded:`, encoded);
// encoded: 29

const decoded = decode({
  min: 0,
  max: 100,
  index: encoded,
});
console.log(`decoded:`, decoded);
// decoded: 3
```

**Browser (asynchronous):**
```ts
import { encode, decode } from "pseudo-shuffle";

const encoded = await encode({
  min: 0,
  max: 100,
  index: 3,
});
console.log(`encoded:`, encoded);
// encoded: 29

const decoded = await decode({
  min: 0,
  max: 100,
  index: encoded,
});
console.log(`decoded:`, decoded);
// decoded: 3
```

### 4. **7 Length Base 36 Shuffle Example**

```ts
import { encode, decode } from "pseudo-shuffle";

const privateKey = "something-secret-any-string-like-this!";

const encoded = encode({
  min: 0,
  max: 36 ** 7 - 1,
  index: 3,
  privateKey,
});
console.log(`encoded:`, encoded.toString(36));
// encoded: ltne180

const decoded = decode({
  min: 0,
  max: 36 ** 7 - 1,
  index: encoded,
  privateKey,
});
console.log(`decoded:`, decoded);
// decoded: 3
```

## ⚠️ Caution

1. `pseudo-shuffle` is pseudo random, not truly random. As a result, the library can encode or decode the shuffled sequence on the fly without having to remember all the shuffled values.
2. Algorithm can be applied only when the difference between the min and max values is at least 4. In this case, it doesn't throw an error, it just doesn't apply the shuffle.
3. The private and public keys are set to their defaults. If you want more security, set the privateKey.
4. **Browser compatibility:** In browser environments, `encode` and `decode` are async functions (return Promises) because they use the Web Crypto API. In Node.js, they remain synchronous.
5. **Browser requirements:** The browser version requires support for Web Crypto API (available in all modern browsers).
6. This library was developed to make it easier to use the [node-fe1-fpe](https://github.com/eCollect/node-fe1-fpe) library without a lot of exception handling, and the real genius is the person who wrote it.

<br>

## 🧪 Testing

The package includes comprehensive test suites for both Node.js and browser environments:

```bash
# Run all tests
pnpm test

# Tests include:
# - Node.js tests: Synchronous version tests
# - Browser tests: Async version tests with Web Crypto API
```

All 41 tests cover:
- Basic encode/decode functionality
- Edge cases and boundary values
- Custom key handling
- Large range support
- Browser-specific async operations

## ✅ License

> MIT Licensed.
