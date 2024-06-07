//css
import 'style/Main.css'

//component
import * as component from 'mainComponent';

//lib
import { useEffect, useReducer } from 'react';

//reducer
const locationInfo = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    }
    return state;
}

const timeInfo = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    }
    return state;
}

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

    const [locationInfoState, locationInfoAct] = useReducer(locationInfo, {
        state: '',
        detail: {
            latitude: null,
            longtitude: null,
            locationNumber: null
        }
    }); //위치 및 주소 정보

    const [timeInfoState, timeInfoAct] = useReducer(timeInfo, {
        state: '',
        detail: {
            currentDate: '',
            currentTime: ''
        }
    }); //날짜 및 시간 정보

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

    //mount시에 위치 및 주소, 날짜 및 시간 정보 저장
    useEffect(() => {
        return() => {
            formatDateTime();
            setLocation();
        }
    }, []);

    //위치 및 주소 정보
    function setLocation() {
        let locationInfoSave = {
            latitude : null,
            longitude : null,
            locationNumber : null
        }

        navigator.geolocation.getCurrentPosition((position) => {
            locationInfoSave.latitude = parseInt(position.coords.latitude);
            locationInfoSave.longitude = parseInt(position.coords.longitude);
        });

        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(locationInfoSave.latitude, locationInfoSave.longitude);
        const callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                locationInfoSave.locationNumber = result[0];
            }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);

        locationInfoAct({
            state: 'locationInfoUpdated',
            detail: locationInfoSave
        });
    }

    //현재 날짜 YYYYMMDD 형식, 현재 시간 HHmm 형식
    function formatDateTime() {
        let timeInfoSave = {
            currentDate : '',
            currentTime : ''
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');

        timeInfoSave.currentDate = `${year}${month}${day}`;
        timeInfoSave.currentTime = `${hours}00`;

        timeInfoAct({
            state: 'formatDateUpdated',
            detail : timeInfoSave
        });
    }

    return (
        <div>
            <div className='main-wrap'>
                <div className='main'>
                    {/* 날씨 Component에 위치정보, 시간정보, 날씨정보 변경함수 전달 */}
                    <component.WeatherInfo
                        locationInfoState={locationInfoState}
                        timeInfoState={timeInfoState}
                        weatherAPIInfoAct={weatherAPIInfoAct} />

                    {/* 대피소 Component에 위치정보, 날씨정보, 특보정보, 대피소정보 변경함수 전달 */}
                    <component.ShelterMapInfo
                        locationInfoState={locationInfoState}
                        weatherAPIInfoState={weatherAPIInfoState}
                        specialReportAPIInfoState={specialReportAPIInfoState}
                        shelterAPIInfoAct={shelterAPIInfoAct} /> 
                    
                    {/* 대피소 상세 Component에 대피소정보 전달 */}
                    <component.ShelterDetailInfo
                        shelterAPIInfoState={shelterAPIInfoState} /> 
                </div>
                <div className='main-etc'>
                    {/* 알림 Component에 위치정보, 시간정보, 특보정보 변경함수 전달 */}
                    <component.Notification
                        locationInfoState={locationInfoState}
                        timeInfoState={timeInfoState}
                        specialReportAPIInfoAct={specialReportAPIInfoAct} />
                    
                    {/* 공유 Component에 특보정보 전달 */}
                    <component.Share
                        specialReportAPIInfoState={specialReportAPIInfoState} />
                </div>
            </div>
        </div>
    );
}