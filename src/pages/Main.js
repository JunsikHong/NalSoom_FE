//css
import '@Style/Main.css';

//component
import Notification from '@/components/MainComponent/Notification';
import Share from '@/components/MainComponent/Share';
import ShelterDetailInfo from '@/components/MainComponent/ShelterDetailInfo';
import ShelterMapInfo from '@/components/MainComponent/ShelterMapInfo';
import WeatherInfo from '@/components/MainComponent/WeatherInfo';

//store
import useLocationStore from '@/store/locationStore';
import useTimeStore from '@/store/timeStore';

//lib
import { useEffect, useReducer } from 'react';

//reducer
const weatherAPIInfo = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    }
    return state;
}

const specialReportInfo = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    }
    return state;
}

const shelterAPIInfo = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    }
    return state;
}

export default function Main() {
    
    const { latitude, longitude, updateLocation } = useLocationStore(); //위치 정보
    const { currentDate, currentTime, formatDateTime } = useTimeStore(); //날짜 시간 정보

    const [weatherAPIInfoState, weatherAPIInfoAct] = useReducer(weatherAPIInfo, {
        state: '',
        detail: {}
    }); //날씨정보

    const [specialReportAPIInfoState, specialReportAPIInfoAct] = useReducer(specialReportInfo, {
        state: '',
        detail: {}
    }); //특보정보

    const [shelterAPIInfoState, shelterAPIInfoAct] = useReducer(shelterAPIInfo, {
        state: null,
        detail: null
    }); //대피소정보

    //위치, 시간 정보 초기화
    useEffect(() => {
        updateLocation();
        formatDateTime();
    }, []);

    return (
        <div>
            <div className='main-wrap'>
                <div className='main'>
                    {/* 날씨 Component에 위치정보, 시간정보, 날씨정보 변경함수 전달 */}
                    {latitude !== 0 && longitude !== 0 &&
                     currentDate !== '' && currentTime !== '' && 
                        <WeatherInfo weatherAPIInfoAct={weatherAPIInfoAct} />}
                    
                    {/* 대피소 Component에 위치정보, 날씨정보, 특보정보, 대피소정보 변경함수 전달 */}
                    {latitude !== 0 && longitude !== 0 &&
                     weatherAPIInfoState.state === 'weatherAPIInfoUpdated' &&
                     specialReportAPIInfoState.state === 'specialReportAPIInfoUpdated' &&
                        <ShelterMapInfo
                            weatherAPIInfoState={weatherAPIInfoState}
                            specialReportAPIInfoState={specialReportAPIInfoState}
                            shelterAPIInfoAct={shelterAPIInfoAct} />}
                    
                    {/* 대피소 상세 Component에 대피소정보 전달 */}
                    {shelterAPIInfoState === 'shelterAPIInfoUpdated' &&
                        <ShelterDetailInfo shelterAPIInfoState={shelterAPIInfoState} /> }
                    
                </div>
                <div className='main-etc'>
                    {/* 알림 Component에 위치정보, 시간정보, 특보정보 변경함수 전달 */}
                    {latitude !== 0 && longitude !== 0 &&
                     currentDate !== '' && currentTime !== '' && 
                        <Notification specialReportAPIInfoAct={specialReportAPIInfoAct} />}

                    {/* 공유 Component에 특보정보 전달 */}
                    {shelterAPIInfoState === 'shelterAPIInfoUpdated' &&
                        <Share specialReportAPIInfoState={specialReportAPIInfoState} />}

                </div>
            </div>
        </div>
    );
}