#!/usr/bin/env node

import {
  encode,
  decode,
} from './index';

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
Base2000 - Encode/Decode numbers using 2000 emojis

Usage:
  base2000 encode <number> [options]
  base2000 decode <encoded> [options]

Commands:
  encode <number>     Encode a number to base-2000 emojis
  decode <encoded>    Decode base-2000 emojis to a number

Options:
  --separator <sep>  Custom separator for encoding (default: none)
                     For decoding, specify if emojis are separated
                     Recommended: Use space separator for reliable copy/paste
  -h, --help         Show this help message

Examples:
  base2000 encode 123456
  base2000 encode 123456 --separator " "
  base2000 decode 🤮😌
  base2000 decode "😀 😁 😂" --separator " "

Note:
  When copy/pasting emojis from terminal, multi-codepoint emojis (with skin
  tones, flags, etc.) may get corrupted. For reliable copy/paste, use:
    base2000 encode <number> --separator " "
  Or redirect output to a file:
    base2000 encode <number> > encoded.txt
    base2000 decode "$(cat encoded.txt)"
`);
}

function main() {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  
  const separatorIndex = args.indexOf('--separator');
  const separator = separatorIndex !== -1 ? args[separatorIndex + 1] : '';
  
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
      // Use separator if explicitly specified
      const result = separatorIndex !== -1 ? decode(value, separator) : decode(value);
      console.log(result.toString());
    } else {
      console.error(`Error: Unknown command '${command}'`);
      showHelp();
      process.exit(1);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${errorMsg}`);
    
    // Provide helpful hint for common copy/paste issues
    if (errorMsg.includes('Invalid emoji')) {
      console.error('\nHint: If you copied emojis from terminal output, they may be corrupted.');
      console.error('Try using --separator " " when encoding, or redirect to a file:');
      console.error('  base2000 encode <number> --separator " "');
      console.error('  base2000 encode <number> > encoded.txt');
    }
    
    process.exit(1);
  }
}

main();
