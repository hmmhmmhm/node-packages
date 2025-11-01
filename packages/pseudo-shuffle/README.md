# 🔀 pseudo-shuffle

[![Actual Image](https://i.imgur.com/w1Iz3h1.png)](https://i.imgur.com/w1Iz3h1.png)

> 📜 Make the index look like it is shuffled according to the range so that it is not conflicted without the actual shuffle.

<br>

## 🚀 Usage

### 1. Install

```bash
npm install pseudo-shuffle
```

### 2. **Basic Encode - Decode Example**

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

### 3. **7 Length Base 36 Shuffle Example**

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
4. This library was developed to make it easier to use the [node-fe1-fpe](https://github.com/eCollect/node-fe1-fpe) library without a lot of exception handling, and the real genius is the person who wrote it.

<br>

## ✅ License

> MIT Licensed.
