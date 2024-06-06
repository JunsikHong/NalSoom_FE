//slice 객체
import { createSlice } from '@reduxjs/toolkit';

//카카오 객체
const { kakao } = window;

// 초기 상태값
const initialState = {
    latitude: 0,
    longitude: 0,
    locationNumber: null
};

// 슬라이스 reducer 생성
const locationSlice = createSlice({
    name: 'location',
    initialState : initialState,
    reducers: {
        //위치 정보
        setLocation (state) {
            let nx = 0;
            let ny = 0;
            navigator.geolocation.getCurrentPosition(position => {
                nx = parseInt(position.coords.latitude);
                ny = parseInt(position.coords.longitude);
            });
            state.latitude = nx;
            state.latitude = ny;
        }, 
        //주소 정보
        setLocationNumber (state) {
            let number = 0;
            const geocoder = new kakao.maps.services.Geocoder();
            const coord = new kakao.maps.LatLng(state.latitude, state.longitude);
            const callback = function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    number = result;
                }
            }
            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
            state.locationNumber = number;
        }

    }
});

export const { setLocation, setLocationNumber } = locationSlice.actions;
export default locationSlice.reducer;
