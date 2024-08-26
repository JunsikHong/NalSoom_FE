import { weatherServer } from '@/axiosConfig';

export const getWeatherData = async (latitude, longitude, currentDate, currentTime) => {
    const response = await weatherServer.get('/getUltraSrtFcst', {
        params: {
            serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
            numOfRows: 60,
            pageNo: 1,
            dataType: 'JSON',
            base_date: currentDate,
            base_time: currentTime,
            nx: parseInt(latitude),
            ny: parseInt(longitude)
        }
    });
    return response.data;
}