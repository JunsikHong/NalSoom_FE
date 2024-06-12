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

    //마운트 시 지역 정보 업데이트
    useEffect(() => {
        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(latitude, longitude);
        const callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                let regionName = result[0].address.region_1depth_name;
                switch (regionName) {
                    case '서울' || '인천' || '경기도':
                        setLocationNumber(109);
                        break;
                    
                    case '부산' || '울산' || '경상남도':
                        setLocationNumber(159);
                        break;
                    
                    case '대구' || '경상북도':
                        setLocationNumber(143);
                        break;
                    
                    case '광주' || '전라남도':
                        setLocationNumber(156);
                        break;

                    case '전라북도':
                        setLocationNumber(146);
                        break;

                    case '대전' || '세종' || '충청남도':
                        setLocationNumber(133);
                        break;

                    case '충청북도':
                        setLocationNumber(131);
                        break;
                    
                    case '강원도':
                        setLocationNumber(105);
                        break;

                    case '제주도':
                        setLocationNumber(184);
                        break;
                    
                    default:
                        setLocationNumber(108);
                        break;
                }
                
            }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        getSpecialReport();
    }, []);

    //지역 정보 업데이트 시 특보 API 응답 요청
    async function getSpecialReport() {
        await specialReportServer.get('/getWthrWrnList', {
            params: {
                serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
                numOfRows: 10,
                pageNo: 1,
                dataType: 'JSON',
                stnId: locationNumber,
                fromTmFc: currentDate,
                toTmFc: currentDate
            }
        }).then(response => {
            setSpecialReportInfo(response);
        });
    }

    //특보 응답 처리
    //reducer로 Main페이지에 specialReportInfo 전달
    useEffect(() => {
        if (specialReportInfo !== null && specialReportInfo !== '') {
            if (specialReportInfo.data.response.header.resultCode === '00') {
                specialReportAPIInfoAct({
                    state: 'specialReportAPIInfoUpdated',
                    detail: specialReportInfo
                });
            }
        }
    }, [specialReportInfo]);

    return (
        <div>
            <div className="notification-wrap">
                <div className="notification">
                    {specialReportInfo !== null && specialReportInfo !== '' ? (
                        specialReportInfo.data.response.header.resultCode === '00' ? (
                            <p className='special-report-info-element'>
                                {specialReportInfo.data.response.body.items.item[0].title}
                            </p>
                        ) : (<></>)
                    ) : (<></>)
                    }
                </div>
            </div>
        </div>
    );
}