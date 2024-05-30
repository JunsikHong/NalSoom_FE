import * as server from 'axiosConfig';
import { useState, useEffect } from 'react';

export default function useForecasteInformation() {

    const [position, setPosition] = useState({ lat: null, lng: null }); //현재 위치
    const [currentDate, setCurrentDate] = useState(''); //현재 날짜
    const [currentTime, setCurrentTime] = useState(''); //현재 시간

    //현재 시간, 날짜, 위치 loading 후에 예보 요청
    useEffect(() => {
        const now = new Date();
        setCurrentDate(formatDate(now));
        setCurrentTime(formatTime(now));
        getPosition();
    }, []);

    if (position !== null && position !== '' &&
            currentDate !== null && currentDate !== '' &&
            currentTime !== null && currentTime !== '') {
            weatherRequest();
        }

    //현재 날짜 YYYYMMDD 형식
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    //현재 시간 HHmm 형식
    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}${minutes}`;
    };

    //현재 위치 불러오기
    const getPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            setPosition({
                lat: parseInt(position.coords.latitude),
                lng: parseInt(position.coords.longitude),
            });
        });
    }

    //날씨 예보 요청
    const weatherRequest = () => {
        server.weatherServer.get('', {
            params: {
                pageNo: 1,
                numOfRows: 1000,
                dataType: 'JSON',
                base_date: currentDate,
                base_time: currentTime,
                nx: position.lat,
                ny: position.lng
            }
        }).then(response => {
            console.log(response.data.response.body.items);
        });
    }

    return (
        <>
            <div className='forecast-info-conatiner'>
                <div className='forecaste-info'>

                </div>
            </div>
        </>
    );
}