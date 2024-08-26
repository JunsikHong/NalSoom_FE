//css
import '@Style/Notification.css';

//store
import useLocationStore from '@/store/locationStore';
import useTimeStore from '@/store/timeStore';

//lib
import { getSpecialReportData } from '@Services/useSpecialReportAPI';
import { useQuery } from '@tanstack/react-query';


export default function Notification() {

    const { locationCode } = useLocationStore(); //위치 정보
    const { currentDate } = useTimeStore(); //날짜 시간 정보

    //특보 API Fetching
    const { isLoading, isSuccess, isError, data, error } = useQuery({ queryKey: ['specialReportData'], queryFn: () => getSpecialReportData(locationCode, currentDate) });

    //loading, success, error 처리
    if (isLoading) {
        return <div>loading...</div>
    }

    if (isError) {
        return <div>error : {error.message}</div>
    }

    if (isSuccess) {
    }

    //특보 응답 처리
    //reducer로 Main페이지에 specialReportInfo 전달

    return (
        <>
            <div className="notification-wrap">
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