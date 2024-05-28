import { Map, useKakaoLoader } from "react-kakao-maps-sdk"

export default function useKakaMapLoader() {
    const { error } = useKakaoLoader({
        appkey: process.env.REACT_APP_KAKAO_MPP_API_KEY
    });

    if (!error) return (
        <Map id="map" center={{ lat: 33.450701, lng: 126.570667, }}
            style={{ width: "500px", height: "350px" }}
            level={3} />);
}


