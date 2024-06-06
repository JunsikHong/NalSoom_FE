//css
import 'style/Main.css'

//component
import * as component from 'mainComponent';

//lib
import { useEffect, useReducer } from 'react';
import { useDispatch } from "react-redux";
import { setLocation, setLocationNumber } from '../reduxStore/locationSlice';

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

    //Main Page mount 시에 redux 값 초기화
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setLocation());
        dispatch(setLocationNumber());
    }, []);

    return (
        <div>
            <div className='main-wrap'>
                <div className='main'>
                    <component.WeatherInfo
                        weatherAPIInfoAct={weatherAPIInfoAct}
                        specialReportAPIInfoAct={specialReportAPIInfoAct} /> {/* 날씨정보, 특보정보 변경 함수 전달 */}
                    <component.ShelterMapInfo
                        weatherAPIInfoState={weatherAPIInfoState}
                        specialReportAPIInfoState={specialReportAPIInfoState}
                        shelterAPIInfoAct={shelterAPIInfoAct} /> {/* 날씨정보, 특보정보, 대피소정보 변경 함수 전달 */}
                    <component.ShelterDetailInfo
                        shelterAPIInfoState={shelterAPIInfoState} /> {/* 대피소정보 전달 */}
                </div>
                <div className='main-etc'>
                    <component.Notification
                        specialReportAPIInfoState={specialReportAPIInfoState} />
                    <component.Share />
                </div>
            </div>
        </div>
    );
}