import patternGrab from '../src/index'

describe('Integration Tests - Real-world Use Cases', () => {
  describe('HTML/XML Parsing', () => {
    it('should parse complex HTML document', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Page</title>
            <meta charset="UTF-8">
          </head>
          <body>
            <h1>Welcome</h1>
            <p>This is a <strong>test</strong> paragraph.</p>
            <img src="image.png" alt="Test Image" />
          </body>
        </html>
      `
      const result = patternGrab({ regex: /<[^>]+>/g, string: html })
      
      expect(result.data).toContain('<html>')
      expect(result.data).toContain('<title>')
      expect(result.data).toContain('</title>')
      expect(result.data).toContain('<strong>')
      expect(result.data).toContain('</strong>')
      expect(result.data).toContain('<img src="image.png" alt="Test Image" />')
      expect(result.positions.length).toBeGreaterThan(10)
    })

    it('should separate HTML tags from content for syntax highlighting', () => {
      const html = '<div class="container"><p>Hello <span>World</span></p></div>'
      const result = patternGrab({ regex: /<[^>]+>/g, string: html })
      
      // Can iterate through data and apply different styling
      result.data.forEach((item, index) => {
        if (result.positions.includes(index)) {
          // This would be styled as HTML tag
          expect(item).toMatch(/^<.*>$/)
        } else {
          // This would be styled as plain text
          expect(item).not.toMatch(/^<.*>$/)
        }
      })
    })

    it('should parse XML with attributes', () => {
      const xml = '<root><item id="1" name="test">Content</item></root>'
      const result = patternGrab({ regex: /<[^>]+>/g, string: xml })
      
      expect(result.data).toContain('<root>')
      expect(result.data).toContain('<item id="1" name="test">')
      expect(result.data).toContain('Content')
      expect(result.data).toContain('</item>')
      expect(result.data).toContain('</root>')
    })

    it('should handle HTML with inline styles', () => {
      const html = '<div style="color: red; font-size: 14px;">Styled Text</div>'
      const result = patternGrab({ regex: /<[^>]+>/g, string: html })
      
      expect(result.data).toContain('<div style="color: red; font-size: 14px;">')
      expect(result.data).toContain('Styled Text')
      expect(result.data).toContain('</div>')
    })
  })

  describe('Markdown Parsing', () => {
    it('should parse markdown document with mixed syntax', () => {
      const markdown = `
# Heading 1
## Heading 2

This is **bold** and this is *italic*.

- List item 1
- List item 2

[Link Text](https://example.com)

\`\`\`javascript
const code = "example";
\`\`\`
      `
      
      // Extract bold text
      const boldResult = patternGrab({ regex: /\*\*[^*]+\*\*/g, string: markdown })
      expect(boldResult.data).toContain('**bold**')
      
      // Extract italic text
      const italicResult = patternGrab({ regex: /\*[^*]+\*/g, string: markdown })
      expect(italicResult.data.some(item => item.includes('italic'))).toBe(true)
      
      // Extract links
      const linkResult = patternGrab({ regex: /\[[^\]]+\]\([^)]+\)/g, string: markdown })
      expect(linkResult.data).toContain('[Link Text](https://example.com)')
    })

    it('should extract markdown headings', () => {
      const markdown = '# H1\n## H2\n### H3\nRegular text'
      const result = patternGrab({ regex: /^#{1,6}\s+.+$/gm, string: markdown })
      
      expect(result.data).toContain('# H1')
      expect(result.data).toContain('## H2')
      expect(result.data).toContain('### H3')
    })

    it('should parse markdown code blocks', () => {
      const markdown = 'Text before\n```js\ncode here\n```\nText after'
      const result = patternGrab({ regex: /```[\s\S]*?```/g, string: markdown })
      
      expect(result.data).toContain('```js\ncode here\n```')
      expect(result.data).toContain('Text before\n')
      // The remaining text after the code block
      expect(result.data.length).toBeGreaterThan(0)
    })
  })

  describe('Code Syntax Highlighting', () => {
    it('should identify JavaScript keywords', () => {
      const code = 'const x = 10; let y = 20; var z = 30; function test() { return true; }'
      const result = patternGrab({
        regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export)\b/g,
        string: code
      })
      
      expect(result.data).toContain('const')
      expect(result.data).toContain('let')
      expect(result.data).toContain('var')
      expect(result.data).toContain('function')
      expect(result.data).toContain('return')
    })

    it('should extract string literals from code', () => {
      const code = `const msg = "hello"; const msg2 = 'world'; const template = \`test\`;`
      const result = patternGrab({ regex: /["'`][^"'`]*["'`]/g, string: code })
      
      expect(result.data).toContain('"hello"')
      expect(result.data).toContain("'world'")
      expect(result.data).toContain('`test`')
    })

    it('should identify comments in code', () => {
      const code = `
        // Single line comment
        const x = 1; /* Multi
        line comment */ const y = 2;
      `
      const result = patternGrab({ regex: /\/\/.*$|\/\*[\s\S]*?\*\//gm, string: code })
      
      expect(result.data.some(item => item.includes('Single line comment'))).toBe(true)
      expect(result.data.some(item => item.includes('Multi'))).toBe(true)
    })

    it('should parse Python code structure', () => {
      const code = 'def function_name(param):\n    return param * 2\n\nclass MyClass:\n    pass'
      const result = patternGrab({ regex: /\b(def|class|return|import|from|if|else)\b/g, string: code })
      
      expect(result.data).toContain('def')
      expect(result.data).toContain('class')
      expect(result.data).toContain('return')
    })
  })

  describe('Data Extraction from Text', () => {
    it('should extract contact information from text', () => {
      const text = `
        Contact us:
        Email: support@example.com
        Phone: +1-555-123-4567
        Website: https://www.example.com
        Alternative: info@test.org or call 555-987-6543
      `
      
      // Extract emails
      const emailResult = patternGrab({
        regex: /[\w.-]+@[\w.-]+\.\w+/g,
        string: text
      })
      expect(emailResult.data).toContain('support@example.com')
      expect(emailResult.data).toContain('info@test.org')
      
      // Extract URLs
      const urlResult = patternGrab({
        regex: /https?:\/\/[\w.-]+\.\w+/g,
        string: text
      })
      expect(urlResult.data).toContain('https://www.example.com')
      
      // Extract phone numbers
      const phoneResult = patternGrab({
        regex: /\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
        string: text
      })
      expect(phoneResult.positions.length).toBeGreaterThan(0)
    })

    it('should extract dates from text', () => {
      const text = 'Meeting on 2024-01-15, deadline 01/20/2024, and review on Jan 25, 2024'
      const result = patternGrab({
        regex: /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/g,
        string: text
      })
      
      expect(result.data).toContain('2024-01-15')
      expect(result.data).toContain('01/20/2024')
      expect(result.data).toContain('Jan 25, 2024')
    })

    it('should extract prices and currency', () => {
      const text = 'Items: $19.99, €25.50, £30.00, ¥1000'
      const result = patternGrab({
        regex: /[$€£¥]\d+\.?\d*/g,
        string: text
      })
      
      expect(result.data).toContain('$19.99')
      expect(result.data).toContain('€25.50')
      expect(result.data).toContain('£30.00')
      expect(result.data).toContain('¥1000')
    })

    it('should extract social media handles', () => {
      const text = 'Follow @user1 and @user2 on Twitter, check #hashtag1 and #hashtag2'
      
      const mentionResult = patternGrab({ regex: /@\w+/g, string: text })
      expect(mentionResult.data).toContain('@user1')
      expect(mentionResult.data).toContain('@user2')
      
      const hashtagResult = patternGrab({ regex: /#\w+/g, string: text })
      expect(hashtagResult.data).toContain('#hashtag1')
      expect(hashtagResult.data).toContain('#hashtag2')
    })
  })

  describe('Log File Parsing', () => {
    it('should parse structured log entries', () => {
      const log = `
[2024-01-01 10:30:45] INFO: Application started
[2024-01-01 10:30:46] DEBUG: Loading configuration
[2024-01-01 10:30:47] ERROR: Failed to connect to database
[2024-01-01 10:30:48] WARN: Retrying connection
      `
      
      const result = patternGrab({
        regex: /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] (INFO|DEBUG|ERROR|WARN):/g,
        string: log
      })
      
      expect(result.data).toContain('[2024-01-01 10:30:45] INFO:')
      expect(result.data).toContain('[2024-01-01 10:30:47] ERROR:')
      expect(result.data).toContain('[2024-01-01 10:30:48] WARN:')
    })

    it('should extract error messages from logs', () => {
      const log = 'ERROR: Connection failed\nINFO: Retry attempt\nERROR: Timeout occurred'
      const result = patternGrab({ regex: /ERROR:.*$/gm, string: log })
      
      expect(result.data).toContain('ERROR: Connection failed')
      expect(result.data).toContain('ERROR: Timeout occurred')
    })

    it('should parse Apache-style access logs', () => {
      const log = '192.168.1.1 - - [01/Jan/2024:10:30:45 +0000] "GET /index.html HTTP/1.1" 200 1234'
      const result = patternGrab({
        regex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g,
        string: log
      })
      
      expect(result.data).toContain('192.168.1.1')
    })
  })

  describe('CSV and Structured Data', () => {
    it('should parse CSV data', () => {
      const csv = 'name,age,city\nJohn,30,NYC\nJane,25,LA'
      const result = patternGrab({ regex: /,/g, string: csv })
      
      // Should split by commas
      expect(result.positions.length).toBe(6) // 2 commas per line * 3 lines
    })

    it('should parse CSV with quoted fields', () => {
      const csv = 'name,"description, with comma",value'
      const result = patternGrab({ regex: /"[^"]*"/g, string: csv })
      
      expect(result.data).toContain('"description, with comma"')
    })

    it('should parse JSON-like structures', () => {
      const json = '{"name":"John","age":30,"city":"NYC"}'
      const result = patternGrab({ regex: /"[^"]*"/g, string: json })
      
      expect(result.data).toContain('"name"')
      expect(result.data).toContain('"John"')
      expect(result.data).toContain('"age"')
    })

    it('should parse key-value pairs', () => {
      const config = 'key1=value1\nkey2=value2\nkey3=value3'
      const result = patternGrab({ regex: /=/g, string: config })
      
      expect(result.positions).toHaveLength(3)
    })
  })

  describe('URL and Path Parsing', () => {
    it('should parse URL components', () => {
      const url = 'https://user:pass@example.com:8080/path/to/resource?query=value&foo=bar#section'
      
      const protocolResult = patternGrab({ regex: /^https?:\/\//g, string: url })
      expect(protocolResult.data).toContain('https://')
      
      const domainResult = patternGrab({ regex: /@[\w.-]+/g, string: url })
      expect(domainResult.data).toContain('@example.com')
      
      const queryResult = patternGrab({ regex: /\?[^#]+/g, string: url })
      expect(queryResult.data.some(item => item.includes('query=value'))).toBe(true)
    })

    it('should parse file paths', () => {
      const paths = '/home/user/file.txt C:\\Users\\Test\\doc.pdf ./relative/path.js'
      const result = patternGrab({
        regex: /[A-Z]:\\[\w\\.-]+|\/[\w\/.-]+|\.\/.+/g,
        string: paths
      })
      
      expect(result.data.some(item => item.includes('/home/user/file.txt'))).toBe(true)
      expect(result.data.some(item => item.includes('C:\\Users\\Test\\doc.pdf'))).toBe(true)
    })
  })

  describe('Template and Variable Substitution', () => {
    it('should identify template variables', () => {
      const template = 'Hello {{name}}, your balance is {{balance}}'
      const result = patternGrab({ regex: /\{\{[^}]+\}\}/g, string: template })
      
      expect(result.data).toContain('{{name}}')
      expect(result.data).toContain('{{balance}}')
      expect(result.data).toContain('Hello ')
      expect(result.data).toEqual(['Hello ', '{{name}}', ', your balance is ', '{{balance}}'])
      expect(result.positions).toEqual([1, 3])
    })

    it('should identify environment variables', () => {
      const text = 'Path: $HOME/bin and $USER/docs or ${CUSTOM_VAR}'
      const result = patternGrab({ regex: /\$\{?\w+\}?/g, string: text })
      
      expect(result.data).toContain('$HOME')
      expect(result.data).toContain('$USER')
      expect(result.data).toContain('${CUSTOM_VAR}')
    })

    it('should parse template literals in JavaScript', () => {
      const code = 'const msg = `Hello ${name}, you have ${count} items`;'
      const result = patternGrab({ regex: /\$\{[^}]+\}/g, string: code })
      
      expect(result.data).toContain('${name}')
      expect(result.data).toContain('${count}')
    })
  })

  describe('Rich Text Processing', () => {
    it('should process mixed content for rich text editor', () => {
      const richText = 'Normal text **bold text** more normal *italic* and `code` end'
      
      // Process bold
      const boldResult = patternGrab({ regex: /\*\*[^*]+\*\*/g, string: richText })
      expect(boldResult.data).toContain('**bold text**')
      
      // Process italic
      const italicResult = patternGrab({ regex: /\*[^*]+\*/g, string: richText })
      expect(italicResult.data.some(item => item.includes('italic'))).toBe(true)
      
      // Process code
      const codeResult = patternGrab({ regex: /`[^`]+`/g, string: richText })
      expect(codeResult.data).toContain('`code`')
    })

    it('should handle nested formatting', () => {
      const text = 'Text with **bold and *italic* inside** more text'
      // This pattern won't match because [^*]+ stops at the first *
      // Use a better pattern for nested content
      const result = patternGrab({ regex: /\*\*[\s\S]*?\*\*/g, string: text })
      
      expect(result.data).toContain('**bold and *italic* inside**')
    })
  })

  describe('Search and Replace Preparation', () => {
    it('should prepare data for selective replacement', () => {
      const text = 'Replace this and this but not that'
      const result = patternGrab({ regex: /this/g, string: text })
      
      // Can use positions to replace only matched items
      expect(result.positions).toEqual([1, 3])
      expect(result.data[result.positions[0]]).toBe('this')
      expect(result.data[result.positions[1]]).toBe('this')
      
      // Reconstruct with replacements
      const replaced = result.data.map((item, index) => 
        result.positions.includes(index) ? 'THAT' : item
      ).join('')
      
      expect(replaced).toBe('Replace THAT and THAT but not that')
    })

    it('should enable conditional text transformation', () => {
      const html = '<p>Text</p><div>Content</div><p>More</p>'
      const result = patternGrab({ regex: /<[^>]+>/g, string: html })
      
      // Can transform only specific tags
      const transformed = result.data.map((item, index) => {
        if (result.positions.includes(index) && item.includes('<p>')) {
          return '<span>'
        } else if (result.positions.includes(index) && item.includes('</p>')) {
          return '</span>'
        }
        return item
      }).join('')
      
      expect(transformed).toBe('<span>Text</span><div>Content</div><span>More</span>')
    })
  })

  describe('Performance with Real-world Data', () => {
    it('should handle HTML documents', () => {
      const largeHtml = '<div>' + '<p>Content</p>'.repeat(20) + '</div>'
      const result = patternGrab({ regex: /<[^>]+>/g, string: largeHtml })
      
      expect(result.positions.length).toBe(42) // 1 div open + 20 p open + 20 p close + 1 div close
    })

    it('should handle log files', () => {
      const logEntry = '[2024-01-01 10:30:45] INFO: Message\n'
      const largeLogs = logEntry.repeat(20)
      const result = patternGrab({
        regex: /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/g,
        string: largeLogs
      })
      
      expect(result.positions).toHaveLength(20)
    })

    it('should handle code files', () => {
      const codeLine = 'const variable = "value"; // comment\n'
      const largeCode = codeLine.repeat(20)
      const result = patternGrab({
        regex: /"[^"]*"/g,
        string: largeCode
      })
      
      expect(result.positions).toHaveLength(20)
    })
  })
})
