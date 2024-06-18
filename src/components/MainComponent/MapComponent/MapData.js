//css
import '@Style/MapData.css'

//lib
import { useEffect } from "react";
import useLocationStore from '@/store/locationStore';
import { coolingCentreServer } from '@/axiosConfig';
const { kakao } = window;

export default function MapData() {

    const { latitude, longitude } = useLocationStore();
    //map 생성하기
    useEffect(() => {
        var mapContainer = document.getElementById('map'); //map DOM
        var mapLocation = new kakao.maps.LatLng(latitude, longitude); //map 위치
        var mapOption = { center: mapLocation, level: 3 }; //map 옵션

        var map = new kakao.maps.Map(mapContainer, mapOption); //map
        var marker = new kakao.maps.Marker({ position: mapLocation }); //marker

        marker.setMap(map); //map에 marker 추가
    }, []);

    return (
        <div>
            <div className='map-wrap'>
                <div className="map" id="map">
                </div>
            </div>
        </div>
    );
}
