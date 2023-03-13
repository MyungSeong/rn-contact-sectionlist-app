export const isNumber = (input: string) => {
    const regEx = /^[0-9]+$/;

    return regEx.test(input);
};

export const hasNumber = (input: string) => {
    const regEx = /[0-9]/;
    return regEx.test(input);
};

export const isSpecial = (input: string) => {
    const regEx = /[0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/gi; // 영어, 한글, 숫자 아닌 문자는 모두 특수문자라 정의함

    if (input.replace(regEx, '').length == input.length)
        return true; // 입력 문자길이와 regExp.text 실행한 문자길이가 같으면 모두 특수문자
    else return false;
};

export const hasSpecial = (input: string) => {
    const regEx = /[0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z ]/gi;

    if (input.replace(regEx, '').length === 0) {
        return false;
    } else {
        return true;
    }
};

export const isEnglish = (input: string) => {
    const regEx = /^[a-zA-Z]+$/;

    return regEx.test(input);
};

export const hasEnglish = (input: string) => {
    const regEx = /[a-zA-Z]/;

    return regEx.test(input);
};

export const isKorean = (input: string) => {
    const regEx = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/;

    return regEx.test(input);
};

export const hasKorean = (input: string) => {
    const regEx = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

    return regEx.test(input);
};
