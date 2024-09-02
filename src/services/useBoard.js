import { userServer } from '@/axiosConfig';

export const getBoardData = async () => {
    const response = await userServer.get('/shelter/getBoardData');
    return response.data;
}

export const getGoodData = async () => {
    const response = await userServer.post('/good/getGoodData', {
        userProperNum : localStorage.getItem('user_proper_num')
    });
    return response.data;
}

// export const putGoodClick = async (goodClickItem) => {
//     const response = await userServer.post('/shelter/putGood', {
//         userToken : localStorage.getItem('accessToken'),
//         shelterType : goodClickItem.shelterType,
//         areaCD : goodClickItem.areaCD
//     });
//     return response.data;
// }