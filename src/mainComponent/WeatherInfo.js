//css
import '@Style/WeatherInfo.css'

//lib
import { useState, useEffect, useMemo } from 'react';
import { weatherServer } from '@/axiosConfig';

//store
import useLocationStore from '@Store/locationStore';
import useTimeStore from '@Store/timeStore';

export default function WeatherInfo({ weatherAPIInfoAct }) {

    const { latitude, longitude } = useLocationStore(); //위치 정보
    const { currentDate, currentTime } = useTimeStore(); //날짜 시간 정보
    const [weatherInfo, setWeatherInfo] = useState(''); //예보 정보
    const [weatherGroupInfo, setWeatherGroupInfo] = useState([
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null }
    ]); //예보 정보 재구성

    //마운트 시 예보 정보 API 요청
    useEffect(() => {
        weatherServer.get('/getUltraSrtFcst', {
            params: {
                serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
                numOfRows: 70,
                pageNo: 1,
                dataType: 'JSON',
                base_date: currentDate,
                base_time: currentTime,
                nx: parseInt(latitude),
                ny: parseInt(longitude)
            }
        }).then(response => {
            setWeatherInfo(response);
        });
    }, []);

    //날씨 예보 응답 처리
    //날씨 예보 API 응답 데이터 셋팅 되고 값이 바뀔 때만 처리
    useMemo(() => {
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
            }
        }
    }, [weatherInfo]);
    
    //reducer로 Main페이지에 weatheInfo 전달
    useEffect(() => {
        weatherAPIInfoAct({ state: 'weatherAPIInfoUpdated', detail: weatherGroupInfo[0]}); 
    }, [weatherGroupInfo]);

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