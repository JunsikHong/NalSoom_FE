import { userServer } from '@/axiosConfig';

//게시판 가져오기
export const getBoardData = async (mapShelters, searchSorting) => {
    var response = null;
    if(mapShelters.length === 0) {
        response = await userServer.get('/board/shelter');
    } else if (mapShelters.length === 1) {

    } else if (mapShelters.length > 1) {
        mapShelters = mapShelters.slice(0,9);
        const shelterSNArray = mapShelters.map(shelter => shelter.shelterSN);
        const typeArray = mapShelters.map(shelter => shelter.type);
        const shelterSN = `shelterSN=${shelterSNArray.join(',')}`;
        const type = `type=${typeArray.join(',')}`;
        response = await userServer.get(`/board/shelter/boundIn?${shelterSN}&${type}`);
    }
    return response.data;
}

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

//리뷰 가져오기
export const getReviewDataList = async (shelterProperNum) => {
    const response = await userServer.get(`/review/${shelterProperNum}`);
    return response.data;
}

//리뷰 쓰기
export const postReviewData = async (newReviewContent, shelterProperNum) => {
    const response = await userServer.post('/review', {
        reviewContent : newReviewContent,
        shelterProperNum : shelterProperNum
    });
    return response.data;
}