"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternGrab = exports.getPositions = void 0;
/**
 * Returns position values with strings
 * matching the regular expression.
 */
var getPositions = function (regex, string) {
    var m = null;
    var positions = [];
    var pattern = new RegExp(regex.source, regex.flags);
    while ((m = pattern.exec(string)) !== null) {
        positions.push([m.index, m.index + m[0].length]);
        // Prevent infinite loop on zero-width matches
        if (m[0].length === 0) {
            pattern.lastIndex++;
        }
    }
    return positions;
};
exports.getPositions = getPositions;
/**
 * It returns array that includes string of match
 * the regular expression with not matched string.
 *
 * @returns
 * - data - Well-bundled array of strings.
 * - position - It is index array of elements matching regular expressions during string arrays.
 */
var patternGrab = function (_a) {
    var regex = _a.regex, string = _a.string;
    var matches = (0, exports.getPositions)(regex, string);
    var data = [];
    var positions = [];
    if (matches.length === 0) {
        return { data: data, positions: positions };
    }
    if (matches[0][0] !== 0) {
        data.push(string.substring(0, matches[0][0]));
    }
    for (var matchIndex = 0; matchIndex < matches.length; matchIndex++) {
        var current = matches[matchIndex];
        var next = matches[matchIndex + 1];
        positions.push(data.length);
        data.push(string.substring(current[0], current[1]));
        if (next && current[1] != next[0]) {
            data.push(string.substring(current[1], next[0]));
        }
    }
    if (matches[matches.length - 1]) {
        var lastMatchIndex = matches[matches.length - 1][1];
        if (lastMatchIndex !== string.length)
            data.push(string.substring(lastMatchIndex, string.length));
    }
    return { data: data, positions: positions };
};
exports.patternGrab = patternGrab;
exports.default = exports.patternGrab;
