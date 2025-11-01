import patternGrab from '../src/index'

describe('patternGrab Function Tests', () => {
  describe('Basic Functionality', () => {
    it('should split string by matched patterns', () => {
      const result = patternGrab({
        regex: /\d+/g,
        string: 'abc123def456ghi'
      })

      expect(result.data).toEqual(['abc', '123', 'def', '456', 'ghi'])
      expect(result.positions).toEqual([1, 3])
    })

    it('should handle pattern at start of string', () => {
      const result = patternGrab({
        regex: /\d+/g,
        string: '123abc456'
      })

      expect(result.data).toEqual(['123', 'abc', '456'])
      expect(result.positions).toEqual([0, 2])
    })

    it('should handle pattern at end of string', () => {
      const result = patternGrab({
        regex: /\d+/g,
        string: 'abc123def456'
      })

      expect(result.data).toEqual(['abc', '123', 'def', '456'])
      expect(result.positions).toEqual([1, 3])
    })

    it('should handle single match', () => {
      const result = patternGrab({
        regex: /test/g,
        string: 'before test after'
      })

      expect(result.data).toEqual(['before ', 'test', ' after'])
      expect(result.positions).toEqual([1])
    })

    it('should handle consecutive matches', () => {
      const result = patternGrab({
        regex: /<[^>]*>/g,
        string: '<a><b><c>'
      })

      expect(result.data).toEqual(['<a>', '<b>', '<c>'])
      expect(result.positions).toEqual([0, 1, 2])
    })
  })

  describe('HTML Parsing', () => {
    it('should parse simple HTML', () => {
      const html = '<span>Text</span>'
      const result = patternGrab({ regex: /<[^>]*>/g, string: html })

      expect(result.data).toEqual(['<span>', 'Text', '</span>'])
      expect(result.positions).toEqual([0, 2])
    })

    it('should parse nested HTML tags', () => {
      const html = '<div><span>Text</span></div>'
      const result = patternGrab({ regex: /<[^>]*>/g, string: html })

      expect(result.data).toEqual([
        '<div>',
        '<span>',
        'Text',
        '</span>',
        '</div>'
      ])
      expect(result.positions).toEqual([0, 1, 3, 4])
    })

    it('should parse HTML with attributes', () => {
      const html = '<img src="test.png" alt="Test" />'
      const result = patternGrab({ regex: /<[^>]*>/g, string: html })

      expect(result.data).toEqual(['<img src="test.png" alt="Test" />'])
      expect(result.positions).toEqual([0])
    })

    it('should parse mixed HTML and text', () => {
      const html = '<span>Yup This is a <b>Test</b> Yea <img src="/blabla.png" /> Its Ok?</span>'
      const result = patternGrab({ regex: /<[^>]*>/g, string: html })

      expect(result.data).toEqual([
        '<span>',
        'Yup This is a ',
        '<b>',
        'Test',
        '</b>',
        ' Yea ',
        '<img src="/blabla.png" />',
        ' Its Ok?',
        '</span>'
      ])
      expect(result.positions).toEqual([0, 2, 4, 6, 8])
    })

    it('should handle self-closing tags', () => {
      const html = '<br/><hr/><input/>'
      const result = patternGrab({ regex: /<[^>]*>/g, string: html })

      expect(result.data).toEqual(['<br/>', '<hr/>', '<input/>'])
      expect(result.positions).toEqual([0, 1, 2])
    })
  })

  describe('Markdown Parsing', () => {
    it('should extract markdown bold syntax', () => {
      const text = 'This is **bold** text'
      const result = patternGrab({ regex: /\*\*[^*]+\*\*/g, string: text })

      expect(result.data).toEqual(['This is ', '**bold**', ' text'])
      expect(result.positions).toEqual([1])
    })

    it('should extract markdown links', () => {
      const text = 'Check [link](url) here'
      const result = patternGrab({ regex: /\[[^\]]+\]\([^)]+\)/g, string: text })

      expect(result.data).toEqual(['Check ', '[link](url)', ' here'])
      expect(result.positions).toEqual([1])
    })

    it('should extract markdown code blocks', () => {
      const text = 'Code: `console.log()` here'
      const result = patternGrab({ regex: /`[^`]+`/g, string: text })

      expect(result.data).toEqual(['Code: ', '`console.log()`', ' here'])
      expect(result.positions).toEqual([1])
    })
  })

  describe('Data Extraction', () => {
    it('should extract email addresses', () => {
      const text = 'Contact user@example.com or admin@test.org for help'
      const result = patternGrab({
        regex: /[\w.-]+@[\w.-]+\.\w+/g,
        string: text
      })

      expect(result.data).toEqual([
        'Contact ',
        'user@example.com',
        ' or ',
        'admin@test.org',
        ' for help'
      ])
      expect(result.positions).toEqual([1, 3])
    })

    it('should extract URLs', () => {
      const text = 'Visit https://example.com and http://test.org'
      const result = patternGrab({
        regex: /https?:\/\/[\w.-]+\.\w+/g,
        string: text
      })

      expect(result.data).toEqual([
        'Visit ',
        'https://example.com',
        ' and ',
        'http://test.org'
      ])
      expect(result.positions).toEqual([1, 3])
    })

    it('should extract phone numbers', () => {
      const text = 'Call 123-456-7890 or 098-765-4321'
      const result = patternGrab({
        regex: /\d{3}-\d{3}-\d{4}/g,
        string: text
      })

      expect(result.data).toEqual([
        'Call ',
        '123-456-7890',
        ' or ',
        '098-765-4321'
      ])
      expect(result.positions).toEqual([1, 3])
    })

    it('should extract hashtags', () => {
      const text = 'Check #javascript and #typescript tags'
      const result = patternGrab({
        regex: /#\w+/g,
        string: text
      })

      expect(result.data).toEqual([
        'Check ',
        '#javascript',
        ' and ',
        '#typescript',
        ' tags'
      ])
      expect(result.positions).toEqual([1, 3])
    })

    it('should extract mentions', () => {
      const text = 'Hello @user1 and @user2'
      const result = patternGrab({
        regex: /@\w+/g,
        string: text
      })

      expect(result.data).toEqual(['Hello ', '@user1', ' and ', '@user2'])
      expect(result.positions).toEqual([1, 3])
    })
  })

  describe('Edge Cases', () => {
    it('should return empty arrays when no matches', () => {
      const result = patternGrab({
        regex: /xyz/g,
        string: 'abc def ghi'
      })

      expect(result.data).toEqual([])
      expect(result.positions).toEqual([])
    })

    it('should handle empty string', () => {
      const result = patternGrab({
        regex: /test/g,
        string: ''
      })

      expect(result.data).toEqual([])
      expect(result.positions).toEqual([])
    })

    it('should handle string with only matched content', () => {
      const result = patternGrab({
        regex: /test/g,
        string: 'test'
      })

      expect(result.data).toEqual(['test'])
      expect(result.positions).toEqual([0])
    })

    it('should handle multiple consecutive matches', () => {
      const result = patternGrab({
        regex: /\d/g,
        string: '123'
      })

      expect(result.data).toEqual(['1', '2', '3'])
      expect(result.positions).toEqual([0, 1, 2])
    })

    it('should handle whitespace-only separators', () => {
      const result = patternGrab({
        regex: /\w+/g,
        string: 'a b c'
      })

      expect(result.data).toEqual(['a', ' ', 'b', ' ', 'c'])
      expect(result.positions).toEqual([0, 2, 4])
    })

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000) + 'MATCH' + 'b'.repeat(10000)
      const result = patternGrab({
        regex: /MATCH/g,
        string: longString
      })

      expect(result.data).toHaveLength(3)
      expect(result.positions).toEqual([1])
      expect(result.data[1]).toBe('MATCH')
    })

    it('should handle unicode characters', () => {
      const text = 'Hello 👋 World 🌍'
      const result = patternGrab({
        regex: /👋|🌍/g,
        string: text
      })

      expect(result.data).toContain('👋')
      expect(result.data).toContain('🌍')
      expect(result.positions).toHaveLength(2)
    })
  })

  describe('Position Tracking', () => {
    it('should correctly track positions with single match', () => {
      const result = patternGrab({
        regex: /X/g,
        string: 'aXb'
      })

      expect(result.data).toEqual(['a', 'X', 'b'])
      expect(result.positions).toEqual([1])
    })

    it('should correctly track positions with multiple matches', () => {
      const result = patternGrab({
        regex: /X/g,
        string: 'aXbXcXd'
      })

      expect(result.data).toEqual(['a', 'X', 'b', 'X', 'c', 'X', 'd'])
      expect(result.positions).toEqual([1, 3, 5])
    })

    it('should correctly track positions when match is at start', () => {
      const result = patternGrab({
        regex: /X/g,
        string: 'XaXb'
      })

      expect(result.data).toEqual(['X', 'a', 'X', 'b'])
      expect(result.positions).toEqual([0, 2])
    })

    it('should correctly track positions when match is at end', () => {
      const result = patternGrab({
        regex: /X/g,
        string: 'aXbX'
      })

      expect(result.data).toEqual(['a', 'X', 'b', 'X'])
      expect(result.positions).toEqual([1, 3])
    })

    it('should track positions for variable-length matches', () => {
      const result = patternGrab({
        regex: /\d+/g,
        string: 'a1b22c333d'
      })

      expect(result.data).toEqual(['a', '1', 'b', '22', 'c', '333', 'd'])
      expect(result.positions).toEqual([1, 3, 5])
    })
  })

  describe('Complex Patterns', () => {
    it('should handle lookahead assertions', () => {
      const text = 'test1 test2 test3'
      const result = patternGrab({
        regex: /test(?=\d)/g,
        string: text
      })

      expect(result.positions).toHaveLength(3)
    })

    it('should handle capturing groups', () => {
      const text = 'rgb(255, 0, 0) and rgb(0, 255, 0)'
      const result = patternGrab({
        regex: /rgb\(\d+,\s*\d+,\s*\d+\)/g,
        string: text
      })

      expect(result.data).toContain('rgb(255, 0, 0)')
      expect(result.data).toContain('rgb(0, 255, 0)')
      expect(result.positions).toEqual([0, 2])
    })

    it('should handle alternation patterns', () => {
      const text = 'cat dog bird cat'
      const result = patternGrab({
        regex: /cat|dog/g,
        string: text
      })

      expect(result.data).toEqual(['cat', ' ', 'dog', ' bird ', 'cat'])
      expect(result.positions).toEqual([0, 2, 4])
    })

    it('should handle character classes', () => {
      const text = 'a1b2c3'
      const result = patternGrab({
        regex: /[a-z]/g,
        string: text
      })

      expect(result.data).toEqual(['a', '1', 'b', '2', 'c', '3'])
      expect(result.positions).toEqual([0, 2, 4])
    })
  })

  describe('Real-world Use Cases', () => {
    it('should parse CSV-like data', () => {
      const csv = 'name,age,city'
      const result = patternGrab({
        regex: /,/g,
        string: csv
      })

      expect(result.data).toEqual(['name', ',', 'age', ',', 'city'])
      expect(result.positions).toEqual([1, 3])
    })

    it('should parse JSON-like strings', () => {
      const json = '{"key":"value"}'
      const result = patternGrab({
        regex: /"[^"]*"/g,
        string: json
      })

      expect(result.data).toContain('"key"')
      expect(result.data).toContain('"value"')
    })

    it('should parse code syntax highlighting', () => {
      const code = 'const x = 123;'
      const result = patternGrab({
        regex: /\b(const|let|var)\b/g,
        string: code
      })

      expect(result.data).toContain('const')
      expect(result.positions).toEqual([0])
    })

    it('should parse log timestamps', () => {
      const log = '[2024-01-01 10:30:45] Error occurred'
      const result = patternGrab({
        regex: /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/g,
        string: log
      })

      expect(result.data).toContain('[2024-01-01 10:30:45]')
      expect(result.positions).toEqual([0])
    })
  })

  describe('Performance and Stress Tests', () => {
    it('should handle many matches', () => {
      const text = 'a '.repeat(50).trim()
      const result = patternGrab({
        regex: /a/g,
        string: text
      })

      expect(result.positions).toHaveLength(50)
    })

    it('should handle large unmatched sections', () => {
      const text = 'a'.repeat(100) + 'MATCH' + 'b'.repeat(100)
      const result = patternGrab({
        regex: /MATCH/g,
        string: text
      })

      expect(result.data).toHaveLength(3)
      expect(result.data[0]).toHaveLength(100)
      expect(result.data[2]).toHaveLength(100)
    })
  })
})
