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

    const [ isVisible, setIsVisible ] = useState(false);
    const { locationCode } = useLocationStore(); //위치 정보
    const { currentDate } = useTimeStore(); //날짜 시간 정보
    const [ specialReportInfo, setSpecialReportInfo ] = useState();
    
    //특보 API Fetching
    const specialReportData = useQuery({ queryKey: ['specialReportData'], queryFn: () => getSpecialReportData(locationCode, currentDate) });
    
    useEffect(() => {
        if(specialReportData.isSuccess && specialReportData.data.response.header.resultCode === '00') {
            setSpecialReportInfo(specialReportData.data.response.body.items.item[0]);
            setIsVisible(true);
        } 
    }, [specialReportData.isSuccess]);

    if(isVisible) {
        setTimeout(() => {
            setIsVisible(false);
        }, 5000); // 3초 후에 창 닫기
    }

    return (
        <>
            {specialReportInfo && isVisible &&
                <div className="notification-wrap">
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