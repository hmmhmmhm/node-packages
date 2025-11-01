/**
 *  84진법->72진법을 구성하기 위한
 * 데이터를 얻기위해 임시로 구성한 코드들 입니다.
 */

const fs = require("fs")

/**
 *  구성 중인 무궁화72용 공용 함수 라이브러리
 */
const mugunghwa = require("../mugunghwa.js")

/**
 * 필터링 되지 않은 84가지 글자 목록
 */
const nonFiltered84CharMap = [
	"나", "난", "내", "다", "단", "담", "도", "라", "래", "류", "리", "모",
	"무", "미", "민", "사", "산", "상", "새", "생", "서", "선", "설", "섬",
	"성", "소", "솔", "솜", "송", "수", "시", "신", "실", "심", "아", "안",
	"애", "양", "여", "연", "예", "오", "온", "요", "우", "월", "유", "윤",
	"율", "은", "이", "일", "임", "정", "차", "창", "채", "천", "첨", "청",
	"초", "총", "표", "하", "한", "해", "향", "현", "혼", "홍", "화", "효", // 여기까지 72진
	"남", "눈", "달", "당", "봄", "비", "슬", "열", "영", "자", "태", "혜"  // 12보완
]

/**
 * 해당 글자가 몇 번째 글자인지를 계산합니다.
 */
let getCharIndexMatrix = (word, nonFilteredMap) => {
	let firstWordIndex = nonFilteredMap.indexOf(word[0])
	let secondWordIndex = nonFilteredMap.indexOf(word[1])

	if (firstWordIndex === -1 || secondWordIndex === -1)
		throw new Error("[" + word + "] " + word.length)
	return [firstWordIndex, secondWordIndex]
}

/**
 * 해당 단어가 몇 번째 단어인지를 계산합니다.
 */
let getWordIndex = (word, nonFilteredMap, baseNumber) => {
	let wordIndex = mugunghwa.decimalBase([baseNumber, baseNumber], getCharIndexMatrix(word, nonFilteredMap))
	return wordIndex
}

/**
 * 필터링 되지 않은 단어목록을 계산합니다.
 */
let getNonFilteredWordsTxt = (base, nonFilteredCharMap) => {
	let txt = ""
	for (let i1 = 0; i1 <= (base - 1); i1++){
		for (let i2 = 0; i2 <= (base - 1); i2++){
			txt += `${nonFilteredCharMap[i1]}${nonFilteredCharMap[i2]} `
		}
	}
	return txt
}

/**
 * 특정 단어가 몇개 존재하는지 파악용
 */
let getAbsoluteFilterCountText = (base, nonFilteredCharMap, negativeWords) => {
	//후위형
	//홍-나홍 난홍 내홍
	let full = []
	for (let i1 = 0; i1 <= (base - 1); i1++){
		for (let i2 = 0; i2 <= (base - 1); i2++){
			full.push(`${nonFilteredCharMap[i1]}${nonFilteredCharMap[i2]}`)
		}
	}
	
	var abFilterMap = {}
	var index = 0
	for(var filterWord of full){
		var listCode = index%base
		var listKey = nonFilteredCharMap[listCode]
		
		if(typeof(abFilterMap[listKey]) == "undefined")
			abFilterMap[listKey] = []
		
		index++
		
		let wordIndex = mugunghwa.getWordIndex(filterWord, nonFilteredCharMap, base)
		
		if(negativeWords.indexOf(wordIndex) != -1)
			continue
		abFilterMap[listKey].push(filterWord)
	}
}

// 필터링 되지 않은 글자 목록 정렬법
// console.log(JSON.stringify(nonFiltered84CharMap.sort()))

// 필터링 되지 않은 84진법 글자들을 txt로 출력합니다.
fs.writeFileSync(__dirname + "/84_non_filtered.txt", getNonFilteredWordsTxt(84, nonFiltered84CharMap))

