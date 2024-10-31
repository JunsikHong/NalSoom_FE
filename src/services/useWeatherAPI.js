import { weatherServer } from '@/axiosConfig';

export const getWeatherData = async (latitude, longitude, currentDate, currentTime) => {
    const result = await weatherServer.get('/getUltraSrtFcst', {
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

    const key = Object.keys(result.data.response);
    if(key.includes('headers')) return;

    var weatherData = [...result.data.response.body.items.item];
    let tempWeatherInfo = [
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null }
    ];

    weatherData.map((element, index) => {
        tempWeatherInfo[index % 6].fcstTime = element.fcstTime;
        switch (element.category) {
            case 'LGT':
                tempWeatherInfo[index % 6].LGT = element.fcstValue;
            case 'PTY':
                tempWeatherInfo[index % 6].PTY = element.fcstValue;
            case 'RN1':
                tempWeatherInfo[index % 6].RN1 = element.fcstValue;
            case 'SKY':
                tempWeatherInfo[index % 6].SKY = element.fcstValue;
            case 'T1H':
                tempWeatherInfo[index % 6].T1H = element.fcstValue;
            case 'REH':
                tempWeatherInfo[index % 6].REH = element.fcstValue;
            case 'UUU':
                tempWeatherInfo[index % 6].UUU = element.fcstValue;
            case 'VVV':
                tempWeatherInfo[index % 6].VVV = element.fcstValue;
            case 'VEC':
                tempWeatherInfo[index % 6].VEC = element.fcstValue;
            case 'WSD':
                tempWeatherInfo[index % 6].WSD = element.fcstValue;
        }
    });
    return tempWeatherInfo;
}