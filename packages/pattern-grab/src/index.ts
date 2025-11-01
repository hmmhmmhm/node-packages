/**
 * Returns position values with strings
 * matching the regular expression.
 */
export const getPositions = (regex: RegExp, string: string) => {
  let m: RegExpExecArray | null = null
  const positions: [number, number][] = []
  const pattern = new RegExp(regex.source, regex.flags)
  while ((m = pattern.exec(string)) !== null) {
    positions.push([m.index, m.index + m[0].length])
    // Prevent infinite loop on zero-width matches
    if (m[0].length === 0) {
      pattern.lastIndex++
    }
  }
  return positions
}

/**
 * It returns array that includes string of match
 * the regular expression with not matched string.
 *
 * @returns
 * - data - Well-bundled array of strings.
 * - position - It is index array of elements matching regular expressions during string arrays.
 */
export const patternGrab = ({
  regex,
  string
}: {
  regex: RegExp
  string: string
}) => {
  const matches = getPositions(regex, string)

  const data: string[] = []
  const positions: number[] = []

  if (matches.length > 0) {
    if (matches[0][0] !== 0) {
      data.push(string.substring(0, matches[0][0]))
    }

    for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
      const current = matches[matchIndex]
      positions.push(data.length)
      const matchedText = string.substring(current[0], current[1])
      data.push(matchedText)

      /* istanbul ignore else */
      if (matchIndex + 1 < matches.length) {
        const next = matches[matchIndex + 1]
        if (current[1] !== next[0]) {
          data.push(string.substring(current[1], next[0]))
        }
      }
    }

    if (matches[matches.length - 1]) {
      const lastMatchIndex = matches[matches.length - 1][1]
      if (lastMatchIndex !== string.length) {
        data.push(string.substring(lastMatchIndex, string.length))
      }
    }
  }

  return { data, positions }
}

export default patternGrab