/**
 *  필터링 된 72진법 단어 목록
 *  (최종적으로 출력되는 배열입니다!)
 */
var filtered72BaseWordsMap = []

/**
 * 84진법 단어 중 지양해야할 단어 목록
 */
var negativeWords = []

/**
 * 지양해야할 단어 목록을 파일에서 불러옵니다.
 */
var loadNegativeWordsFile = () => {
	var filterData = fs.readFileSync(__dirname + "/84_negative_words.txt", "utf8").split(" ")

	for (let filterWord of filterData) {
		let wordIndex = getWordIndex(filterWord, nonFiltered84CharMap, 84)
		if(negativeWords.indexOf(wordIndex) != -1) continue
		negativeWords.push(wordIndex)
	}
}

loadNegativeWordsFile()

// 설계상 존재할 수 있는 84진법 상 최대 숫자를 구합니다.
var available84BaseCount = mugunghwa.decimalBase([84, 84], [83, 83]) + 1

// 설계 상 존재할 수 있는 72진법 상 최대 숫자를 구합니다.
var available72BaseCount = mugunghwa.decimalBase([72, 72], [71, 71]) + 1

// 설계 상 필터로 쓰일 수 있는 단어의 갯수를 진법 차로 구합니다.
var availableFilterCount = available84BaseCount - available72BaseCount

// 설계 상 필터가 적용가능한 최대 퍼센트를 구합니다.
var availableFilterPercentage = (availableFilterCount / available72BaseCount) * 100

/**
 * 필터링 된 72진법을 구성합니다.
 */
var filterize = () => {
	let filteredMap = []
	for (let i = 0; i < available84BaseCount; i++) {
		let isNegativeWord = negativeWords.indexOf(i) !== -1
		if (isNegativeWord) continue
		let charIndexMatrix = mugunghwa.multipleBase([84, 84], i)

		let encodedWord = nonFiltered84CharMap[charIndexMatrix[0]] + nonFiltered84CharMap[charIndexMatrix[1]]
		filteredMap.push(encodedWord)
	}
	filtered72BaseWordsMap = filteredMap
}

filterize()

/**
 * 필터링 구성된 결과물들을 txt로 출력합니다.
 */
var outputResult = () => {
	let filteredWordsTxt = ""
	let notUsedWordsTxt = ""

	for (let i = 0; i < (available72BaseCount); i++)
		filteredWordsTxt += `${filtered72BaseWordsMap[i]} `

	for (let i = (available72BaseCount); i < filtered72BaseWordsMap.length; i++)
		notUsedWordsTxt += `${filtered72BaseWordsMap[i]} `

	fs.writeFileSync(__dirname + "/84_filtered.txt", filteredWordsTxt)
	
	if(notUsedWordsTxt.length != 0)
		fs.writeFileSync(__dirname + "/84_filter_not_used_words.txt", notUsedWordsTxt)
}

outputResult()

/**
 * 84->72진법의 목표 달성 상태를 출력합니다.
 */
var printStatus = () => {
	console.log("------------------기본정보------------------")
	console.log(`84진법 최대 경우수: ${available84BaseCount}`)
	console.log(`72진법 최대 경우수: ${available72BaseCount}`)
	console.log(`12보수 최대 경우수: ${availableFilterCount}`)
	console.log(`12보수 보완 퍼센트: ${availableFilterPercentage}%`)
	console.log("------------------구성상태------------------")
	console.log(`현재 구성된 맵개수: ${filtered72BaseWordsMap.length}`)
	console.log(`현재 구성된 배제수: ${negativeWords.length}`)
	console.log("------------------달성상태------------------")
	console.log(`12보수 이용 퍼센트: ${negativeWords.length/availableFilterCount*100}%`)
	console.log(`12보수 현재 이용률: ${negativeWords.length}/${availableFilterCount}`)
	console.log(`제거 가능한 단어수: ${availableFilterCount-(negativeWords.length)}`)
}

printStatus()