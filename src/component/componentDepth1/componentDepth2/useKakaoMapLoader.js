import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";

export default function useKakaMapLoader() {

    const [position, setPosition] = useState({ lat: null, lng: null }); //현재 위치
    
    //카카오 지도 loading
    useKakaoLoaderOrigin({
        appkey: process.env.REACT_APP_KAKAO_MAP_API_KEY,
        libraries: ["clusterer", "drawing", "services"],
    });

    //현재 위치 loading
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    return (
        <>
            <Map id="map"
                center={{ lat: position.lat, lng: position.lng }}
                style={{ width: "500px", height: "350px" }}
                level={3}>
                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
                <MapMarker position={position} />
            </Map>
        </>
    );
}


