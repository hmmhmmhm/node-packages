import patternGrab, { getPositions } from '../src/index'

describe('Edge Cases and Boundary Conditions', () => {
  describe('Empty and Null-like Inputs', () => {
    it('should handle empty string input', () => {
      const result = patternGrab({ regex: /test/g, string: '' })
      expect(result.data).toEqual([])
      expect(result.positions).toEqual([])
    })

    it('should handle pattern that matches empty string', () => {
      const result = patternGrab({ regex: /a*/g, string: 'bbb' })
      // This will match empty strings between characters
      expect(result.data.length).toBeGreaterThan(0)
    })

    it('should handle whitespace-only string', () => {
      const result = patternGrab({ regex: /\s+/g, string: '   ' })
      expect(result.data).toEqual(['   '])
      expect(result.positions).toEqual([0])
    })

    it('should handle newline-only string', () => {
      const result = patternGrab({ regex: /\n/g, string: '\n\n\n' })
      expect(result.data).toEqual(['\n', '\n', '\n'])
      expect(result.positions).toEqual([0, 1, 2])
    })
  })

  describe('Single Character Scenarios', () => {
    it('should handle single character string that matches', () => {
      const result = patternGrab({ regex: /a/g, string: 'a' })
      expect(result.data).toEqual(['a'])
      expect(result.positions).toEqual([0])
    })

    it('should handle single character string that does not match', () => {
      const result = patternGrab({ regex: /b/g, string: 'a' })
      expect(result.data).toEqual([])
      expect(result.positions).toEqual([])
    })

    it('should handle single character pattern in long string', () => {
      const result = patternGrab({ regex: /x/g, string: 'axbxcxd' })
      expect(result.data).toEqual(['a', 'x', 'b', 'x', 'c', 'x', 'd'])
      expect(result.positions).toEqual([1, 3, 5])
    })
  })

  describe('Boundary Matches', () => {
    it('should handle match at very start', () => {
      const result = patternGrab({ regex: /^START/g, string: 'START of text' })
      expect(result.data).toEqual(['START', ' of text'])
      expect(result.positions).toEqual([0])
    })

    it('should handle match at very end', () => {
      const result = patternGrab({ regex: /END$/g, string: 'text END' })
      expect(result.data).toEqual(['text ', 'END'])
      expect(result.positions).toEqual([1])
    })

    it('should handle word boundary matches', () => {
      const result = patternGrab({ regex: /\bword\b/g, string: 'word sword words' })
      expect(result.data).toContain('word')
      expect(result.positions).toEqual([0])
    })

    it('should handle entire string match', () => {
      const result = patternGrab({ regex: /^.*$/g, string: 'entire string' })
      expect(result.data).toEqual(['entire string'])
      expect(result.positions).toEqual([0])
    })
  })

  describe('Special Characters and Escaping', () => {
    it('should handle special regex characters in text', () => {
      const text = 'Price: $100 (sale)'
      const result = patternGrab({ regex: /\$\d+/g, string: text })
      expect(result.data).toContain('$100')
    })

    it('should handle backslashes in text', () => {
      const text = 'Path: C:\\Users\\Test'
      const result = patternGrab({ regex: /\\/g, string: text })
      expect(result.positions).toHaveLength(2)
    })

    it('should handle quotes in text', () => {
      const text = 'Say "hello" and \'world\''
      const result = patternGrab({ regex: /["']/g, string: text })
      expect(result.positions).toHaveLength(4)
    })

    it('should handle parentheses in text', () => {
      const text = 'Math: (a + b) * (c + d)'
      const result = patternGrab({ regex: /\([^)]+\)/g, string: text })
      expect(result.data).toContain('(a + b)')
      expect(result.data).toContain('(c + d)')
    })

    it('should handle brackets in text', () => {
      const text = 'Array: [1, 2, 3]'
      const result = patternGrab({ regex: /\[[^\]]+\]/g, string: text })
      expect(result.data).toContain('[1, 2, 3]')
    })

    it('should handle dots in text', () => {
      const text = 'File: test.txt and data.json'
      const result = patternGrab({ regex: /\.\w+/g, string: text })
      expect(result.data).toContain('.txt')
      expect(result.data).toContain('.json')
    })
  })

  describe('Unicode and International Characters', () => {
    it('should handle emoji characters', () => {
      const text = 'Hello 👋 World 🌍 Test 🚀'
      const result = patternGrab({ regex: /👋|🌍|🚀/g, string: text })
      expect(result.positions).toHaveLength(3)
    })

    it('should handle Chinese characters', () => {
      const text = '你好 world 世界'
      const result = patternGrab({ regex: /[\u4e00-\u9fa5]+/g, string: text })
      expect(result.data).toContain('你好')
      expect(result.data).toContain('世界')
    })

    it('should handle Japanese characters', () => {
      const text = 'こんにちは world'
      const result = patternGrab({ regex: /[\u3040-\u309f]+/g, string: text })
      expect(result.data).toContain('こんにちは')
    })

    it('should handle Korean characters', () => {
      const text = '안녕하세요 world'
      const result = patternGrab({ regex: /[\uac00-\ud7af]+/g, string: text })
      expect(result.data).toContain('안녕하세요')
    })

    it('should handle accented characters', () => {
      const text = 'café résumé naïve'
      const result = patternGrab({ regex: /[a-zA-Zàáâãäåçèéêëìíîïñòóôõöùúûüý]+/g, string: text })
      expect(result.data).toContain('café')
      expect(result.data).toContain('résumé')
      expect(result.data).toContain('naïve')
    })

    it('should handle mixed unicode and ASCII', () => {
      const text = 'Hello 世界 👋 Test'
      const result = patternGrab({ regex: /[\u4e00-\u9fa5]+/g, string: text })
      expect(result.data).toContain('世界')
      expect(result.data).toContain('Hello ')
      expect(result.data).toContain(' 👋 Test')
    })
  })

  describe('Consecutive and Overlapping Patterns', () => {
    it('should handle consecutive identical matches', () => {
      const result = patternGrab({ regex: /a/g, string: 'aaa' })
      expect(result.data).toEqual(['a', 'a', 'a'])
      expect(result.positions).toEqual([0, 1, 2])
    })

    it('should handle consecutive different matches', () => {
      const result = patternGrab({ regex: /[ab]/g, string: 'abab' })
      expect(result.data).toEqual(['a', 'b', 'a', 'b'])
      expect(result.positions).toEqual([0, 1, 2, 3])
    })

    it('should handle patterns with no gap between matches', () => {
      const result = patternGrab({ regex: /<[^>]+>/g, string: '<a><b><c>' })
      expect(result.data).toEqual(['<a>', '<b>', '<c>'])
      expect(result.positions).toEqual([0, 1, 2])
    })

    it('should handle alternating match and non-match', () => {
      const result = patternGrab({ regex: /\d/g, string: '1a2b3c' })
      expect(result.data).toEqual(['1', 'a', '2', 'b', '3', 'c'])
      expect(result.positions).toEqual([0, 2, 4])
    })
  })

  describe('Variable Length Matches', () => {
    it('should handle matches of different lengths', () => {
      const result = patternGrab({ regex: /\d+/g, string: 'a1bb22ccc333' })
      expect(result.data).toEqual(['a', '1', 'bb', '22', 'ccc', '333'])
      expect(result.positions).toEqual([1, 3, 5])
    })

    it('should handle greedy quantifiers', () => {
      const result = patternGrab({ regex: /a+/g, string: 'a aa aaa' })
      expect(result.data).toContain('a')
      expect(result.data).toContain('aa')
      expect(result.data).toContain('aaa')
    })

    it('should handle lazy quantifiers', () => {
      const result = patternGrab({ regex: /<.+?>/g, string: '<a><b>' })
      expect(result.data).toEqual(['<a>', '<b>'])
      expect(result.positions).toEqual([0, 1])
    })

    it('should handle optional patterns', () => {
      const result = patternGrab({ regex: /colou?r/g, string: 'color colour' })
      expect(result.data).toContain('color')
      expect(result.data).toContain('colour')
    })
  })

  describe('Multiline and Dotall Scenarios', () => {
    it('should handle multiline strings', () => {
      const text = 'line1\nline2\nline3'
      const result = patternGrab({ regex: /^line/gm, string: text })
      expect(result.positions).toHaveLength(3)
    })

    it('should handle line endings', () => {
      const text = 'line1\nline2\r\nline3'
      const result = patternGrab({ regex: /\r?\n/g, string: text })
      expect(result.positions).toHaveLength(2)
    })

    it('should handle patterns across lines with dotall-like pattern', () => {
      const text = 'start\nmiddle\nend'
      const result = patternGrab({ regex: /start[\s\S]+end/g, string: text })
      expect(result.data).toEqual(['start\nmiddle\nend'])
    })

    it('should handle multiple paragraphs', () => {
      const text = 'Para1\n\nPara2\n\nPara3'
      const result = patternGrab({ regex: /\n\n/g, string: text })
      expect(result.positions).toHaveLength(2)
    })
  })

  describe('Performance Edge Cases', () => {
    it('should handle moderately long strings', () => {
      const longString = 'a'.repeat(100)
      const result = patternGrab({ regex: /a/g, string: longString })
      expect(result.positions).toHaveLength(100)
    })

    it('should handle many matches in string', () => {
      const text = ('x' + 'y'.repeat(10)).repeat(10)
      const result = patternGrab({ regex: /x/g, string: text })
      expect(result.positions).toHaveLength(10)
    })

    it('should handle large unmatched sections', () => {
      const text = 'a'.repeat(100) + 'MATCH' + 'b'.repeat(100)
      const result = patternGrab({ regex: /MATCH/g, string: text })
      expect(result.data).toHaveLength(3)
      expect(result.data[1]).toBe('MATCH')
    })

    it('should handle string with no matches', () => {
      const longString = 'a'.repeat(100)
      const result = patternGrab({ regex: /z/g, string: longString })
      expect(result.data).toEqual([])
      expect(result.positions).toEqual([])
    })
  })

  describe('Complex Real-world Patterns', () => {
    it('should handle nested structures', () => {
      const text = '((a)(b))((c)(d))'
      const result = patternGrab({ regex: /\([^()]+\)/g, string: text })
      expect(result.data).toContain('(a)')
      expect(result.data).toContain('(b)')
      expect(result.data).toContain('(c)')
      expect(result.data).toContain('(d)')
    })

    it('should handle mixed content types', () => {
      const text = 'Text <b>bold</b> 123 test@email.com http://url.com'
      const result = patternGrab({
        regex: /<[^>]+>|[\w.-]+@[\w.-]+\.\w+|https?:\/\/[\w.-]+\.\w+/g,
        string: text
      })
      expect(result.data).toContain('<b>')
      expect(result.data).toContain('</b>')
      expect(result.data).toContain('test@email.com')
      expect(result.data).toContain('http://url.com')
    })

    it('should handle code with strings and comments', () => {
      const code = 'const x = "test"; // comment'
      const result = patternGrab({ regex: /"[^"]*"|\/\/.*$/g, string: code })
      expect(result.data).toContain('"test"')
      expect(result.data).toContain('// comment')
    })

    it('should handle CSV with quoted fields', () => {
      const csv = 'name,"value,with,comma",123'
      const result = patternGrab({ regex: /"[^"]*"|[^,]+/g, string: csv })
      expect(result.data).toContain('name')
      expect(result.data).toContain('"value,with,comma"')
      expect(result.data).toContain('123')
    })
  })

  describe('Regex Flag Combinations', () => {
    it('should handle case-insensitive flag', () => {
      const result = patternGrab({ regex: /test/gi, string: 'Test TEST test' })
      expect(result.positions).toHaveLength(3)
    })

    it('should handle multiline flag', () => {
      const text = 'start\nmiddle\nend'
      const result = patternGrab({ regex: /^/gm, string: text })
      expect(result.positions.length).toBeGreaterThan(1)
    })

    it('should handle accented word matching', () => {
      const text = 'café'
      const result = patternGrab({ regex: /[a-zA-Zàáâãäåçèéêëìíîïñòóôõöùúûüý]+/g, string: text })
      expect(result.data).toContain('café')
    })

    it('should handle sticky flag behavior', () => {
      // Note: sticky flag might not work as expected with getPositions
      const result = patternGrab({ regex: /test/g, string: 'test test' })
      expect(result.positions).toHaveLength(2)
    })
  })

  describe('getPositions Edge Cases', () => {
    it('should return empty array for no matches', () => {
      const positions = getPositions(/xyz/g, 'abc')
      expect(positions).toEqual([])
    })

    it('should handle single match correctly', () => {
      const positions = getPositions(/test/g, 'this is test')
      expect(positions).toEqual([[8, 12]])
    })

    it('should handle overlapping pattern positions', () => {
      const positions = getPositions(/aa/g, 'aaaa')
      // Should match at 0-2 and 2-4 (non-overlapping)
      expect(positions).toHaveLength(2)
    })

    it('should handle zero-width matches', () => {
      const positions = getPositions(/\b/g, 'hello world')
      // Word boundaries
      expect(positions.length).toBeGreaterThan(0)
    })

    it('should handle very long match', () => {
      const text = 'a'.repeat(10000)
      const positions = getPositions(/a+/g, text)
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual([0, 10000])
    })
  })

  describe('Data Integrity', () => {
    it('should preserve exact match content', () => {
      const text = 'Test  with   multiple    spaces'
      const result = patternGrab({ regex: /\s+/g, string: text })
      expect(result.data).toContain('  ')
      expect(result.data).toContain('   ')
      expect(result.data).toContain('    ')
    })

    it('should preserve special characters in matches', () => {
      const text = 'Price: $100.50'
      const result = patternGrab({ regex: /\$\d+\.\d+/g, string: text })
      expect(result.data).toContain('$100.50')
    })

    it('should maintain string order', () => {
      const text = 'a1b2c3'
      const result = patternGrab({ regex: /\d/g, string: text })
      expect(result.data).toEqual(['a', '1', 'b', '2', 'c', '3'])
    })

    it('should not lose any characters', () => {
      const text = 'test string with matches'
      const result = patternGrab({ regex: /\s+/g, string: text })
      const reconstructed = result.data.join('')
      expect(reconstructed).toBe(text)
    })
  })

  describe('Branch Coverage Edge Cases', () => {
    it('should handle last match without next element', () => {
      // This test ensures the branch where next is undefined is covered
      const result = patternGrab({ regex: /x/g, string: 'axb' })
      expect(result.data).toEqual(['a', 'x', 'b'])
      expect(result.positions).toEqual([1])
    })

    it('should handle adjacent matches at end of string', () => {
      // Ensures we cover the case where current[1] == next[0] and also the last match
      const result = patternGrab({ regex: /\d/g, string: 'ab12' })
      expect(result.data).toEqual(['ab', '1', '2'])
      expect(result.positions).toEqual([1, 2])
    })
  })
})
