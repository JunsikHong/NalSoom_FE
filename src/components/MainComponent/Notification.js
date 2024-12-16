//css
import '@Style/Notification.css';

//store
import useLocationStore from '@Store/locationStore';
import useTimeStore from '@Store/timeStore';

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
        if(specialReportData.isSuccess) {
            var recentReport = specialReportData.data.response.body.items.item[0];
            if(recentReport) {
                setSpecialReportInfo(recentReport);
            }
            setIsVisible(true);
        } 
    }, [specialReportData.isSuccess, specialReportInfo]);

    if(isVisible) {
        setTimeout(() => {
            setIsVisible(false);
        }, 5000);
    }
        
    return (
        <>
            {specialReportInfo && isVisible &&
                <div className="notification-wrap">
                    <div className="notification">
                        <p className='special-report-info-element'>
                            {specialReportInfo.title}
                        </p>
                    </div>
                </div>
            }
        </>
    );
}