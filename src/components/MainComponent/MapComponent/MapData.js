//css
import '@Style/MapData.css'

//lib
import useLocationStore from '@Store/locationStore';
import useShelterStore from '@Store/shelterStore';
import { useQuery } from '@tanstack/react-query';
import { getShelterData } from '@Services/useShelterAPI'
import { useEffect } from 'react';
const { kakao } = window;

export default function MapData() {

    const { latitude, longitude } = useLocationStore(); //위도 경도 정보
    const { currentShelterType, setCurrentShelter, setCurrentShelterType } = useShelterStore(); //현재 선택한 대피소 정보

    //서울시 공공데이터 shelter data load
    const { isSuccess, isError, data, error } = useQuery({ queryKey: ['shelterData'], queryFn: getShelterData });

    //success, error 처리
    useEffect(() => {
        if (isError) {
            return <div>error : {error.message}</div>
        }

        if (isSuccess) {
            const { map, boundsStr } = getMap();
            data.resultArray3.map((element) => { convertXYtoLatLng(element) }); //convertXYtoLatLng
            inBoundsAddMarker(map, boundsStr); //add marker
        }
    }, [data]);

    //카카오맵 load
    function getMap() {
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
            inBoundsAddMarker(map, boundsStr);
        });
        return { map, boundsStr };
    }

    //지도 현재 영역에 shelter data 있는지 검사하고 마커 추가
    function inBoundsAddMarker(map, boundsStr) {
        boundsStr = boundsStr.replace(/[()]/g, '').replace(/\s+/g, '').split(',');
        let inBoundsLocation = null;
        if (currentShelterType === 'coolingCentre') {
            inBoundsLocation = data.resultArray1.filter((element) => {
                return isLocationInBounds(element.LA, element.LO, boundsStr);
            });
            shelterAddMarker(inBoundsLocation, map);
        } else if (currentShelterType === 'heatingCentre') {
            inBoundsLocation = data.resultArray2.filter((element) => {
                return isLocationInBounds(element.LOT, element.LAT, boundsStr);
            });
            shelterAddMarker(inBoundsLocation, map);
        } else if (currentShelterType === 'finedustShelter') {
            inBoundsLocation = data.resultArray3.filter((element) => {
                return isLocationInBounds(element.MAP_COORD_X, element.MAP_COORD_Y, boundsStr);
            });
            shelterAddMarker(inBoundsLocation, map);
        }
    }

    //WTM좌표 WGS84좌표로 변환
    function convertXYtoLatLng(element) {
        var geocoder = new kakao.maps.services.Geocoder()
        geocoder.transCoord(element.MAP_COORD_X, element.MAP_COORD_Y, transCoordCB, {
            input_coord: kakao.maps.services.Coords.WTM,
            output_coord: kakao.maps.services.Coords.WGS84
        });

        function transCoordCB(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                element.MAP_COORD_X = result[0].y
                element.MAP_COORD_Y = result[0].x
            }
        }
    }

    //지도 현재 영역에 shelter 존재 여부 검사
    function isLocationInBounds(lat, lng, boundsStr) {
        const isLatInBounds = lat >= boundsStr[0] && lat <= boundsStr[2];
        const isLonInBounds = lng >= boundsStr[1] && lng <= boundsStr[3];
        return isLatInBounds && isLonInBounds;
    };

    //쉼터 마커 추가
    function shelterAddMarker(shelterPositions, map) {
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        if (currentShelterType === 'coolingCentre') {
            shelterPositions.map((element) => {
                var position = {
                    content: `<div>${element.R_AREA_NM}</div>`,
                    latlng: new kakao.maps.LatLng(element.LA, element.LO),
                    info: element
                };
                shelterPositions.push(position);
            });
        } else if (currentShelterType === 'heatingCentre') {
            shelterPositions.map((element) => {
                var position = {
                    content: `<div>${element.R_AREA_NM}</div>`,
                    latlng: new kakao.maps.LatLng(element.LOT, element.LAT),
                    info: element
                };
                shelterPositions.push(position);
            });
        } else if (currentShelterType === 'finedustShelter') {
            shelterPositions.map((element) => {
                var position = {
                    content: `<div>${element.R_AREA_NM}</div>`,
                    latlng: new kakao.maps.LatLng(element.MAP_COORD_X, element.MAP_COORD_Y),
                    info: element
                };
                shelterPositions.push(position);
            });
        }

        for (var i = 0; i < shelterPositions.length; i++) {
            var imageSize = new kakao.maps.Size(24, 35);
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var marker = new kakao.maps.Marker({
                map: map,
                position: shelterPositions[i].latlng,
                image: markerImage,
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: shelterPositions[i].content
            });

            kakao.maps.event.addListener(marker, 'click', setShelterDetailInfo(shelterPositions[i].info, currentShelterType));
            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        }
    }

    //쉼터 마커 클릭한 대피소 정보 표시
    function setShelterDetailInfo(info, type) {
        return function () {
            setCurrentShelter(info);
            setCurrentShelterType(type);
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
