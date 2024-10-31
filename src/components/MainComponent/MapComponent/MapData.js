//css
import '@Style/MapData.css'

//lib
import useLocationStore from '@Store/locationStore';
import useShelterStore from '@Store/shelterStore';
import { useQuery } from '@tanstack/react-query';
import { getSheltersData } from '@Services/useShelterAPI'
import { useEffect, useState } from 'react';
const { kakao } = window;

export default function MapData() {

    const [ kakaoMap, setKakaoMap ] = useState(null);
    const [ bound, setBound] = useState([]); // bounds
    const { latitude, longitude } = useLocationStore(); //위도 경도 정보
    const { currentShelterType, setCurrentShelter, setMapShelters } = useShelterStore(); //현재 선택한 대피소 정보

    //shelter data load
    const sheltersData = useQuery({ queryKey: ['sheltersData'], queryFn: getSheltersData});

    useEffect(() => {
        // map태그가 생기는 시점에 drawMap
        drawMap();
    }, []);

    useEffect(() => {
        if(sheltersData.isSuccess) {
            //map bound 안에 있는 정보 -> Add Marker
            const filteredData = filteringData();
            if(filteredData.length !== 0) {
                addMarker(filteredData.slice(0, 100));
                setMapShelters(filteredData.slice(0, 100));
            }
        }
    }, [sheltersData.data, bound]);

    //map tag에 지도 그리고 현재 위치 표시 -> map state에 저장 -> 현재 map 범위 위치 변경 될 때마다 구하기 -> boundsStr state에 저장
    function drawMap() {
        var mapContainer = document.getElementById('map'); //map DOM
        var mapLocation = new kakao.maps.LatLng(latitude, longitude); //map 위치
        var mapOption = { center: mapLocation, level: 3 }; //map 옵션
        var map = new kakao.maps.Map(mapContainer, mapOption); //map
        var marker = new kakao.maps.Marker({ position: mapLocation }); //marker
        marker.setMap(map); //map에 marker 추가
        var bounds = map.getBounds(); //지도 현재 영역
        var boundsStr = bounds.toString(); // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
        kakao.maps.event.addListener(map, 'dragend', function () {
            var bounds = map.getBounds(); //지도 현재 영역
            var boundsStr = bounds.toString(); // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다  
            setBound(boundsStr.replace(/[()]/g, '').replace(/\s+/g, '').split(','));
        });
        setBound(boundsStr.replace(/[()]/g, '').replace(/\s+/g, '').split(','));
        setKakaoMap(map);
    }

    //대피소 타입 -> bound in
    function filteringData() {
        var filteredData = [...sheltersData.data];

        //대피소 타입이 정해졌다면 -> 해당 타입에 맞는 것만 반환
        if(currentShelterType !== '') {
            filteredData = filteredData.map(data => {
                if(data.type === currentShelterType) {
                    if(currentShelterType === 'shuntPlace') convertXYtoLatLng(data);
                    filteredData.push(data);           
                }
            });
        }

        //내 주변에 있는 데이터만 필터링
        filteredData = filteredData.filter(data => isBoundIn(data));
        
        return filteredData;
    }

    function isBoundIn (filteredData) {
        return filteredData.latitude >= bound[0] && filteredData.latitude <= bound[2] &&
        filteredData.longitude >= bound[1] && filteredData.longitude <= bound[3];
    }

    //map에 boundsStr안에 있는 shelterData정보들 마커 추가시키기
    function addMarker(filteredData) {
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; //marker img
        var imageSize = new kakao.maps.Size(24, 35); //marker size
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); //marker object
        var centerPosition = kakaoMap.getCenter(longitude, latitude);
        
        var markerPosition = null; //marker position
        var poly = new kakao.maps.Polyline({ //length object
            map : kakaoMap,
            strokeWeight : 0
        });
        var length = 0; //length
        
        var clusterer = new kakao.maps.MarkerClusterer({ //marker clusterer
            map: kakaoMap,
            averageCenter: true,  
            minLevel: 7 
        });

        var markers = filteredData.map(data => {
            //marker에 필요한 정보 셋팅
            var marker = new kakao.maps.Marker({
                map: kakaoMap,
                position: new kakao.maps.LatLng(data.LA, data.LO),
                image: markerImage
            });

            //infoWindow에 필요한 정보 셋팅
            var infowindow = new kakao.maps.InfoWindow({
                content: `<div>${data.R_AREA_NM}</div>`
            });

            //클릭 시에 currentShelter 셋팅 + mouse over & out 시 infowWindow 표시 및 가림
            kakao.maps.event.addListener(marker, 'click', setShelterDetailInfo(data));
            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(kakaoMap, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

            //center <-> position 거리 구하기
            markerPosition = marker.getPosition();
            poly.setPath([centerPosition, markerPosition]);
            length = poly.getLength();
            data.length = Math.round(length);

        });

        //add clusterer
        clusterer.addMarkers(markers);
    }

    //WTM좌표 WGS84좌표로 변환
    function convertXYtoLatLng(shelterData) {
        var geocoder = new kakao.maps.services.Geocoder();
        geocoder.transCoord(shelterData.latitude, shelterData.longitude, transCoordCB, {
            input_coord: kakao.maps.services.Coords.WTM,
            output_coord: kakao.maps.services.Coords.WGS84
        });

        function transCoordCB(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                shelterData.latitude = result[0].y
                shelterData.longitude = result[0].x
            }
        }
    }

    //쉼터 마커 클릭한 대피소 정보 표시
    function setShelterDetailInfo(info) {
        return function () {
            setCurrentShelter(info);
        };
    }

    //쉼터 마커 인포윈도우 open
    function makeOverListener(map, marker, infowindow) {
        return function () {
            infowindow.open(map, marker);
        };
    }

    //쉼터 마커 인포윈도우 close
    function makeOutListener(infowindow) {
        return function () {
            infowindow.close();
        };
    }

    return (
        <div>
            <div className='map-wrap'>
                <div id="map"></div>
            </div>
        </div>
    );

}
