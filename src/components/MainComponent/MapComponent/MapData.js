//css
import '@Style/MapData.css'

//lib
import { useEffect, useMemo, useState } from "react";
import { seoulDataServer } from '@/axiosConfig';
import useLocationStore from '@/store/locationStore';
import useShelterStore from '@Store/shelterStore';
const { kakao } = window;

export default function MapData() {

    const { latitude, longitude } = useLocationStore(); //위도 경도 정보
    const { currentShelterType, setCurrentShelter, setCurrentShelterType } = useShelterStore(); //현재 선택한 대피소 정보
    const [coolingCentreInfo, setCoolingCentreInfo] = useState([]); //무더위 쉼터 정보
    const [coolingCentreState, setCoolingCentreState] = useState(''); //무더위 쉼터 상태
    const [heatingCentreInfo, setHeatingCentreInfo] = useState([]); //한파 쉼터 정보
    const [heatingCentreState, setHeatingCentreState] = useState(''); //한파 쉼터 상태
    const [finedustShelterInfo, setFinedustShelterInfo] = useState([]); //미세먼지 대피소 정보
    const [finedustShelterState, setFinedustShelterState] = useState(''); //미세먼지 대피소 상태

    //대피소정보 불러오기 및 지도 load
    useEffect(() => {
        switch (currentShelterType) {
            case 'coolingCentre':
                //무더위 쉼터
                var coolingCentreResult = getCoolingCentre();
                setCoolingCentreInfo(coolingCentreResult);
                break;

            case 'heatingCentre':
                //한파 쉼터
                var heatingCentreResult = getHeatingCentre();
                setHeatingCentreInfo(heatingCentreResult);
                break;

            case 'finedustShelter':
                //미세먼지 대피소
                var finedustShelterResult = getFinedustShelter();
                setFinedustShelterInfo(finedustShelterResult);
                break;

            default:
                //무더위 쉼터
                var coolingCentreResult = getCoolingCentre();
                setCoolingCentreInfo(coolingCentreResult);
                break;
        }
    }, [currentShelterType]);

    //내 주변 필터링
    useMemo(() => {
        //const deltaLatitude = 0.045; // 위도에서 5km 범위
        //const deltaLongitude = 0.057; // 경도에서 5km 범위 (서울 기준)

        const deltaLatitude = 0.2; // 위도temp
        const deltaLongitude = 0.2; // 경도temp

        switch (currentShelterType) {
            case 'coolingCentre':
                coolingCentreFilter(deltaLatitude, deltaLongitude);
                break;

            case 'heatingCentre':
                heatingCentreFilter(deltaLatitude, deltaLongitude);
                break;

            case 'finedustShelter':
                finedustShelterFilter(deltaLatitude, deltaLongitude);
                break;

            default:
                coolingCentreFilter(deltaLatitude, deltaLongitude);
                break;
        }
    }, [coolingCentreState, heatingCentreState, finedustShelterState]);

    //지도 메서드 호출
    useEffect(() => {
        //지도 load
        const map = getMap();

        //지도 마커 load
        getMarker(map);
    }, [coolingCentreState, heatingCentreState, finedustShelterState]);

    //카카오맵 load
    function getMap() {
        var mapContainer = document.getElementById('map'); //map DOM
        var mapLocation = new kakao.maps.LatLng(latitude, longitude); //map 위치
        var mapOption = { center: mapLocation, level: 3 }; //map 옵션
        var map = new kakao.maps.Map(mapContainer, mapOption); //map
        var marker = new kakao.maps.Marker({ position: mapLocation }); //marker
        marker.setMap(map); //map에 marker 추가
        return map;
    }

    //쉼터 마커
    function getMarker(map) {
        var coolingCentrePositions = [];
        var heatingCentrePositions = [];
        var finedustShelterPositions = [];
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        switch (currentShelterType) {
            case 'coolingCentre':
                //무더위 쉼터
                coolingCentreMarker(coolingCentrePositions, map, imageSrc);
                break;

            case 'heatingCentre':
                //한파 쉼터
                heatingCentreMarker(heatingCentrePositions, map, imageSrc);
                break;

            case 'finedustShelter':
                //미세먼지 대피소
                finedustShelterMarker(finedustShelterPositions, map, imageSrc);
                break;

            default:
                //무더위 쉼터
                coolingCentreMarker(coolingCentrePositions, map, imageSrc);
                break;
        }
    }

    //클릭한 대피소 정보 표시
    function setShelterDetailInfo(info, type) {
        return function () {
            setCurrentShelter(info);
            setCurrentShelterType(type);
        };
    }

    //인포윈도우 표시 
    function makeOverListener(map, marker, infowindow) {
        return function () {
            infowindow.open(map, marker);
        };
    }

    //인포윈도우를 닫는 
    function makeOutListener(infowindow) {
        return function () {
            infowindow.close();
        };
    }

    //서울 공공데이터 api 무더위 쉼터 load
    function getCoolingCentre() {
        let resultArray = [];
        const fetchData = async () => {
            const result1 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/1/1000/');
            const result2 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/1001/2000/');
            const result3 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/2001/3000/');
            const result4 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/3001/4000/');
            const result5 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnHwcwP/4001/4135/');
            resultArray.push(...result1.data.TbGtnHwcwP.row);
            resultArray.push(...result2.data.TbGtnHwcwP.row);
            resultArray.push(...result3.data.TbGtnHwcwP.row);
            resultArray.push(...result4.data.TbGtnHwcwP.row);
            resultArray.push(...result5.data.TbGtnHwcwP.row);
            setCoolingCentreState(result1.data.TbGtnHwcwP.RESULT.CODE);
        }
        fetchData();
        return resultArray;
    }

    //서울 공공데이터 api 한파 쉼터 load
    function getHeatingCentre() {
        let resultArray = [];
        let updatedArray = [];
        let temp = {};
        const fetchData = async () => {
            const result1 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnCwP/1/1000/');
            const result2 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/TbGtnCwP/1001/1304/');
            resultArray.push(...result1.data.TbGtnCwP.row);
            resultArray.push(...result2.data.TbGtnCwP.row);

            resultArray.map(item => {
                const { latitude, longitude } = convertXYToLatLong(item.G2_XMIN, item.G2_YMIN);
                temp = {item, LA: latitude, LO: longitude};
                updatedArray.push(temp);
            });

            setHeatingCentreState(result1.data.TbGtnCwP.RESULT.CODE);
        }
        fetchData();
        return updatedArray;
    }

    //서울 공공데이터 api 미세먼지 대피소 load
    function getFinedustShelter() {
        let resultArray = [];
        let updatedArray = [];
        let temp = {};
        const fetchData = async () => {
            const result1 = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/shuntPlace/1/155/');
            resultArray.push(...result1.data.shuntPlace.row);

            updatedArray = resultArray.map(item => {
                const {latitude, longitude} = convertXYToLatLong(item.G2_XMIN, item.G2_YMIN);
                temp = {item, LA: latitude, LO: longitude};
                updatedArray.push(temp);
            });

            setFinedustShelterState(result1.data.shuntPlace.RESULT.CODE);
        }
        fetchData();
        return updatedArray;
    }

     //내 주변 무더위 쉼터 필터링
     function coolingCentreFilter(deltaLatitude, deltaLongitude) {
        const filteredShelters = coolingCentreInfo.filter((element) => {
            return (
                latitude - deltaLatitude <= element.LA && element.LA <= latitude + deltaLatitude &&
                longitude - deltaLongitude <= element.LO && element.LO <= longitude + deltaLongitude
            );
        });
        setCoolingCentreInfo(filteredShelters);
    }

    //내 주변 한파 쉼터 필터링
    function heatingCentreFilter(deltaLatitude, deltaLongitude) {
        const filteredShelters = heatingCentreInfo.filter((element) => {
            return (
                latitude - deltaLatitude <= element.LA && element.LA <= latitude + deltaLatitude &&
                longitude - deltaLongitude <= element.LO && element.LO <= longitude + deltaLongitude
            );
        });
        setHeatingCentreInfo(filteredShelters);
    }

    //내 주변 미세먼지 대피소 필터링
    function finedustShelterFilter(deltaLatitude, deltaLongitude) {
        const filteredShelters = finedustShelterInfo.filter((element) => {
            return (
                latitude - deltaLatitude <= element.LA && element.LA <= latitude + deltaLatitude &&
                longitude - deltaLongitude <= element.LO && element.LO <= longitude + deltaLongitude
            );
        });
        setFinedustShelterInfo(filteredShelters);
    }

    //무더위 쉼터 마커
    function coolingCentreMarker(coolingCentrePositions, map, imageSrc) {
        var type = 'coolingCentre';
        coolingCentreInfo.map((element) => {
            var position = {
                content: `<div>${element.R_AREA_NM}</div>`,
                latlng: new kakao.maps.LatLng(element.LA, element.LO),
                info: element
            };
            coolingCentrePositions.push(position);
        });

        for (var i = 0; i < coolingCentrePositions.length; i++) {
            var imageSize = new kakao.maps.Size(24, 35);
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var marker = new kakao.maps.Marker({
                map: map,
                position: coolingCentrePositions[i].latlng,
                image: markerImage,
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: coolingCentrePositions[i].content
            });

            kakao.maps.event.addListener(marker, 'click', setShelterDetailInfo(coolingCentrePositions[i].info, type));
            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        }
    }

    //한파 쉼터 마커
    function heatingCentreMarker(heatingCentrePositions, map, imageSrc) {
        var type = 'heatingCentre';
        heatingCentrePositions.map((element) => {
            var position = {
                content: `<div>${element.R_AREA_NM}</div>`,
                latlng: new kakao.maps.LatLng(element.G2_XMIN, element.G2_YMIN),
                info: element
            };
            heatingCentrePositions.push(position);
        });

        for (var i = 0; i < heatingCentrePositions.length; i++) {
            var imageSize = new kakao.maps.Size(24, 35);
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var marker = new kakao.maps.Marker({
                map: map,
                position: heatingCentrePositions[i].latlng,
                image: markerImage,
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: heatingCentrePositions[i].content
            });

            kakao.maps.event.addListener(marker, 'click', setShelterDetailInfo(heatingCentrePositions[i].info, type));
            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        }
    }

    //미세먼지 대피소 마커
    function finedustShelterMarker(finedustShelterPositions, map, imageSrc) {
        var type = 'finedustShelter';
        finedustShelterPositions.map((element) => {
            var position = {
                content: `<div>${element.R_AREA_NM}</div>`,
                latlng: new kakao.maps.LatLng(element.G2_XMIN, element.G2_YMIN),
                info: element
            };
            finedustShelterPositions.push(position);
        });

        for (var i = 0; i < finedustShelterPositions.length; i++) {
            var imageSize = new kakao.maps.Size(24, 35);
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var marker = new kakao.maps.Marker({
                map: map,
                position: finedustShelterPositions[i].latlng,
                image: markerImage,
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: finedustShelterPositions[i].content
            });

            kakao.maps.event.addListener(marker, 'click', setShelterDetailInfo(finedustShelterPositions[i].info, type));
            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        }
    }

    //x,y좌표를 lat, lng로 변환
    function convertXYToLatLong(x, y) {
        const EARTH_RADIUS = 6371000;
        const lng = (x / EARTH_RADIUS) * (180 / Math.PI);
        const lat = (2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2) * (180 / Math.PI);
        return { lat, lng };
    }

    return (
        <div>
            <div className='map-wrap'>
                <div className="map" id="map">
                </div>
            </div>
        </div>
    );
}
