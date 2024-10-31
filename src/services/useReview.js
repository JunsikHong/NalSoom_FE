import { userServer } from '@/axiosConfig';


//리뷰 가져오기
export const getReviewDataList = async (shelterProperNum) => {
    var response = null;
    if(localStorage.getItem('accessToken') !== '' && localStorage.getItem('accessToken') !== null) {
        response = await userServer.get(`/review/private/${shelterProperNum}`);
    } else {
        response = await userServer.get(`/review/public/${shelterProperNum}`);
    }
    return response.data;
}

//내 리뷰 가져오기 (마이페이지)
export const getMyReviewDataList = async (shelterProperNum) => {
    const response = await userServer.get(`/review/my-review/${shelterProperNum}`);
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

//리뷰 신고
export const postComplaintReviewData = async (complaintReviewProperNum, complaintReviewContent) => {
    const response = await userServer.post('/review/complaint', {
        reviewProperNum : complaintReviewProperNum,
        complaintContent : complaintReviewContent
    });
    return response.data;
}

//리뷰 수정
export const updateReviewData = async (updateReviewContent, shelterProperNum) => {
    const response = await userServer.put('/review', {
        reviewContent : updateReviewContent,
        shelterProperNum : shelterProperNum
    });
    return response.data;
}

//리뷰 삭제
export const deleteReviewData = async (reviewProperNum) => {
    const response = await userServer.delete(`/review/${reviewProperNum}`);
    return response.data;
}