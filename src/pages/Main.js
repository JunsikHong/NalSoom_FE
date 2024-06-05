//css
import 'style/Main.css'

//component
import * as component from 'mainComponent';

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

const shelterAPIInfo = (state, action) => {
    state = {
        state : action.state,
        detail : action.detail
    }
    return state;
}

export default function Main() {

    const [weatherAPIInfoState, weatherAPIInfoAct] = useReducer(weatherAPIInfo, {
        state: '',
        detail: {}
    }); 

    const [shelterAPIInfoState, shelterAPIInfoAct] = useReducer(shelterAPIInfo, {
        state: null,
        detail: null
    });

    // useEffect(() => {
    //     console.log(weatherAPIInfoState)
    // }, []);

    return (
        <div>
            <div className='main-wrap'>
                <div className='main'>
                    <component.WeatherInfo weatherAPIInfoAct={weatherAPIInfoAct}/> {/* 날씨정보 변경 함수 전달 */}
                    <component.ShelterMapInfo weatherAPIInfoState={weatherAPIInfoState} shelterAPIInfoAct={shelterAPIInfoAct}/> {/* 날씨정보, 대피소정보 변경 함수 전달 */}
                    <component.ShelterDetailInfo shelterAPIInfoState={shelterAPIInfoState}/> {/* 대피소정보 전달 */}
                </div>
                <div className='main-etc'>
                    <component.Notification />
                    <component.Share />
                </div>
            </div>
        </div>
    );
}