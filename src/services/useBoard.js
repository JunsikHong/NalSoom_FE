import { userServer } from '@/axiosConfig';

// 게시판 가져오기
export const getBoardData = async (searchShelter, searchShelterType, searchSortBy, searchPaging, searchSize) => {
    const queryParams = new URLSearchParams();

    queryParams.set('searchShelterType', searchShelterType || 'normal');
    queryParams.set('searchSortBy', searchSortBy || 'good');
    if(searchShelter.length > 0) {
    }
    queryParams.set('searchPaging', searchPaging || 0);
    queryParams.set('searchSize', searchSize || 10);

    const queryString = `/board/shelter?${queryParams.toString()}`;
    const response = await userServer.get(queryString);

    return response.data;
}
