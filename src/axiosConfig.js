import axios from 'axios';

const userServer = axios.create({
    baseURL : "https://localhost:443/api/v1",
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