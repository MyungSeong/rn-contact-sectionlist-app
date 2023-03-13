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
     * Hangeul Unicode
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
    /* const hangeulUnicodeRangeRegex =
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
