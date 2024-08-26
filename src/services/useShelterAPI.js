import { seoulDataServer } from '@/axiosConfig';

export const getShelterData = async () => {
    let resultArray1 = [];
    const result1 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/1/1000/');
    const result2 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/1001/2000/');
    const result3 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/2001/3000/');
    resultArray1.push(...result1.data.TbGtnHwcwP.row);
    resultArray1.push(...result2.data.TbGtnHwcwP.row);
    resultArray1.push(...result3.data.TbGtnHwcwP.row);
    
    let resultArray2 = [];
    const result6 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnCwP/1/1000/');
    const result7 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnCwP/1001/1304/');
    resultArray2.push(...result6.data.TbGtnCwP.row);
    resultArray2.push(...result7.data.TbGtnCwP.row);

    let resultArray3 = [];
    const result8 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/shuntPlace/1/155/');
    resultArray3.push(...result8.data.shuntPlace.row);
    return {resultArray1, resultArray2, resultArray3};
}