import 'style/Notification.css';

export default function Notification({ specialReportAPIInfoState }) {
    return (
        <div>
            <div className="notification-wrap">
                <div className="notification">
                    {specialReportAPIInfoState.state === 'specialReportAPIInfoUpdated' && specialReportAPIInfoState.detail !== null && specialReportAPIInfoState.detail !== '' ? (
                        <p className='special-report-info-element'>
                            {specialReportAPIInfoState.detail.data.response.body.items.item[0].title}
                        </p>
                        ): (<></>)
                    }
                </div>
            </div>
        </div>
    );
}