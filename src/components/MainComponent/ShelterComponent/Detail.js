//css
import '@Style/ShelterDetailInfo.css'

//lib
import { useEffect, useState } from 'react';

export default function Detail({ shelterItem }) {

    const [currentShelter, setCurrentShelter] = useState(null);

    useEffect(() => {
        setCurrentShelter(shelterItem);
    }, []);

    if(currentShelter === null) return <></>;

    return (
        <>
            <div className="shelter-detail-info">
                {currentShelter !== null && currentShelter.type === 'TbGtnCwP' && (
                    <div className='cooling-centre-detail-info'>
                        {currentShelter.ROAD_NM_ADDR && <div>도로명 주소 : {currentShelter.ROAD_NM_ADDR}</div>}
                        {currentShelter.LOTNO_DADDR && <div>지번 주소 : {currentShelter.LOTNO_DADDR}</div>}
                        {currentShelter.UTZTN_PSBLTY_NOPE && <div>사용가능 인원 : {currentShelter.UTZTN_PSBLTY_NOPE}</div>}
                        {currentShelter.RMRK && <div>비고 : {currentShelter.RMRK}</div>}
                    </div>
                )}

                {currentShelter !== null && currentShelter.type === 'TbGtnHwcwP' && (
                    <div className='heating-centre-detail-info'>
                        <div className='heating-centre-detail-info-address'>
                            {currentShelter.READ_NM_ADDR && <div>도로명 주소 : {currentShelter.ROAD_NM_ADDR}</div>}
                            {currentShelter.LOTNO_DADDR && <div>지번 주소 : {currentShelter.LOTNO_DADDR}</div>}
                        </div>

                        <div className='heating-centre-detail-info-option'>
                            {currentShelter.NIGHT_OPN === 'Y' && <div>야간개방</div>}
                        </div>

                        <div className='heating-centre-detail-info-operating'>
                            {currentShelter.OPER_BGNG_YMD && <div>운영시작일 <span>{currentShelter.OPER_BGNG_YMD}</span> / </div>}
                            {currentShelter.OPER_END_YMD && <div>운영종료일 <span>{currentShelter.OPER_END_YMD}</span> / </div>}
                            {currentShelter.WD_OPN_YN && <div>평일 시작시간 <span>{currentShelter.WD_OPN_HRM}</span> / </div>}
                            {currentShelter.WD_OPN_YN && <div>평일 종료시간 <span>{currentShelter.WD_END_HRM}</span> / </div>}
                            {currentShelter.SAT_OPN_YN && <div>토요일 시작시간 <span>{currentShelter.SAT_OPN_HRM}</span> / </div>}
                            {currentShelter.SAT_OPN_YN && <div>토요일 종료시간 <span>{currentShelter.SAT_END_HRM}</span> / </div>}
                            {currentShelter.SUN_OPN_YN && <div>일요일 시작시간 <span>{currentShelter.SUN_OPN_HRM}</span> / </div>}
                            {currentShelter.SUN_OPN_YN && <div>일요일 종료시간 <span>{currentShelter.SUN_END_HRM}</span></div>}
                            {currentShelter.LHLDY_OPN_YN && <div>일요일 시작시간 <span>{currentShelter.LHLDY_OPN_HRM}</span> / </div>}
                            {currentShelter.LHLDY_OPN_YN && <div>일요일 종료시간 <span>{currentShelter.LHLDY_END_HRM}</span> / </div>}
                        </div>

                        <div className='heating-centre-detail-info-count'>
                            {currentShelter.UTZTN_PSBLTY_NOPE && <div>사용가능 인원 <span>{currentShelter.UTZTN_PSBLTY_NOPE}</span> / </div>}
                        </div>
                    </div>
                )}

                {currentShelter !== null && currentShelter.type === 'shuntPlace' && (
                    <div className='shunt-place-detail-info'>
                        {currentShelter.ADDR && <div>주소<span>{currentShelter.ADDR}</span></div>}

                        <div className='shunt-place-detail-info-option'>
                            {currentShelter.MBSH_YN === 'Y' && <div>회원제</div>}
                        </div>

                        <div className='shunt-place-detail-info-operating'>
                            {currentShelter.WD_UTZTN_HRM && <div>평일이용시간 <span>{currentShelter.WD_UTZTN_HRM}</span> / </div>}
                            {currentShelter.WE_UTZTN_HRM && <div>주말이용시간 <span>{currentShelter.WE_UTZTN_HRM}</span> / </div>}
                        </div>

                        <div className='shunt-place-detail-info-count'>
                            {currentShelter.UTZTN_PSBLTY_NOPE && <div>사용가능인원 <span>{currentShelter.UTZTN_PSBLTY_NOPE}</span> / </div>}
                            {currentShelter.RMARK && <div>비고 <span>{currentShelter.RMARK}</span></div>}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}