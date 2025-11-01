/**
 *  98진법->84진법을 구성하기 위한
 * 데이터를 얻기위해 임시로 구성한 코드들 입니다.
 */

const fs = require("fs")
//const Hangul = require('hangul-js')

/**
 *  구성 중인 무궁화72용 공용 함수 라이브러리
 */
const mugunghwa = require("../mugunghwa.js")

/**
 * 필터링 되지 않은 98가지 글자 목록
 */
const nonFiltered98CharMap = [
	"나", "난", "내", "다", "단", "담", "도", "라", "래", "류", "리", "모",
	"무", "미", "민", "사", "산", "상", "새", "생", "서", "선", "설", "섬",
	"성", "소", "솔", "솜", "송", "수", "시", "신", "실", "심", "아", "안",
	"애", "양", "여", "연", "예", "오", "온", "요", "우", "월", "유", "윤",
	"율", "은", "이", "일", "임", "정", "차", "창", "채", "천", "첨", "청",
	"초", "총", "표", "하", "한", "해", "향", "현", "혼", "홍", "화", "효", // 여기까지 72진
	"남", "눈", "달", "당", "봄", "비", "슬", "열", "영", "자", "태", "혜", // 12보수
	"날", "늘", "분", "샘", "순", "인", "장", "전", "종", "주", "지", "진",
	"찬", "처" // 14보수
]

// 필터링 되지 않은 글자 목록 정렬법
// console.log(JSON.stringify(nonFiltered98CharMap.sort()))

// 필터링 되지 않은 84진법 글자들을 txt로 출력합니다.
fs.writeFileSync(__dirname + "/98_non_filtered.txt", mugunghwa.getNonFilteredWordsTxt(98, nonFiltered98CharMap))

/**
 *  필터링 된 84진법 단어 목록
 *  (최종적으로 출력되는 배열입니다!)
 */
var filtered84BaseWordsMap = []

/**
 * 98진법 단어 중 지양해야할 단어 목록
 */
var negativeWords = []

/**
 * 지양해야할 단어 목록을 파일에서 불러옵니다.
 */
var loadNegativeWordsFile = (filleName, charMap) => {
	var filterData = fs.readFileSync(filleName, "utf8").split(" ")
	for (let filterWord of filterData) {
		if(filterWord.length == 0) continue // 메모장에 적힌게 없으면 넘어가기

		let wordIndex = mugunghwa.getWordIndex(filterWord, charMap, 98)
		if(negativeWords.indexOf(wordIndex) != -1) continue
		negativeWords.push(wordIndex)
	}
}

loadNegativeWordsFile(__dirname + "/84_negative_words.txt", nonFiltered98CharMap)
loadNegativeWordsFile(__dirname + "/98_negative_words.txt", nonFiltered98CharMap)

// 설계상 존재할 수 있는 98진법 상 최대 숫자를 구합니다.
var available98BaseCount = mugunghwa.decimalBase([98, 98], [97, 97]) + 1

// 설계 상 존재할 수 있는 84진법 상 최대 숫자를 구합니다.
var available84BaseCount = mugunghwa.decimalBase([84, 84], [83, 83]) + 1

// 설계 상 필터로 쓰일 수 있는 단어의 갯수를 진법 차로 구합니다.
var availableFilterCount = available98BaseCount - available84BaseCount - 1872

// 설계 상 필터가 적용가능한 최대 퍼센트를 구합니다.
var availableFilterPercentage = (availableFilterCount / (available98BaseCount-available84BaseCount)) * 100

/**
 * 필터링 된 84진법을 구성합니다.
 */
var filterize = () => {
	let filteredMap = []
	for (let i = 0; i < available98BaseCount; i++) {
		let isNegativeWord = negativeWords.indexOf(i) !== -1
		if (isNegativeWord) continue
		let charIndexMatrix = mugunghwa.multipleBase([98, 98], i)

		let encodedWord = nonFiltered98CharMap[charIndexMatrix[0]] + nonFiltered98CharMap[charIndexMatrix[1]]
		filteredMap.push(encodedWord)
	}
	filtered84BaseWordsMap = filteredMap
}

