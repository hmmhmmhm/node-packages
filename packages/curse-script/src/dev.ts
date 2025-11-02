#!/usr/bin/env node
import * as readline from 'readline';
import { curse } from './index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter script to convert: '
});

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║        Curse Script Interactive Converter             ║');
console.log('║  Enter any JavaScript code to convert to curse-script ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

rl.prompt();

rl.on('line', (input: string) => {
  const trimmed = input.trim();

  if (!trimmed) {
    rl.prompt();
    return;
  }

  try {
    const cursed = curse(trimmed);
    console.log('\n' + cursed + '\n');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }

  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});
