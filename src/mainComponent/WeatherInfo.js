//css
import 'style/WeatherInfo.css'

//component
import * as componentDepth1 from './mainComponentDepth1';

//lib
import { useState, useEffect } from 'react';
import * as server from 'axiosConfig';

export default function WeatherInfo({ weatherAPIInfoAct }) {

    const [position, setPosition] = useState({ lat: null, lng: null }); //현재위치
    const [currentDate, setCurrentDate] = useState(''); //현재 날짜
    const [currentTime, setCurrentTime] = useState(''); //현재 시간
    const [weatherInfo, setWeatherInfo] = useState(''); //예보정보
    const [weatherGroupInfo, setWeatherGroupInfo] = useState([
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null }
    ]);

    //mount시에 현재 시간, 날짜, 위치 loading
    useEffect(() => {
        return () => {
            setCurrentDate(formatDate());
            setCurrentTime(formatTime());
            setPosition(currentPositionUpdate());
        }
    }, []);

    //state 변경될 때 예보 API 호출
    useEffect(() => {
        if (currentDate !== null && currentDate !== '' &&
            currentTime !== null && currentTime !== '' &&
            position !== null && position !== '') {
            weatherRequest();
        }
    }, [position, currentDate, currentTime]);

    //API 응답 데이터 셋팅 될 때 처리
    useEffect(() => {
        weatherResponse();
    }, [weatherInfo]);

    //reducer로 Main페이지에 weatherInfo 전달
    // useEffect(() => {
    //     weatherAPIInfoAct({state : 'APIInfoUpdated',
    //                        detail : weatherGroupInfo[0]});
    // }, [weatherGroupInfo]);

    //현재 날짜 YYYYMMDD 형식
    function formatDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    //현재 시간 HHmm 형식
    function formatTime() {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        return `${hours - 1}00`;
    }

    //현재 위치 불러오기
    function currentPositionUpdate() {
        const currentPosition = { lat: null, lng: null };
        navigator.geolocation.getCurrentPosition(position => {
            currentPosition.lat = parseInt(position.coords.latitude);
            currentPosition.lng = parseInt(position.coords.longitude);
        });
        return currentPosition;
    }

    //날씨 예보 요청 ENC키 응답없을 때 DEC키 요청
    function weatherRequest() {
        server.weatherServer.get('/getUltraSrtFcst', {
            params: {
                serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_ENC,
                numOfRows: 70,
                pageNo: 1,
                dataType: 'JSON',
                base_date: currentDate,
                base_time: currentTime,
                nx: position.lat,
                ny: position.lng
            }
        }).then(response => {
            if (response.data.response !== null) {
                if (response.data.response.header.resultCode !== '00') {
                    server.weatherServer.get('/getUltraSrtFcst', {
                        params: {
                            serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
                            numOfRows: 70,
                            pageNo: 1,
                            dataType: 'JSON',
                            base_date: currentDate,
                            base_time: currentTime,
                            nx: position.lat,
                            ny: position.lng
                        }
                    }).then(response => {
                        setWeatherInfo(response);
                    })
                } else {
                    setWeatherInfo(response);
                }
            } else {
                setWeatherInfo(response);
            }
        });
    }

    //날씨 예보 응답 처리
    function weatherResponse() {
        if (weatherInfo !== null && weatherInfo !== '') {
            if (weatherInfo.data.response.header.resultCode === '00') {
                const updatedWeatherGroupInfo = [...weatherGroupInfo]; //state 복사본 생성
                weatherInfo.data.response.body.items.item.map((element, index) => { //반복 시 0~5인덱스에만 저장
                    updatedWeatherGroupInfo[index % 6].fcstTime = element.fcstTime;
                    updatedWeatherGroupInfo[index % 6].LGT = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].PTY = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].RN1 = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].SKY = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].T1H = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].REH = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].UUU = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].VVV = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].VEC = element.fcstValue;
                    updatedWeatherGroupInfo[index % 6].WSD = element.fcstValue;
                });
                setWeatherGroupInfo(updatedWeatherGroupInfo); //복사본을 GroupInfo에 저장
                console.log(weatherGroupInfo);
                return 1;
            }
        }
    }

    return (
        <>
            <div className="weather-info-container">
                <div className="weather-info">
                    <componentDepth1.Temperature />
                    <componentDepth1.FineDust />
                    <ul className='weather-info-list'>
                        {weatherInfo !== null && weatherInfo !== '' ? (
                            weatherInfo.data.response.header.resultCode === '00' && weatherGroupInfo[5].WSD !== null ? (
                                weatherGroupInfo.map((item, idx) => (
                                    <li className='weather-info-element' key={'weather-info-element' + idx}>
                                        <p className='weather-info-time'>시간 : {item.fcstTime}</p>
                                        <p className='weather-info-sky'>상태 : {item.SKY === 1 ? '맑음' : '흐림'}</p>
                                        <p className='weather-info-t1h'>온도 : {item.T1H}도</p>
                                        <p className='weather-info-pty'>강수 : {item.PTY === 0 ? '없음' : '비'}</p>
                                    </li>
                                ))
                            ) : (<p className='weather-info-error'>서버로부터 날씨정보를 불러오지 못했습니다</p>)
                        ) : (<p className='weather-info-error'>서버로부터 날씨정보를 불러오지 못했습니다</p>)}
                    </ul>
                </div>
            </div>
        </>
    );
}