export const runicChars = ["ᚠ", "ᚡ", "ᚢ", "ᚣ", "ᚤ", "ᚥ", "ᚦ", "ᚧ", "ᚨ", "ᚩ", "ᚪ", "ᚫ", "ᚬ", "ᚭ", "ᚮ", "ᚯ", "ᚰ", "ᚱ", "ᛦ", "ᚳ", "ᚴ", "ᚵ", "ᚶ", "ᛊ"];
export const oldPersianChars = ['𐎠', '𐎡', '𐎢', '𐎣', '𐎤', '𐎥', '𐎦', '𐎧', '𐎨', '𐎩', '𐎪', '𐎫', '𐎬', '𐎭', '𐎮', '𐎯', '𐎰', '𐎱', '𐎲', '𐎳', '𐎴', '𐎵', '𐎶', '𐎷'];
export const emojiChars = ["😀", "😂", "🥳", "🤖", "🧠", "🐶", "🐱", "🐸", "🐼", "🦊", "🐯", "🐵", "🐧", "🐙", "🐳", "🌈", "⚡️", "🔥", "☃️", "🌙", "⭐️", "🍕", "🎧", "🚀"];
export const latinVars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];
export type CharacterSet = 'runic' | 'oldPersian' | 'emoji' | 'none' | string[];
export interface CurseOptions {
  includePrelude?: boolean;
  characterSet?: CharacterSet;
}

const preludes = [
  `A='',`, // ''
  `B=!A+A,`, // 'true'
  `C=!B+A,`, // 'false'
  `D=A+{},`, // '[object Object]'
  `E=B[A++],`, // t
  `F=B[G=A],`, // r
  `H=++G+A,`, // 3
  `I=D[G+H],`, // constructor
  `J=B[(I+=D[A]+(B.C+D)[A]+C[H]+E+F+B[G]+I+E+D[A]+F)][I],`, // Function
  `K=D[G+G+H],`, // ' '
  `L=A+/\\\\/,`, // '1/\\/'
  `M=L[G],`, // '\'
  `N='"',`, // '"'
  `O=((G-G)+K)[G-G],`, // '0'
  `P=(A+K)[G-G],`, // '1'
  `Q=(G+K)[G-G],`, // '2'
  `R=(H+K)[G-G],`, // '3'
  `S=((H+G-A)+K)[G-G],`, // '4'
  `T=((H+G)+K)[G-G],`, // '5'
  `U=((H*G)+K)[G-G],`, // '6'
  `V=((H*G+A)+K)[G-G],`, // '7'
  `W=((H*H-A)+K)[G-G],`, // '8'
  `X=((H*H)+K)[G-G],`, // '9'
  `Y=F+B[H]+E+B[G]+F+(B.C+D)[A]+K,`, // 'return '
]

const charMap = {
  a: 'C[A]',
  b: 'D[G]',
  c: 'D[G+H]',
  e: 'B[H]',
  f: 'C[G-G]',
  j: 'D[H]',
  l: 'C[G]',
  n: '(B.C+D)[A]',
  o: 'D[A]',
  r: 'F',
  s: 'C[H]',
  t: 'E',
  u: 'B[A+A]',
  '0': 'O',
  '1': 'P',
  '2': 'Q',
  '3': 'R',
  '4': 'S',
  '5': 'T',
  '6': 'U',
  '7': 'V',
  '8': 'W',
  '9': 'X',
  ' ': 'K',
  '"': 'N',
  '\\': 'M',
};

const hexMap = ['O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'C[A]', 'D[G]', 'D[G+H]', 'J(Y+N+M+P+S+S+N)()', 'B[H]', 'C[G-G]'];

const buildUnicodeEscape = (hexString: string) => {
  const hexDigits = [
    hexMap[parseInt(hexString[0], 16)],
    hexMap[parseInt(hexString[1], 16)],
    hexMap[parseInt(hexString[2], 16)],
    hexMap[parseInt(hexString[3], 16)]
  ];
  return `J(Y+N+M+${charMap.u}+${hexDigits.join('+')}+N)()`;
};

const charToExpression = (character: string) => {
  if (charMap[character as keyof typeof charMap])
    return charMap[character as keyof typeof charMap];
  const codePoint = character.codePointAt(0);
  if (codePoint === undefined) return '';
  if (codePoint <= 0xFFFF) {
    const hexString = codePoint.toString(16).padStart(4, '0');
    return buildUnicodeEscape(hexString);
  } else {
    const highSurrogate = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
    const lowSurrogate = ((codePoint - 0x10000) % 0x400) + 0xDC00;
    const highSurrogateHex = highSurrogate.toString(16).padStart(4, '0');
    const lowSurrogateHex = lowSurrogate.toString(16).padStart(4, '0');
    const highExpression = buildUnicodeEscape(highSurrogateHex);
    const lowExpression = buildUnicodeEscape(lowSurrogateHex);
    return `${highExpression}+${lowExpression}`;
  }
};

function replaceWithCharacterSet(script: string, chars: string[]): string {
  if (chars.length < latinVars.length) {
    throw new Error(`Character set must contain at least ${latinVars.length} characters, but only ${chars.length} were provided.`);
  }

  let result = script;
  for (let i = 0; i < latinVars.length; i++) {
    const latinVar = latinVars[i];
    const replacementChar = chars[i];
    // Replace variable names with custom characters
    // Use word boundaries to avoid replacing parts of other identifiers
    const regex = new RegExp(`\\b${latinVar}\\b`, 'g');
    result = result.replace(regex, replacementChar);
  }
  return result;
}

export function curse(source: string, options: CurseOptions = {}) {
  const {
    includePrelude = true,
    characterSet = 'runic'
  } = options;

  const expressionParts = [];
  for (let index = 0; index < source.length;) {
    const codePoint = source.codePointAt(index);
    if (codePoint === undefined) break;
    const character = String.fromCodePoint(codePoint);
    expressionParts.push(charToExpression(character));
    index += character.length;
  }
  const script = `J(${expressionParts.join('+')})();`;
  const fullScript = includePrelude ? `${preludes.join('')}${script}\n` : script;

  // Handle characterSet option
  if (characterSet === 'none') {
    return fullScript;
  } else if (characterSet === 'runic') {
    return replaceWithCharacterSet(fullScript, runicChars);
  } else if (characterSet === 'oldPersian') {
    return replaceWithCharacterSet(fullScript, oldPersianChars);
  } else if (characterSet === 'emoji') {
    return replaceWithCharacterSet(fullScript, emojiChars);
  } else if (Array.isArray(characterSet)) {
    return replaceWithCharacterSet(fullScript, characterSet);
  } else {
    return fullScript;
  }
}
