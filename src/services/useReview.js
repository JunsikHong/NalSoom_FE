import { userServer } from '@/axiosConfig';


//리뷰 가져오기
export const getReviewDataList = async (shelterProperNum, reviewPaging, reviewPagingSize) => {
    var response = null;
    const queryParams = new URLSearchParams();
    queryParams.set('shelterProperNum', shelterProperNum);
    queryParams.set('reviewPaging', reviewPaging);
    queryParams.set('reviewPagingSize', reviewPagingSize);
    const queryString = `/review?${queryParams.toString()}`;

    response = await userServer.get(queryString);
    return response.data;
}

//내 리뷰 가져오기 (마이페이지)
export const getMyReviewDataList = async (shelterProperNum, reviewPaging, reviewPagingSize) => {
    var response = null;
    if(localStorage.getItem('accessToken') !== '' && localStorage.getItem('accessToken') !== null) {
        response = await userServer.get(`/review/my-review/${shelterProperNum}/${reviewPaging}/${reviewPagingSize}`);
    }
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
    const response = await userServer.post('/complaint', {
        reviewProperNum : complaintReviewProperNum,
        complaintContent : complaintReviewContent
    });
    return response.data;
}

//리뷰 수정
export const updateReviewData = async (shelterProperNum, updateReviewProperNum, updateReviewContent) => {
    const response = await userServer.put('/review', {
        reviewProperNum : updateReviewProperNum,
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
