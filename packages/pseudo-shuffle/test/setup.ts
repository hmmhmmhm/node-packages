// Suppress the bigint-buffer warning from @trufflesuite/bigint-buffer
const originalWarn = console.warn;

console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  
  // Filter out the bigint-buffer warning
  if (message.includes('bigint: Failed to load bindings')) {
    return;
  }
  
  // Allow all other warnings
  originalWarn.apply(console, args);
};