filterize()

// 이전에 구성한 지향 단어 목록을 가져옵니다.
var previousCompletedWords = []

/**
 * 이전 진법에서 구성한 완성된 출력 데이터를 가져옵니다.
 */
var load84FilteredFile = () => {
	var filterData = fs.readFileSync(__dirname + "/84_filtered.txt", "utf8").split(" ")

	for (let filterWord of filterData) {
		if(filterWord.length == 0) continue
		let wordIndex = mugunghwa.getWordIndex(filterWord, nonFiltered98CharMap, 84)
		if(previousCompletedWords.indexOf(wordIndex) != -1) continue
		previousCompletedWords.push(wordIndex)
	}
}

load84FilteredFile()

/**
 * 필터링 구성된 결과물들을 txt로 출력합니다.
 */
var outputResult = () => {
	let filteredWordsTxt = ""
	let targetWordsTxt = ""
	let targetWordsTxtCount = 0
	let notUsedWordsTxt = ""

	let successfullyLoopCount = 0
	for (let i = 0; i < (available98BaseCount); i++) {

		// 분류된(혹은 분류중인) 글자 조합 수 만큼만 생산 (84진법으로 만들어야함)
		if(typeof(filtered84BaseWordsMap[i]) == "undefined"){
			console.log(`${i}번째에서 생산중단`)
			break
		}

		let wordIndex = mugunghwa.getWordIndex(filtered84BaseWordsMap[i], nonFiltered98CharMap, 84)

		// 부정단어 조합일 경우 넘어가기
		//if(negativeWords.indexOf(wordIndex) != -1) continue

		filteredWordsTxt += `${filtered84BaseWordsMap[i]} `
		successfullyLoopCount ++

		if(previousCompletedWords.indexOf(wordIndex) == -1){
			targetWordsTxt += `${filtered84BaseWordsMap[i]} `
			if(++targetWordsTxtCount == 26){
				targetWordsTxt += "\r\n"
				targetWordsTxtCount = 0
			}
		}
	}
	console.log(`정상작성 수 : ${successfullyLoopCount}`)

	fs.writeFileSync(__dirname + "/98_filtered.txt", filteredWordsTxt)
	fs.writeFileSync(__dirname + "/98_target.txt", targetWordsTxt)
	
	if(notUsedWordsTxt.length != 0)
		fs.writeFileSync(__dirname + "/98_filter_not_used_words.txt", notUsedWordsTxt)
}

outputResult()

var remainBase14UniqueCount = filtered84BaseWordsMap.length-available84BaseCount

/**
 * 84->72진법의 목표 달성 상태를 출력합니다.
 */
var printStatus = () => {
	var negativeWordsLength = negativeWords.length - 1872
	
	console.log("------------------기본정보------------------")
	console.log(`98진법 최대 경우수: ${available98BaseCount}`)
	console.log(`84진법 최대 경우수: ${available84BaseCount}`)
	console.log(`보완가능한 단어수: ${availableFilterCount}`)
	console.log(`최종적으로 보완되는 단어수: ${availableFilterPercentage}%`)
	console.log("------------------구성상태------------------")
	console.log(`현재 구성된 맵개수: ${filtered84BaseWordsMap.length}(${remainBase14UniqueCount}개 여분)`)
	console.log(`현재 구성된 배제수: ${negativeWordsLength}개`)
	console.log("------------------달성상태------------------")
	console.log(`14보수 이용 퍼센트: ${negativeWordsLength/availableFilterCount*100}%`)
	console.log(`14보수 현재 이용률: ${negativeWordsLength}/${availableFilterCount}`)
	console.log(`제거 가능한 단어수: ${availableFilterCount-negativeWordsLength}개`)
}

printStatus()