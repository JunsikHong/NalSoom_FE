import axios from 'axios';

const userServer = axios.create({
    baseURL: "https://localhost:443/api/v1",
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 추가
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

const weatherServer = axios.create({

});

export {
    userServer,
    weatherServer
}