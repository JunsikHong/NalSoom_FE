//lib
import { create } from "zustand";
const { kakao } = window;

const useLocationStore = create((set, get) => ({
    latitude: 0, //위도
    longitude: 0, //경도
    locationNumber: null, //지역정보
    locationCode: '', //지역번호

    fetchLocation: async () => {
        const {latitude, longitude} = await get().updateLocation();

        if(latitude !== 0 && longitude !== 0) {
            const locationNumber = await get().updateLocationNumber();
            if(locationNumber !== null) get().updateLocationCode();
        }

    },

    updateLocation: () => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                set({ latitude: latitude, longitude: longitude });
                resolve({ latitude, longitude });
            });
        });
    },

    updateLocationNumber: () => {
        return new Promise((resolve) => {
            const latitude = get().latitude;
            const longitude = get().longitude;
            const geocoder = new kakao.maps.services.Geocoder();
            const coord = new kakao.maps.LatLng(latitude, longitude);
            const callback = function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    let locationNumber = result[0].address;
                    set({ locationNumber: locationNumber });
                    resolve({ locationNumber });
                }
            };
            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        });
    },

    updateLocationCode: () => {
        let locationResult = '';
        switch (get().locationNumber.region_1depth_name) {
            case '서울' || '인천' || '경기도':
                locationResult = '109';
                break;

            case '부산' || '울산' || '경상남도':
                locationResult = '159';
                break;

            case '대구' || '경상북도':
                locationResult = '143';
                break;

            case '광주' || '전라남도':
                locationResult = '156';
                break;

            case '전라북도':
                locationResult = '146'
                break;

            case '대전' || '세종' || '충청남도':
                locationResult = '133'
                break;

            case '충청북도':
                locationResult = '131'
                break;

            case '강원도':
                locationResult = '105'
                break;

            case '제주도':
                locationResult = '184'
                break;

            default:
                locationResult = '108'
                break;
        }
        set({ locationCode : locationResult });
    },

    setLocation: (selectLocation) => {
        set({ latitude: selectLocation.latitude });
        set({ longitude: selectLocation.longitude });
    }
}));

export default useLocationStore;
