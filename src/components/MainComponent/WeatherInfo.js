//css
import '@Style/WeatherInfo.css'

//lib
import { useEffect, useState } from 'react';
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
    const [ weatherInfo, setWeatherInfo ] = useState([]); //예보 정보 재구성
    const [ backgroundImage, setBackgroundImage ] = useState(null);

    //날씨 API Fetching
    const weatherData = useQuery({ queryKey: ['weatherData'], queryFn: () => getWeatherData(latitude, longitude, currentDate, currentTime) });

    //weatherData 불러오기 성공 시
    useEffect(() => {
        if(weatherData.isSuccess) {
            setWeatherInfo(weatherData.data);
            switch (weatherData.data[0].SKY) {
                case '1' :
                    setBackgroundImage(sunnyday);
                    break;
                default :
                    setBackgroundImage(cloudy); 
                    break;
            }
        }
    }, [weatherData.data]);

    // 시간 문자열을 변환하는 함수
    function formatTimeString(timeString) {
        const hour = parseInt(timeString.slice(0, 2), 10);
        const period = hour < 12 ? '오전' : '오후';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${formattedHour}시`;
    }

    return (
        <>
            <div className="weather-info-container">
                <div className="weather-info">
                    
                    {weatherInfo.length !== 0 &&
                        <div className='weather-info-current' style={{ backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: "cover", backgroundPosition: "center" }}>
                            <div className='weather-info-current-element'>
                                <div className='weather-info-current-element-head'>
                                    <p className='weather-info-current-location'>{locationNumber.region_1depth_name + ' ' + locationNumber.region_2depth_name + ' ' + locationNumber.region_3depth_name}</p>
                                    <p className='weather-info-current-time'>{formatTimeString(weatherInfo[0].fcstTime)}</p>
                                </div>
                                <div className='weather-info-current-element-body'>
                                    <p className='weather-info-current-sky'>{weatherInfo[0].SKY === '1' ? <WiDaySunny size={90} color='white' /> : <WiCloud size={90} color='white' />}</p>
                                    <p className='weather-info-current-t1h'>{weatherInfo[0].T1H}<WiCelsius size={35} color='white' /></p>
                                </div>
                                <div className='weather-info-another-location'>
                                    <p>●</p>
                                    <p>○</p>
                                    <p>○</p>
                                </div>
                            </div>
                        </div>
                    }

                    <ul className='weather-info-list'>
                        {weatherInfo.length !== 0 && weatherInfo.map((item, idx) => (
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