import axios from 'axios';

const userServer = axios.create({
    baseURL : "https://127.0.0.1:443/api/v1",
    headers : {
        'Content-Type' : 'application/json'
    }
});

const weatherServer = axios.create({

});

export {
    userServer,
    weatherServer
}