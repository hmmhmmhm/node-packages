/**
 * Returns position values with strings
 * matching the regular expression.
 */
export declare const getPositions: (regex: RegExp, string: string) => [number, number][];
/**
 * It returns array that includes string of match
 * the regular expression with not matched string.
 *
 * @returns
 * - data - Well-bundled array of strings.
 * - position - It is index array of elements matching regular expressions during string arrays.
 */
export declare const patternGrab: ({ regex, string }: {
    regex: RegExp;
    string: string;
}) => {
    data: string[];
    positions: number[];
};
export default patternGrab;
