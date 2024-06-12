//css
import '@Style/Notification.css';

//store
import useLocationStore from '@Store/locationStore';
import useTimeStore from '@Store/timeStore';

//lib
import { useEffect, useState } from 'react';
import { specialReportServer } from '@/axiosConfig';
const { kakao } = window;


export default function Notification({ specialReportAPIInfoAct }) {

    const { latitude, longitude } = useLocationStore(); //위치 정보
    const { currentDate } = useTimeStore(); //날짜 시간 정보
    const [locationNumber, setLocationNumber] = useState(''); //지역 정보
    const [specialReportInfo, setSpecialReportInfo] = useState('') //특보 정보

    //지역 정보 업데이트
    useEffect(() => {
        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(latitude, longitude);
        const callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setLocationNumber(result)
            }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }, []);

    useEffect(() => {
        console.log(locationNumber);
        // specialReportRequest();
    }, [locationNumber]);
    
    //특보 API 응답 데이터 셋팅 될 때 처리
    useEffect(() => {
        // specialReportResponse();
    }, [specialReportInfo]);

    //마운트 시 특보 정보 API 요청
    useEffect(() => {
        // specialReportServer.get('/getWthrWrnList', {
        //     params: {
        //         serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
        //         numOfRows: 10,
        //         pageNo: 1,
        //         dataType: 'JSON',
        //         stnId: locationNumber,
        //         fromTmFc: currentDate,
        //         toTmFc: currentDate
        //     }
        // }).then(response => {
        //     setSpecialReportInfo(response);
        // });
    }, []);


  

    //특보 응답 처리
    //reducer로 Main페이지에 specialReportInfo 전달
    function specialReportResponse() {
        if (specialReportInfo !== null && specialReportInfo !== '') {
            if (specialReportInfo.data.response.header.resultCode === '00') {
                specialReportAPIInfoAct({
                    state: 'specialReportAPIInfoUpdated',
                    detail: specialReportInfo
                });
            }
        }
    }

    return (
        <div>
            <div className="notification-wrap">
                <div className="notification">
                    {/* 
                    {specialReportInfo !== null && specialReportInfo !== '' ? (
                        specialReportInfo.data.response.header.resultCode === '00' ? (
                            <p className='special-report-info-element'>
                                {specialReportInfo.data.response.body.items.item[0].title}
                            </p>
                        ) : (<></>)
                    ) : (<></>)
                    }
                    */}
                </div>
            </div>
        </div>
    );
}