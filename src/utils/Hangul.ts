export const getConstantVowel = (kor: string) => {
    // prettier-ignore
    const firstConsonant = [
                'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
                'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
                'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    // prettier-ignore
    const middleVowel = [
                'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
                'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
                'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    // prettier-ignore
    const lastConsonant = [
                '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
                'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
                'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
                'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    /*
     * Hangul Unicode
     * UTF-16 [AC00 ~ D7AF]
     * Basecode [(16 ^ 3) * 10 + (16 ^ 2) * 12 + 16 * 0 + 0 = 44032]
     */

    /*
     * 한글을 Unicode로 바꾸었을 때 자음들은 12593부터 12643 사이의 값을 가진다
     * 자음과 모음을 합친 경우 -> '가' 부터 '힣'까지의 값들은 44032부터 55203까지의 값을 가진다
     * 그렇기에 확인하고자 하는 String을 Unicode로 변환 후 해당 값을 확인하면 된다
     *
     * 한글의 유니코드 값은 다음과 같이 정해진다
     * 유니코드 값 = ( (초성 21) + 중성 ) 28 + 종성 + 0xAC00
     * 그렇기에 한글을 이루는 초 / 중 / 종성 값을 구할 때는 다음과 같이 분리하여 계산할 수 있다
     * 초성 = ( (문자코드 – 0xAC00) / 28 ) / 21
     * 중성 = ( (문자코드 – 0xAC00) / 28 ) % 21
     * 종성 = (문자코드 – 0xAC00) % 28
     */

    /*
        TODO: 유니코드 범위 체크
     * regex /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g
     */
    /* const hangulUnicodeRangeRegex =
        /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g; */

    if (!kor && !checkIsKorean(kor)) {
        return;
    }

    const baseUnicode = 44032; // 가 / UTF-16 [AC00]
    let unicode = kor.charCodeAt(0);

    unicode = unicode - baseUnicode;

    const firstConsonantIndex = parseInt(unicode / 588); // 589마다 값 변경
    const middleVowelIndex = parseInt((unicode - firstConsonant * 588) / 28); // 29마다 값 변경
    const lastConsonantIndex = parseInt(unicode % 28); // Size 28 / 27개 (없음 포함 -> 28)

    return {
        firstConsonant: firstConsonant[firstConsonantIndex],
        middleVowel: middleVowel[middleVowelIndex],
        lastConsonant: lastConsonant[lastConsonantIndex],
    };
};

export const checkPrepositionalParticle = (kor: string, format = '') => {
    if (!kor && !checkIsKorean(kor)) {
        return;
    }

    const baseUnicode = 44032;
    const unicode = kor.charCodeAt(kor.length - 1);

    const consonantUnicode = (unicode - baseUnicode) % 28;

    if (consonantUnicode === 0) {
        return `${kor}${format}를`; // 0 이면 받침 없음
    }

    return `${kor}${format}을`; // 1 이상이면 받침 있음
};

export const checkIsKorean = (kor: string) => {
    if (!kor) {
        return;
    }

    const unicode = kor.charCodeAt(0);

    const isKorean =
        unicode >= 12593 && unicode <= 12643
            ? true
            : unicode >= 44032 && unicode <= 55203
            ? true
            : false;

    return isKorean;
};
/* 
export default { getConstantVowel, checkPrepositionalParticle, checkIsKorean };

export { default as HangulUtils } from '@/utils/Hangul';
 */

export const sortHangulFirst = (input: string[]) => {
    /* const patternAlphabet = /[a-zA-Z]/;
    const isAlphabet = (str: string) => patternAlphabet.test(str.charAt(0)); */

    const patternNumber = /[0-9]/;
    const patternAlphabet = /[a-zA-Z]/;
    const patternHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const orderLevelDesc = [patternNumber, patternAlphabet, patternHangul];
    // 배열의 역순으로 정렬이 된다.

    const getLevel = (str: string) => {
        const index = orderLevelDesc.findIndex(pattern => pattern.test(str));

        return index;
    };

    const sortGroupString = (source: string[]) => {
        // console.log('[removeDulicate] source', source)

        source.sort((a, b) => {
            const aLevel = getLevel(a.charAt(0));
            const bLevel = getLevel(b.charAt(0));

            if (aLevel === bLevel) {
                return a.charCodeAt(0) - b.charCodeAt(0);
            }

            return bLevel - aLevel; // 오름 차순 정렬
        });

        // console.log('[sortGroupString] result', source)
    };

    sortGroupString(input);

    // ['ㄱ', 'ㄴ', 'ㄷ', 'ㅋ', 'ㅎ', 'ㅠ', 'Z', 'a', 'b', 's', 'z', '1']
};

export const compareHangulFirst = (a, b) => {
    const addOrderPrefix = (str: string) => {
        const unicode = str.toLowerCase().charCodeAt(0);
        let prefix = '';

        // 한글 AC00 ~ D7AF
        if (unicode >= 0xac00 && unicode <= 0xd7af) prefix = '1';
        // 한글 자모 3130 ~ 318F
        else if (unicode >= 0x3130 && unicode <= 0x318f) prefix = '2';
        // 영어 소문자 0061 ~ 007A
        else if (unicode >= 0x61 && unicode <= 0x7a) prefix = '3';
        // 그 외
        else prefix = '9';

        return prefix + str;
    };

    a = addOrderPrefix(a);
    b = addOrderPrefix(b);

    if (a < b) {
        return -1;
    }

    if (a > b) {
        return 1;
    }

    return 0;

    // console.log(['1', '김', 'A'].sort(compareHangulFirst));
};
