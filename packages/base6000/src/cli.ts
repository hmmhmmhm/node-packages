#!/usr/bin/env node

import {
  encode,
  decode,
} from './index';

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
Base6000 - Encode/Decode numbers using 6000 English words

Usage:
  base6000 encode <number> [options]
  base6000 decode <encoded> [options]

Commands:
  encode <number>     Encode a number to base-6000 words
  decode <encoded>    Decode base-6000 words to a number

Options:
  --separator <sep>  Custom separator for encoding (default: '-')
                     For decoding, separators are auto-detected
  -h, --help         Show this help message

Examples:
  base6000 encode 123456
  base6000 encode 123456 --separator _
  base6000 decode u-meeting
  base6000 decode high-categories-are-momentum
  base6000 decode high categories are momentum  # without quotes
  base6000 decode "high categories are momentum"  # with quotes
  base6000 decode high_categories_are_momentum
`);
}

function main() {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  
  const separatorIndex = args.indexOf('--separator');
  const separator = separatorIndex !== -1 ? args[separatorIndex + 1] : '-';
  
  // Collect value arguments (everything between command and options)
  const valueArgs: string[] = [];
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    // Stop at option flags
    if (arg.startsWith('--')) {
      // Skip the option and its value if it has one
      if (arg === '--separator') {
        i++; // Skip the separator value
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
      // Pass the value as string to the encode function
      // The library will handle BigInt conversion safely
      const result = encode(value, separator);
      console.log(result);
    } else if (command === 'decode') {
      // Auto-detect separator unless explicitly specified
      const result = separatorIndex !== -1 ? decode(value, separator) : decode(value);
      console.log(result.toString());
    } else {
      console.error(`Error: Unknown command '${command}'`);
      showHelp();
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
