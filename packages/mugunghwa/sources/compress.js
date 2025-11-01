const fs = require('fs')
const LZString = require('../lz-string.min.js')

var encodeTable = fs.readFileSync('./sources/84_filtered.txt', 'utf8').split(' ').join('')
var fixMap = JSON.stringify(require('./fixmap.json'))
var charMap = (require('./charmap.json').join(''))
var seperatorMap = (require('./seperatormap.json').join(''))

var compressedTable = LZString.compressToEncodedURIComponent(encodeTable)
var compressedFixMap = LZString.compressToEncodedURIComponent(fixMap)
var compressedCharMap = LZString.compressToEncodedURIComponent(charMap)
var compressedSeperatorMap = LZString.compressToEncodedURIComponent(seperatorMap)

fs.writeFileSync("./sources/compress_table.txt", compressedTable)
fs.writeFileSync("./sources/compress_fixmap.txt", compressedFixMap)
fs.writeFileSync("./sources/compress_charmap.txt", compressedCharMap)
fs.writeFileSync("./sources/compress_seperatormap.txt", compressedSeperatorMap)

console.log('데이터 압축이 완료되었습니다.')