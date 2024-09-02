//css
import '@Style/WeatherInfo.css'

//lib
import { useState } from 'react';
import { WiDaySunny, WiCloud, WiCelsius } from 'weather-icons-react';
import { useQuery } from '@tanstack/react-query';
import { getWeatherData } from '@Services/useWeatherAPI';

//store
import useLocationStore from '@Store/locationStore';
import useTimeStore from '@Store/timeStore';

//img
import cloudy from '@Images/cloudy.png';
import rainy from '@Images/rainy.png';
import sunnyday from '@Images/sunnyday.png';

export default function WeatherInfo() {

    const { latitude, longitude, locationNumber } = useLocationStore(); //위치 정보
    const { currentDate, currentTime } = useTimeStore(); //날짜 시간 정보
    const [weatherGroupInfo, setWeatherGroupInfo] = useState([
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null },
        { fcstTime: null, LGT: null, PTY: null, RN1: null, SKY: null, T1H: null, REH: null, UUU: null, VVV: null, VEC: null, WSD: null }
    ]); //예보 정보 재구성

    //날씨 API Fetching
    const { isLoading, isSuccess, isError, data, error } = useQuery({ queryKey: ['weatherData'], queryFn: () => getWeatherData(latitude, longitude, currentDate, currentTime) });

    //날씨 예보 응답 처리
    function weatherDataHandling(weatherData) {
        const updatedWeatherGroupInfo = [...weatherGroupInfo]; //state 복사본 생성
        if(weatherData.response !== null) {
            weatherData.response.body.items.item.map((element, index) => { //반복 시 0~5인덱스에만 저장
                updatedWeatherGroupInfo[index % 6].fcstTime = element.fcstTime;
                element.category === 'LGT' && (updatedWeatherGroupInfo[index % 6].LGT = element.fcstValue)
                element.category === 'PTY' && (updatedWeatherGroupInfo[index % 6].PTY = element.fcstValue)
                element.category === 'RN1' && (updatedWeatherGroupInfo[index % 6].RN1 = element.fcstValue)
                element.category === 'SKY' && (updatedWeatherGroupInfo[index % 6].SKY = element.fcstValue)
                element.category === 'T1H' && (updatedWeatherGroupInfo[index % 6].T1H = element.fcstValue)
                element.category === 'REH' && (updatedWeatherGroupInfo[index % 6].REH = element.fcstValue)
                element.category === 'UUU' && (updatedWeatherGroupInfo[index % 6].UUU = element.fcstValue)
                element.category === 'VVV' && (updatedWeatherGroupInfo[index % 6].VVV = element.fcstValue)
                element.category === 'VEC' && (updatedWeatherGroupInfo[index % 6].VEC = element.fcstValue)
                element.category === 'WSD' && (updatedWeatherGroupInfo[index % 6].WSD = element.fcstValue)
            });
        }
    }

    // 시간 문자열을 변환하는 함수
    function formatTimeString(timeString) {
        const hour = parseInt(timeString.slice(0, 2), 10);
        const period = hour < 12 ? '오전' : '오후';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${formattedHour}시`;
    }

    //loading, success, error 처리
    if (isLoading) {
        return <div>loading...</div>
    }

    if (isError) {
        return <div>error : {error.message}</div>
    }

    if (isSuccess) {
        weatherDataHandling(data);
    }

    let backgroundImage = null;
    if(weatherGroupInfo[0].SKY === '1') backgroundImage = sunnyday
    else backgroundImage = cloudy;

    return (
        <>
            <div className="weather-info-container">
                <div className="weather-info">
                    <div className='weather-info-current' style={{backgroundImage : 'url('+backgroundImage+')', backgroundSize : "cover", backgroundPosition : "center"}}>
                        <div className='weather-info-current-element'>
                            <div className='weather-info-current-element-head'>
                                <p className='weather-info-current-location'>{locationNumber.region_1depth_name + ' ' + locationNumber.region_2depth_name + ' ' + locationNumber.region_3depth_name}</p>
                                <p className='weather-info-current-time'>{formatTimeString(weatherGroupInfo[0].fcstTime)}</p>
                            </div>
                            <div className='weather-info-current-element-body'>
                                <p className='weather-info-current-sky'>{weatherGroupInfo[0].SKY === '1' ? <WiDaySunny size={90} color='white' /> : <WiCloud size={90} color='white' />}</p>
                                <p className='weather-info-current-t1h'>{weatherGroupInfo[0].T1H}<WiCelsius size={35} color='white' /></p>
                            </div>
                            <div className='weather-info-another-location'>
                                <p>●</p>
                                <p>○</p>
                                <p>○</p>
                            </div>
                        </div>
                    </div>
                    <ul className='weather-info-list'>
                        {weatherGroupInfo.map((item, idx) => (
                            <li className='weather-info-element' key={'weather-info-element' + idx}>
                                <p className='weather-info-time'>{formatTimeString(item.fcstTime)}</p>
                                <p className='weather-info-sky'>{item.SKY === '1' ? <WiDaySunny size={35} color='#000' /> : <WiCloud size={35} color='#000' />}</p>
                                <p className='weather-info-t1h'>{item.T1H}<WiCelsius size={24} color='#000' /></p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}