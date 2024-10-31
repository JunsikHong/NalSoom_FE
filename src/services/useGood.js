import { userServer } from '@/axiosConfig';

//좋아요 가져오기
export const getGoodData = async () => {
    const response = await userServer.get('/good');
    return response.data;
}

//좋아요 post
export const postGoodData = async (shelterProperNum) => {
    const response = await userServer.post('/good', {
        shelterProperNum : shelterProperNum
    });
    return response.data;
}

//좋아요 delete
export const deleteGoodData = async (goodProperNum) => {
    const response = await userServer.delete(`/good/${goodProperNum}`);
    return response.data;
}
