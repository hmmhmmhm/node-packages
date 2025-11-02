import { curse, type CurseOptions } from '../src/index';

describe('curse function', () => {
  it('should generate curse script with prelude', () => {
    const source = 'alert("test")';
    const result = curse(source, { characterSet: 'none' });
    expect(result).toContain('A=');
    expect(result).toContain('J(');
  });

  it('should generate curse script without prelude', () => {
    const source = 'alert("test")';
    const result = curse(source, { includePrelude: false, characterSet: 'none' });
    expect(result).not.toContain('A=');
    expect(result).toContain('J(');
  });

  it('should handle empty string', () => {
    const source = '';
    const result = curse(source);
    expect(result).toBeDefined();
  });

  it('should handle special characters', () => {
    const source = 'a b c';
    const result = curse(source);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should use runic characters by default', () => {
    const source = 'alert("test")';
    const result = curse(source);
    // Should contain runic characters instead of Latin A-X
    expect(result).toContain('ᚠ');
    expect(result).not.toContain('A=');
  });

  it('should support Old Persian character set', () => {
    const source = 'alert("test")';
    const result = curse(source, { characterSet: 'oldPersian' });
    // Should contain Old Persian characters
    expect(result).toContain('𐎠');
    expect(result).not.toContain('A=');
    expect(result).not.toContain('ᚠ');
  });

  it('should support custom character array', () => {
    const source = 'alert("test")';
    const customChars = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
    const result = curse(source, { characterSet: customChars });
    // Should contain Greek characters
    expect(result).toContain('α');
    expect(result).not.toContain('A=');
    expect(result).not.toContain('ᚠ');
  });

  it('should throw error if custom character set is too short', () => {
    const source = 'alert("test")';
    const shortChars = ['α', 'β', 'γ'];
    expect(() => curse(source, { characterSet: shortChars })).toThrow('Character set must contain at least 24 characters');
  });

  it('should support emoji character set', () => {
    const source = 'alert("test")';
    const result = curse(source, { characterSet: 'emoji' });
    // Should contain emoji characters
    expect(result).toContain('😀');
    expect(result).not.toContain('A=');
    expect(result).not.toContain('ᚠ');
  });

  it('should support none character set (no replacement)', () => {
    const source = 'alert("test")';
    const result = curse(source, { characterSet: 'none' });
    // Should contain Latin A-X
    expect(result).toContain('A=');
    expect(result).not.toContain('𐎠');
    expect(result).not.toContain('ᚠ');
  });

  it('should work with runic and no prelude', () => {
    const source = 'alert("test")';
    const result = curse(source, { includePrelude: false });
    expect(result).not.toContain('A=');
    expect(result).toContain('ᚩ(');
    expect(result).toContain('ᚠ');
  });

  it('should work with emoji and no prelude', () => {
    const source = 'alert("test")';
    const result = curse(source, { includePrelude: false, characterSet: 'emoji' });
    expect(result).not.toContain('A=');
    expect(result).toContain('🦊('); // J maps to emojiChars[9] which is 🦊
    expect(result).toContain('😀');
  });
});
