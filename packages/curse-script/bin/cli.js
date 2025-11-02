#!/usr/bin/env node
import * as readline from 'readline';
import { curse } from '../dist/index.modern.js';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',

  // Background colors
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
};

const colorize = (text, color) => {
  return `${colors[color]}${text}${colors.reset}`;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter script to convert: \n'
});

console.log(colorize('╔═══════════════════════════════════════════════════════╗', 'red'));
console.log(colorize('║        Curse Script Interactive Converter             ║', 'red'));
console.log(colorize('║  Enter any JavaScript code to convert to curse-script ║', 'red'));
console.log(colorize('╚═══════════════════════════════════════════════════════╝', 'red'));
console.log('');

rl.prompt();

rl.on('line', (input) => {
  const trimmed = input.trim();

  if (!trimmed) {
    rl.prompt();
    return;
  }

  try {
    const cursed = curse(trimmed);
    console.log('');
    console.log(colorize('[Cursed Output]', 'red'));
    console.log(colorize(cursed, 'red'));
    console.log('');
  } catch (error) {
    console.log('');
    console.log(colorize('❌ Error:', 'red'));
    console.log(colorize(error instanceof Error ? error.message : String(error), 'red'));
    console.log('');
  }

  rl.close();
});

rl.on('close', () => {
  console.log(colorize('\n👋 Goodbye!', 'red'));
  process.exit(0);
});
