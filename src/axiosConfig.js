import axios from 'axios';

//spring 서버 요청
const userServer = axios.create({
    baseURL: "https://localhost:443/api/v1",
    headers: {
        'Content-Type': 'application/json'
    }
});

//spring 서버 요청 인터셉터 추가
userServer.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const grantType = localStorage.getItem('grantType');

        if (accessToken) {
            config.headers.Authorization = `${grantType} ${accessToken}`;
        }
        return config;
    }
);

//날씨 서버 요청
const weatherServer = axios.create({
    baseURL: 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0'
});

//특보 서버 요청
const specialReportServer = axios.create({
    baseURL: 'https://apis.data.go.kr/1360000/WthrWrnInfoService'
});

const coolingCentreServer = axios.create({
    baseURL: 'https://openapi.seoul.go.kr:8088'
});

export {
    userServer,
    weatherServer,
    specialReportServer,
    coolingCentreServer
}