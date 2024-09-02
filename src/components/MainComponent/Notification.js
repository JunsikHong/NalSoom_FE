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

    const [isVisible, setIsVisible] = useState(true); //알림창 표시여부
    const { locationCode } = useLocationStore(); //위치 정보
    const { currentDate } = useTimeStore(); //날짜 시간 정보

    //알림창 표시여부확인
    useEffect(() => {
        const hideUntil = localStorage.getItem('hideNotificationUntil');
        if (hideUntil && new Date() < new Date(hideUntil)) {
            setIsVisible(false);
        }
    }, []);
    
    //특보 API Fetching
    const { isLoading, isSuccess, isError, data, error } = useQuery({ queryKey: ['specialReportData'], queryFn: () => getSpecialReportData(locationCode, currentDate) });
    
    //visible, loading, success, error 처리
    if (!isVisible) {
        return null;
    }

    if (isLoading) {
        return <div>loading...</div>
    }

    if (isError) {
        return <div>error : {error.message}</div>
    }

    if (isSuccess) {
        if(data.response.header.resultCode === "03") {
            return <></>
        }
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
                    {data !== null && data !== '' ? (
                        data.response.header.resultCode === '00' ? (
                            <p className='special-report-info-element'>
                                {data.response.body.items.item[0].title}
                            </p>
                        ) : (<></>)
                    ) : (<></>)
                    }
                </div>
            </div>
        </>
    );
}