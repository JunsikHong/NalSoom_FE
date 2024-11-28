import axios from 'axios';

//spring 서버 요청
const userServer = axios.create({
    baseURL: "/api/v1",
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

//서울 공공데이터 서버 요청
const seoulDataServer = axios.create({
    baseURL: '/seoulapi'
});

export {
    userServer,
    weatherServer,
    specialReportServer,
    seoulDataServer
}