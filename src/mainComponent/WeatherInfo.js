//css
import 'style/WeatherInfo.css'

//lib
import { useState, useEffect } from 'react';
import * as server from 'axiosConfig';  

export default function WeatherInfo({ locationInfoState, timeInfoState, weatherAPIInfoAct }) {

    const [weatherInfo, setWeatherInfo] = useState(''); //예보 정보
    const [weatherGroupInfo, setWeatherGroupInfo] = useState([
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null }
    ]); //예보 정보 재구성

    //location, time reducer 변경될 때 예보 API 호출
    useEffect(() => {
        console.log(timeInfoState)
        console.log(locationInfoState)
        if (timeInfoState.detail.currentDate !== null &&
            timeInfoState.detail.currentDate !== '' &&
            timeInfoState.detail.currentTime !== null &&
            timeInfoState.detail.currentTime !== '' &&
            locationInfoState.detail.latitude !== null &&
            locationInfoState.detail.latitude !== '' &&  
            locationInfoState.detail.longitude !== null &&
            locationInfoState.detail.longitude !== '') {
            console.log('조건만족?')
            weatherRequest();
        }
    }, [locationInfoState, timeInfoState]);

    //날씨 예보 API 응답 데이터 셋팅 될 때 처리
    useEffect(() => {
        weatherResponse();
    }, [weatherInfo]);

    //reducer로 Main페이지에 weatherInfo 전달
    useEffect(() => {
        weatherAPIInfoAct({
            state: 'weatherAPIInfoUpdated',
            detail: weatherGroupInfo[0]
        });
    }, [weatherGroupInfo]);

    //날씨 예보 요청 ENC키 응답없을 때 DEC키 요청
    function weatherRequest() {
        server.weatherServer.get('/getUltraSrtFcst', {
            params: {
                serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_ENC,
                numOfRows: 70,
                pageNo: 1,
                dataType: 'JSON',
                base_date: timeInfoState.detail.currentDate,
                base_time: timeInfoState.detail.currentTime,
                nx: locationInfoState.detail.latitude,
                ny: locationInfoState.detail.longitude
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
                            base_date: timeInfoState.detail.currentDate,
                            base_time: timeInfoState.detail.currentTime,
                            nx: locationInfoState.detail.latitude,
                            ny: locationInfoState.detail.longitude
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
                return 1;
            }
        }
    }

    return (
        <>
            <div className="weather-info-container">
                <div className="weather-info">
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