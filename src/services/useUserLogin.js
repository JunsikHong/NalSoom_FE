import { userServer } from '@/axiosConfig';

export const getUserAuthData = async (loginIdValue, loginPwValue) => {
    const response = await userServer.post('/user/login', {
        userId: loginIdValue,
        userPw: loginPwValue
    });
    return response.data;
}