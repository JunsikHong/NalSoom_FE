//css
import '@Style/MapData.css'

//lib
import { useEffect } from "react";
import useLocationStore from '@Store/locationStore';
const { kakao } = window;

export default function MapData() {

    const {latitude, longitude} = useLocationStore();
    //map 생성하기
    useEffect(() => {
        var mapContainer = document.getElementById('map');
        var mapOption = { center: new kakao.maps.LatLng(latitude, longitude), level: 3};
        var map = new kakao.maps.Map(mapContainer, mapOption);
    },[]);


    return (
        <div>
            <div className="map-wrap">
                <div className="map" id="map">
                </div>
            </div>
        </div>
    );
}
