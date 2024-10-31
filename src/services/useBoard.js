// import { userServer } from '@/axiosConfig';

// //게시판 가져오기
// export const getBoardData = async (mapShelters, searchTerm, searchShelterType, searchSorting, searchPaging) => {
//     var response = null;

//     var queryString = '/board/shelter';

//     queryString.concat('?searchTerm=')
//     if(searchTerm !== '') {
//         queryString.concat(searchTerm);
//     }

//     queryString.concat('/searchShelterType=')
//     if(searchShelterType !== '') {
//         queryString.concat(searchShelterType);
//     }

//     queryString.concat('/searchSorting=')
//     if(searchSorting !== '') {
//         queryString.concat(searchSorting);
//     }
    
//     if(searchSorting === 'distance' && mapShelters[0] !== undefined && mapShelters.length >= 1) {
//         mapShelters = mapShelters.slice(searchPaging, searchPaging+10);
//         const shelterSNArray = mapShelters.map(shelter => shelter.shelterSN);
//         const typeArray = mapShelters.map(shelter => shelter.type);
//         const shelterSN = `shelterSN=${shelterSNArray.join(',')}`;
//         const type = `type=${typeArray.join(',')}`;
//         queryString.concat(`/shelterSN=${shelterSN}`);
//         queryString.concat(`&type=${type}`);
//     } else {
//         queryString.concat('/searchPaging=')
//         queryString.concat(searchPaging);
//     }

//     response = await userServer.get(queryString);

//     return response.data;
// }


import { userServer } from '@/axiosConfig';

// 게시판 가져오기
export const getBoardData = async (mapShelters, searchShelterType, searchSortBy, searchSortDirection, searchPaging, searchSize) => {
    const queryParams = new URLSearchParams();

    queryParams.set('searchShelterType', searchShelterType || 'normal');
    queryParams.set('searchSortBy', searchSortBy || 'good');
    queryParams.set('searchSortDirection', searchSortDirection || 'desc');
    if(searchSortBy === 'distance' && mapShelters[0] !== undefined && mapShelters.length > 0) {
        queryParams.set('shelterProperNum', mapShelters.shelterProperNum.join(','));
    }
    queryParams.set('searchPaging', searchPaging || 0);
    queryParams.set('searchSize', searchSize || 10);

    const queryString = `/board/shelter?${queryParams.toString()}`;
    const response = await userServer.get(queryString);

    return response.data;
}
