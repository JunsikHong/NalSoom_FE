import { specialReportServer } from '@/axiosConfig';

export const getSpecialReportData = async (locationCode, currentDate) => {
    const response = await specialReportServer.get('/getWthrWrnList', {
        params: {
            serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
            numOfRows: 10,
            pageNo: 1,
            dataType: 'JSON',
            stnId: locationCode,
            fromTmFc: currentDate,
            toTmFc: currentDate
        }
    });

    const key = Object.keys(response.data.response);
    if(key.includes('headers')) return;
    if(response.data.response.header.resultCode !== '00') return;

    return response.data;
}