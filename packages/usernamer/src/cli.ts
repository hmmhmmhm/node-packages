#!/usr/bin/env node

import { encode as encodeEn, decode as decodeEn, getMaxCombinableIndex } from './index';
import { encode as encodeKo, decode as decodeKo } from './ko';

type Language = 'korean' | 'english';

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
Usernamer - Generate memorable usernames from numbers

Usage:
  usernamer encode <number> [options]
  usernamer decode <username> [options]
  usernamer info

Commands:
  encode <number>     Encode a number to a memorable username
  decode <username>   Decode a username back to a number
  info                Show encoding information

Options:
  --language <lang>  Language to use: 'korean' or 'english' (default: english)
  -l <lang>          Short form of --language
  -h, --help         Show this help message

Examples:
  usernamer encode 12345
  usernamer encode 12345 --language korean
  usernamer encode 12345 -l korean
  usernamer decode "adorable alpaca"
  usernamer decode "귀여운 알파카" --language korean
  usernamer info

Note:
  - Maximum combinable index without suffix: ${getMaxCombinableIndex().toLocaleString()}
  - Indices >= ${getMaxCombinableIndex().toLocaleString()} will have a numeric suffix
  - Use quotes around usernames with spaces when decoding
`);
}

function showInfo() {
  const maxIndex = getMaxCombinableIndex();
  console.log(`
Usernamer Information
=====================

Encoding System:
  - Base-100 system with 4 levels
  - Each level has 100 words
  - Total combinations: ${maxIndex.toLocaleString()}

Levels:
  Level 1: Base nouns (animals, objects) - always included
  Level 2: Adjectives (cute, lovely, etc.)
  Level 3: Actions/accessories (wearing a hat, holding flowers, etc.)
  Level 4: Contexts/themes (sunny day, spring season, etc.)

Format:
  Korean:  "level4 level3 level2 level1"
  English: "level4 level3 level2 level1"

Examples:
  0       → "알파카" (alpaca)
  100     → "귀여운 알파카" (adorable alpaca)
  10000   → "모자를 쓴 알파카" (hat-wearing alpaca)
  1000000 → "맑은 날 알파카" (sunny day alpaca)

Overflow:
  - Indices >= ${maxIndex.toLocaleString()} get a numeric suffix
  - Example: ${maxIndex.toLocaleString()} → "야시장의 퍼즐 맞추는 깡충거리는 사자 1"
`);
}

function main() {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  if (command === 'info') {
    showInfo();
    process.exit(0);
  }

  // Parse language option
  const languageIndex = Math.max(args.indexOf('--language'), args.indexOf('-l'));
  let language: Language = 'english'; // Default to English

  if (languageIndex !== -1 && languageIndex + 1 < args.length) {
    const langArg = args[languageIndex + 1].toLowerCase();
    if (langArg === 'korean' || langArg === 'english' || langArg === 'ko' || langArg === 'en') {
      // Support both full names and short codes
      language = (langArg === 'korean' || langArg === 'ko') ? 'korean' : 'english';
    } else {
      console.error(`Error: Invalid language '${langArg}'. Use 'korean', 'english', 'ko', or 'en'.`);
      process.exit(1);
    }
  }

  // Collect value arguments (everything between command and options)
  const valueArgs: string[] = [];
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    // Stop at option flags
    if (arg.startsWith('--') || arg === '-l') {
      // Skip the option and its value if it has one
      if (arg === '--language' || arg === '-l') {
        i++; // Skip the language value
      }
      continue;
    }
    valueArgs.push(arg);
  }

  const value = valueArgs.join(' ');

  if (!value) {
    console.error('Error: Missing value argument');
    showHelp();
    process.exit(1);
  }

  try {
    if (command === 'encode') {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) {
        console.error('Error: Please provide a valid non-negative integer');
        process.exit(1);
      }

      const result = language === 'korean' ? encodeKo(num) : encodeEn(num);
      console.log(result);
    } else if (command === 'decode') {
      const result = language === 'korean' ? decodeKo(value) : decodeEn(value);
      console.log(result);
    } else {
      console.error(`Error: Unknown command '${command}'`);
      showHelp();
      process.exit(1);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${errorMsg}`);
    process.exit(1);
  }
}

main();
