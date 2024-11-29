import { userServer } from '@/axiosConfig';

export const checkIdDuplicate = async (joinIdValue) => {
    console.log(joinIdValue);
    const response = await userServer.post('/user/idDuplicateCheck', {
        userId: joinIdValue
    });
    return response.data;
}

export const sendEmail = async (joinEmailValue, joinEmailTailValue) => {
    const response = await userServer.post('/user/sendEmail', {
        userEmail: joinEmailValue + '@' + joinEmailTailValue
    });
    return response.data;
}

export const checkEmail = async (joinEmailAuthValue) => {
    const response = await userServer.post('/user/checkEmail', {
        joinEmailAuthValue : joinEmailAuthValue
    });
    return response.data;
}

export const putUserAuthData = async (joinIdValue, joinPwValue, joinNameValue, joinEmailValue, joinEmailTailValue, joinAddressValue) => {
    const response = await userServer.post('/user/join', {
        userId: joinIdValue,
        userPw: joinPwValue,
        userName: joinNameValue,
        userEmail: joinEmailValue + '@' + joinEmailTailValue,
        userAddress : joinAddressValue
    });
    return response.data;
}