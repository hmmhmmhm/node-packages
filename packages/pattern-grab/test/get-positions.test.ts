import { getPositions } from '../src/index'

describe('getPositions Function Tests', () => {
  describe('Basic Pattern Matching', () => {
    it('should find single word matches', () => {
      const text = 'Hello World Hello'
      const positions = getPositions(/Hello/g, text)
      
      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual([0, 5])
      expect(positions[1]).toEqual([12, 17])
    })

    it('should find case-sensitive matches', () => {
      const text = 'Hello hello HELLO'
      const positions = getPositions(/hello/g, text)
      
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual([6, 11])
    })

    it('should find case-insensitive matches', () => {
      const text = 'Hello hello HELLO'
      const positions = getPositions(/hello/gi, text)
      
      expect(positions).toHaveLength(3)
      expect(positions[0]).toEqual([0, 5])
      expect(positions[1]).toEqual([6, 11])
      expect(positions[2]).toEqual([12, 17])
    })
  })

  describe('Special Character Patterns', () => {
    it('should find whitespace characters', () => {
      const text = 'Hello World Test'
      const positions = getPositions(/ /g, text)
      
      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual([5, 6])
      expect(positions[1]).toEqual([11, 12])
    })

    it('should find newline characters', () => {
      const text = 'Line1\nLine2\nLine3'
      const positions = getPositions(/\n/g, text)
      
      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual([5, 6])
      expect(positions[1]).toEqual([11, 12])
    })

    it('should find tab characters', () => {
      const text = 'Col1\tCol2\tCol3'
      const positions = getPositions(/\t/g, text)
      
      expect(positions).toHaveLength(2)
    })

    it('should find punctuation marks', () => {
      const text = 'Hello, World! How are you?'
      const positions = getPositions(/[,!?]/g, text)
      
      expect(positions).toHaveLength(3)
      expect(positions[0]).toEqual([5, 6]) // comma
      expect(positions[1]).toEqual([12, 13]) // exclamation
      expect(positions[2]).toEqual([25, 26]) // question mark
    })
  })

  describe('Complex Regex Patterns', () => {
    it('should find HTML tags', () => {
      const html = '<div>Content</div><span>Text</span>'
      const positions = getPositions(/<[^>]*>/g, html)
      
      expect(positions).toHaveLength(4)
      expect(positions[0]).toEqual([0, 5]) // <div>
      expect(positions[1]).toEqual([12, 18]) // </div>
      expect(positions[2]).toEqual([18, 24]) // <span>
      expect(positions[3]).toEqual([28, 35]) // </span>
    })

    it('should find email addresses', () => {
      const text = 'Contact: user@example.com or admin@test.org'
      const positions = getPositions(/[\w.-]+@[\w.-]+\.\w+/g, text)
      
      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual([9, 25]) // user@example.com
      expect(positions[1]).toEqual([29, 43]) // admin@test.org
    })

    it('should find URLs', () => {
      const text = 'Visit https://example.com or http://test.org'
      const positions = getPositions(/https?:\/\/[\w.-]+\.\w+/g, text)
      
      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual([6, 25])
      expect(positions[1]).toEqual([29, 44])
    })

    it('should find numbers', () => {
      const text = 'Numbers: 123, 45.67, -89, 0.5'
      const positions = getPositions(/-?\d+\.?\d*/g, text)
      
      expect(positions).toHaveLength(4)
    })

    it('should find word boundaries', () => {
      const text = 'test testing tested'
      const positions = getPositions(/\btest\b/g, text)
      
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual([0, 4])
    })
  })

  describe('Edge Cases', () => {
    it('should return empty array when no matches found', () => {
      const text = 'Hello World'
      const positions = getPositions(/xyz/g, text)
      
      expect(positions).toHaveLength(0)
      expect(positions).toEqual([])
    })

    it('should handle empty string', () => {
      const text = ''
      const positions = getPositions(/test/g, text)
      
      expect(positions).toHaveLength(0)
    })

    it('should handle pattern matching entire string', () => {
      const text = 'Hello'
      const positions = getPositions(/Hello/g, text)
      
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual([0, 5])
    })

    it('should handle overlapping patterns (non-capturing)', () => {
      const text = 'aaaa'
      const positions = getPositions(/aa/g, text)
      
      // Non-overlapping matches: 'aa' at 0-2 and 'aa' at 2-4
      expect(positions).toHaveLength(2)
    })

    it('should handle single character matches', () => {
      const text = 'abcabc'
      const positions = getPositions(/a/g, text)
      
      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual([0, 1])
      expect(positions[1]).toEqual([3, 4])
    })

    it('should handle unicode characters', () => {
      const text = 'Hello 👋 World 🌍'
      const positions = getPositions(/👋|🌍/g, text)
      
      expect(positions).toHaveLength(2)
    })

    it('should handle moderately long strings', () => {
      const text = 'a'.repeat(100) + 'b' + 'a'.repeat(100)
      const positions = getPositions(/b/g, text)
      
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual([100, 101])
    })
  })

  describe('Multiple Consecutive Matches', () => {
    it('should find consecutive identical patterns', () => {
      const text = '111222333'
      const positions = getPositions(/1/g, text)
      
      expect(positions).toHaveLength(3)
      expect(positions[0]).toEqual([0, 1])
      expect(positions[1]).toEqual([1, 2])
      expect(positions[2]).toEqual([2, 3])
    })

    it('should find consecutive different patterns', () => {
      const text = '<a><b><c>'
      const positions = getPositions(/<[^>]*>/g, text)
      
      expect(positions).toHaveLength(3)
      expect(positions[0]).toEqual([0, 3])
      expect(positions[1]).toEqual([3, 6])
      expect(positions[2]).toEqual([6, 9])
    })
  })

  describe('Regex Flags', () => {
    it('should respect global flag', () => {
      const text = 'test test test'
      const positionsWithG = getPositions(/test/g, text)
      
      expect(positionsWithG).toHaveLength(3)
    })

    it('should work with multiline flag', () => {
      const text = 'start\nmiddle\nend'
      const positions = getPositions(/^/gm, text)
      
      // Matches start of each line
      expect(positions.length).toBeGreaterThan(0)
    })

    it('should work with dotall-like pattern', () => {
      const text = 'Hello\nWorld'
      const positions = getPositions(/Hello[\s\S]World/g, text)
      
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual([0, 11])
    })
  })

  describe('Real-world Patterns', () => {
    it('should extract markdown links', () => {
      const text = 'Check [link1](url1) and [link2](url2)'
      const positions = getPositions(/\[([^\]]+)\]\(([^)]+)\)/g, text)
      
      expect(positions).toHaveLength(2)
    })

    it('should find CSS class names', () => {
      const css = '.class1 { } .class2 { } #id1 { }'
      const positions = getPositions(/\.[a-zA-Z][\w-]*/g, css)
      
      expect(positions).toHaveLength(2)
    })

    it('should find JavaScript variable declarations', () => {
      const code = 'const x = 1; let y = 2; var z = 3;'
      const positions = getPositions(/\b(const|let|var)\b/g, code)
      
      expect(positions).toHaveLength(3)
    })

    it('should find quoted strings', () => {
      const text = 'Say "hello" and \'world\''
      const positions = getPositions(/["']([^"']*)["']/g, text)
      
      expect(positions).toHaveLength(2)
    })
  })
})
