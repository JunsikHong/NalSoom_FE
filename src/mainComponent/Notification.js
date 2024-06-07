//css
import 'style/Notification.css';

//lib
import { useEffect, useState } from 'react';
import * as server from 'axiosConfig';  

export default function Notification({ locationInfoState, timeInfoState, specialReportAPIInfoAct }) {

    const [specialReportInfo, setSpecialReportInfo] = useState('') //특보 정보

    //주소정보, 시간정보 업데이트 될 때 특보 API요청
    useEffect(() => {
        if (locationInfoState.detail.locationNumber !== null &&
            locationInfoState.detail.locationNumber !== '' &&
            timeInfoState.detail.currentDate !== null &&
            timeInfoState.detail.currentDate !== '') {
            specialReportRequest();
        }
    }, [locationInfoState, timeInfoState]);

    //특보 API 응답 데이터 셋팅 될 때 처리
    useEffect(() => {
        specialReportResponse();
    }, [specialReportInfo]);

    //특보 요청 ENC키 응답없을 때 DEC키 요청
    function specialReportRequest() {
        server.specialReportServer.get('/getWthrWrnList', {
            params: {
                serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_ENC,
                numOfRows: 10,
                pageNo: 1,
                dataType: 'JSON',
                stnId: locationInfoState.detail.locationNumber,
                fromTmFc: timeInfoState.detail.currentDate,
                toTmFc: timeInfoState.detail.currentDate
            }
        }).then(response => {
            if (response.data !== null) {
                if (response.data.response.header.resultCode !== '00') {
                    server.specialReportServer.get('/getWthrWrnList', {
                        params: {
                            serviceKey: process.env.REACT_APP_FORECAST_INFORMATION_API_KEY_DEC,
                            numOfRows: 10,
                            pageNo: 1,
                            dataType: 'JSON',
                            stnId: locationInfoState.detail.locationNumber,
                            fromTmFc: timeInfoState.detail.currentDate,
                            toTmFc: timeInfoState.detail.currentDate
                        }
                    }).then(response => {
                        setSpecialReportInfo(response);
                    });
                } else {
                    setSpecialReportInfo(response);
                }
            } else {
                setSpecialReportInfo(response);
            }
        });
    }

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
                    {specialReportInfo !== null && specialReportInfo !== '' ? (
                        <p className='special-report-info-element'>
                            {specialReportInfo.detail.data.response.body.items.item[0].title}
                        </p>
                    ) : (<></>)
                    }
                </div>
            </div>
        </div>
    );
}