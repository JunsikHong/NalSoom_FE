//css
import '@Style/Main.css';

//component
import Notification from '@MainComponent/Notification';
import Share from '@MainComponent/Share';
import ShelterDetailInfo from '@MainComponent/ShelterDetailInfo';
import ShelterMapInfo from '@MainComponent/ShelterMapInfo';
import WeatherInfo from '@MainComponent/WeatherInfo';

//store
import useLocationStore from '@Store/locationStore';
import useTimeStore from '@Store/timeStore';

//lib
import { useLayoutEffect } from 'react';

export default function Main() {

    const { latitude, longitude, locationNumber, locationCode, fetchLocation } = useLocationStore(); //좌표 정보
    const { currentDate, currentTime, formatDateTime } = useTimeStore(); //날짜 시간 정보

    //위치, 시간 정보 초기화
    useLayoutEffect(() => {
        fetchLocation();
        formatDateTime();
    }, []);

    return (
        <div>
            {latitude !== 0 && longitude !== 0 && locationNumber !== null && locationCode !== '' && currentDate !== '' && currentTime !== '' &&
                <div className='main-wrap'>
                    <div className='main'>
                        {/* 날씨 Component */}
                        <WeatherInfo />

                        {/* 대피소 Component */}
                        <ShelterMapInfo />

                        {/* 대피소 상세 Component */}
                        <ShelterDetailInfo />
                    </div>
                    <div className='main-etc'>
                        {/* 알림 Component */}
                        <Notification />

                        {/* 공유 Component */}
                        <Share />
                    </div>
                </div>
            }
        </div>
    );
}