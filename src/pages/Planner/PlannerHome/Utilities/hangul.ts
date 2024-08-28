const HANGUL_START_CHARCODE = 0xac00;
const CHO_PERIOD = 21 * 28; // 초성 주기: 중성 * 종성
const JUNG_PERIOD = 28; // 중성 주기: 종성

const CHO_HANGUL = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const JUNG_HANGUL = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG_HANGUL =
  "ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅈㅉㅊㅋㅌㅍㅎ";

// 한글 음절 생성 함수
function combine(cho: number, jung: number, jong: number) {
  const hangulCode =
    HANGUL_START_CHARCODE + cho * CHO_PERIOD + jung * JUNG_PERIOD + jong;

  if (hangulCode < 0xac00 || hangulCode > 0xd7a3) {
    return "";
  }

  return String.fromCharCode(hangulCode);
}

// 초성, 중성에 따라 정규 표현식 생성
function makeFlexibleRegex(search = "") {
  let regex = "";

  for (let i = 0; i < search.length; i++) {
    const char = search[i];
    const choIndex = CHO_HANGUL.indexOf(char);
    const jungIndex = JUNG_HANGUL.indexOf(char);

    if (choIndex !== -1) {
      // 초성인 경우
      const startChar = combine(choIndex, 0, 0);
      const endChar = combine(
        choIndex,
        JUNG_HANGUL.length - 1,
        JONG_HANGUL.length - 1
      );
      regex += `[${startChar}-${endChar}]`;
    } else if (jungIndex !== -1) {
      // 중성인 경우
      const startChar = combine(0, jungIndex, 0);
      const endChar = combine(21 - 1, jungIndex, JONG_HANGUL.length - 1);
      regex += `[${startChar}-${endChar}]`;
    } else {
      // 다른 문자
      regex += char;
    }
  }

  return new RegExp(regex, "g");
}

// 초성, 중성, 종성으로 검색을 확인하는 함수
export function includeByChoJungJong(search: string, targetWord: string) {
  const regex = makeFlexibleRegex(search);
  return regex.test(targetWord);
}
