//css
import '@Style/Notification.css';

//store
import useLocationStore from '@/store/locationStore';
import useTimeStore from '@/store/timeStore';

//lib
import { getSpecialReportData } from '@Services/useSpecialReportAPI';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export default function Notification() {

    const [ isVisible, setIsVisible ] = useState(isDateIn()); //알림창 표시여부
    const { locationCode } = useLocationStore(); //위치 정보
    const { currentDate } = useTimeStore(); //날짜 시간 정보
    const [ specialReportInfo, setSpecialReportInfo ] = useState();
    
    //특보 API Fetching
    const specialReportData = useQuery({ queryKey: ['specialReportData'], queryFn: () => getSpecialReportData(locationCode, currentDate) });
    
    useEffect(() => {
        if(specialReportData.isSuccess && specialReportData.data.response.header.resultCode === '00') {
            setSpecialReportInfo(specialReportData.data.response.body.items.item[0]);
        } 
    }, [specialReportData.isSuccess]);

    //visible, loading, success, error 처리
    if (!isVisible) {
        return null;
    }

    // 표시 여부 함수
    function isDateIn () {
        const hideUntil = localStorage.getItem('hideNotificationUntil');
        if (hideUntil && new Date() < new Date(hideUntil)) {
            return false;
        }
        return true;
    }

    // 알림을 닫는 함수
    const closeNotification = () => {
        setIsVisible(false);
    };

    // 1일 동안 알림이 보이지 않게 하는 함수
    const closeNotificationForADay = () => {
        setIsVisible(false);
        const hideUntil = new Date();
        hideUntil.setDate(hideUntil.getDate() + 1); // 현재 날짜에 1일 추가
        localStorage.setItem('hideNotificationUntil', hideUntil);
    };

    return (
        <>
            {specialReportInfo && 
                <div className="notification-wrap">
                    <div className="notification-head">
                        <div className='notification-closeDelay'>
                            <input type='checkbox' onChange={closeNotificationForADay} />
                            <p>1일동안 보이지 않기</p>
                        </div>
                        <div className='notification-closebtn' onClick={closeNotification}>
                            X
                        </div>
                    </div>
                    <div className="notification">
                        <p className='special-report-info-element'>
                            {specialReportInfo.length !== 0 && specialReportInfo.title}
                        </p>
                    </div>
                </div>
            }
        </>
    );
}