//css
import '@Style/Notification.css';

//store
import useLocationStore from '@/store/locationStore';
import useTimeStore from '@/store/timeStore';

//lib
import { useEffect, useState } from 'react';
import { specialReportServer } from '@/axiosConfig';

export default function Notification({ specialReportAPIInfoAct }) {

    const { latitude, longitude, locationNumber, updateLocationNumber } = useLocationStore(); //위치 정보
    const { currentDate } = useTimeStore(); //날짜 시간 정보
    const [specialReportInfo, setSpecialReportInfo] = useState('') //특보 정보

    //마운트 시 지역 정보 업데이트
    useEffect(() => {
        updateLocationNumber(latitude, longitude);
    }, []);

    useEffect(() => {
        const notificationUpdated = async () => {
            try {
                const result1 = getLocationNumber(locationNumber);
                const result2 = await getSpecialReport(result1);
                setSpecialReportInfo(result2);
            } catch (error) {
                console.log(error)
            }
        }
        notificationUpdated();
    }, [locationNumber]);

    function getLocationNumber(regionName) {
        let locationResult = '';
        switch (regionName) {
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
        return locationResult;
    }

    //지역 정보 업데이트 시 특보 API 응답 요청
    function getSpecialReport(result1) {
        const result = specialReportServer.get('/getWthrWrnList', {
            params: {
                serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
                numOfRows: 10,
                pageNo: 1,
                dataType: 'JSON',
                stnId: result1,
                fromTmFc: currentDate,
                toTmFc: currentDate
            }
        });
        return result;
    }

    //특보 응답 처리
    //reducer로 Main페이지에 specialReportInfo 전달
    useEffect(() => {
        specialReportAPIInfoAct({
            state: 'specialReportAPIInfoUpdated',
            detail: specialReportInfo
        });
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