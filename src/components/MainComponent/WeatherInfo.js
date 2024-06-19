//css
import '@Style/WeatherInfo.css'

//lib
import { useState, useEffect, useMemo } from 'react';
import { weatherServer } from '@/axiosConfig';
import { WiDaySunny, WiCloud, WiCelsius } from 'weather-icons-react';

//store
import useLocationStore from '@/store/locationStore';
import useTimeStore from '@/store/timeStore';


export default function WeatherInfo({ weatherAPIInfoAct }) {

    const { latitude, longitude, locationNumber } = useLocationStore(); //위치 정보
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
                numOfRows: 60,
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
                setWeatherGroupInfo(updatedWeatherGroupInfo); //복사본을 GroupInfo에 저장
            }
        }
    }, [weatherInfo]);

    //reducer로 Main페이지에 weatheInfo 전달
    useEffect(() => {
        weatherAPIInfoAct({ state: 'weatherAPIInfoUpdated', detail: weatherGroupInfo[0] });
    }, [weatherGroupInfo]);

    // 시간 문자열을 변환하는 함수
    function formatTimeString(timeString) {
        // 문자열이 4자리인지 확인하고, 숫자로 변환
        if (timeString.length !== 4 || isNaN(timeString)) {
            return 'Invalid time format';
        }

        // 시간 부분만 추출 (예: "1300" -> 13)
        const hour = parseInt(timeString.slice(0, 2), 10);

        // 유효한 시간인지 확인
        if (hour < 0 || hour > 23) {
            return 'Invalid time value';
        }

        // 12시간 형식으로 변환
        const period = hour < 12 ? '오전' : '오후';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

        return `${period} ${formattedHour}시`;
    }


    return (
        <>
            <div className="weather-info-container">
                <div className="weather-info">
                    <div className='weather-info-current'>
                        {weatherInfo !== null && weatherInfo !== '' && locationNumber !== null ? (
                            weatherInfo.data.response.header.resultCode === '00' && weatherGroupInfo[5].WSD !== null ? (
                                <div className='weather-info-current-element'>
                                    <p className='weather-info-current-location'>{locationNumber.region_1depth_name + ' ' + locationNumber.region_2depth_name + ' ' + locationNumber.region_3depth_name}</p>
                                    <p className='weather-info-current-time'>{formatTimeString(weatherGroupInfo[0].fcstTime)}</p>
                                    <p className='weather-info-current-sky'>{weatherGroupInfo[0].SKY === '1' ? <WiDaySunny size={90} color='#000' /> : <WiCloud size={90} color='#000' />}</p>
                                    <p className='weather-info-current-t1h'>{weatherGroupInfo[0].T1H}<WiCelsius size={35} color='#000' /></p>
                                </div>
                            ) : (<p className='weather-info-error'>서버로부터 날씨정보를 불러오지 못했습니다</p>)
                        ) : (<p className='weather-info-error'>서버로부터 날씨정보를 불러오지 못했습니다</p>)}
                    </div>
                    <ul className='weather-info-list'>
                        {weatherInfo !== null && weatherInfo !== '' ? (
                            weatherInfo.data.response.header.resultCode === '00' && weatherGroupInfo[5].WSD !== null ? (
                                weatherGroupInfo.map((item, idx) => (
                                    <li className='weather-info-element' key={'weather-info-element' + idx}>
                                        <p className='weather-info-time'>{formatTimeString(item.fcstTime)}</p>
                                        <p className='weather-info-sky'>{item.SKY === '1' ? <WiDaySunny size={35} color='#000' /> : <WiCloud size={35} color='#000' />}</p>
                                        <p className='weather-info-t1h'>{item.T1H}<WiCelsius size={24} color='#000' /></p>
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