//lib
import { create } from "zustand";
const {kakao} = window;

const useLocationStore = create((set) => ({
    latitude: 0, //위도
    longitude: 0, //경도
    locationNumber: null, //지역

    //사용자 위도, 경도 불러오는 함수
    updateLocation: () => {
        navigator.geolocation.getCurrentPosition(position => {
            set({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    },

    updateLocationNumber: (latitude, longitude) => {
        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(latitude, longitude);
        const callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                set({locationNumber: result[0].address});
            }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }
    
}));

export default useLocationStore;