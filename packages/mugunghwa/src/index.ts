// Initialize data on module load
import './data-loader.js';

// Public API exports
export { encode } from './encoder.js';
export { decode } from './decoder.js';
export { decimalBase, multipleBase, expectLength } from './base-converter.js';
export { setDebug } from './constants.js';
