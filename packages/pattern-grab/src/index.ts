/**
 * Returns position values with strings
 * matching the regular expression.
 */
export const getPositions = (regex: RegExp, string: string) => {
  let m: RegExpExecArray | null = null
  const positions: [number, number][] = []
  const pattern = new RegExp(regex)
  while ((m = pattern.exec(string)) !== null)
    positions.push([m.index, m.index + m[0].length])
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

  if (matches.length === 0) return { data, positions }

  if (matches[0][0] !== 0) {
    const pre = matches.shift()!
    data.push(string.substr(0, pre[0]))

    positions.push(data.length)
    data.push(string.substr(pre[0], pre[1] - pre[0]))
  }

  for (const matchIndex in matches) {
    const current = matches[matchIndex]
    const next = matches[Number(matchIndex) + 1]
    positions.push(data.length)
    data.push(string.substr(current[0], current[1] - current[0]))

    if (next && current[1] != next[0])
      data.push(string.substr(current[1], next[0] - current[1]))
  }

  if (matches[matches.length - 1]) {
    const lastMatchIndex = matches[matches.length - 1][1]
    if (lastMatchIndex !== string.length)
      data.push(string.substr(lastMatchIndex, string.length - lastMatchIndex))
  }
  return { data, positions }
}

export default patternGrab
