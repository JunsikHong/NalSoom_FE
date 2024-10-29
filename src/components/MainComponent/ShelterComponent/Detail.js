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
                        <div>도로명 주소 : {currentShelter.R_DETL_ADD}</div>

                        <div>지번 주소 : {currentShelter.J_DETL_ADD}</div>
                        <div>사용가능 인원 : {currentShelter.USE_PRNB}</div>
                        <div>선풍기 보유 대수 : {currentShelter.CLER1_CNT}</div>
                        <div>에어컨 보유 대수 : {currentShelter.CLER2_CNT}</div>
                        <div>야간 개방 여부 : {currentShelter.CHK1_YN}</div>
                        <div>휴일 개방 여부 : {currentShelter.CHK2_YN}</div>
                        <div>숙박 가능 여부 : {currentShelter.CHK3_YN}</div>
                    </div>
                )}

                {currentShelter !== null && currentShelter.type === 'TbGtnHwcwP' && (
                    <div className='heating-centre-detail-info'>
                        <div className='heating-centre-detail-info-address'>
                            <div>{currentShelter.R_DETL_ADD}</div>
                        </div>

                        <div className='heating-centre-detail-info-option'>
                            {currentShelter.CHK1_YN === 'Y' && <div>냉방기 구비</div>}
                            {currentShelter.CHK2_YN === 'Y' && <div>휴식공간</div>}
                            {currentShelter.CHK3_YN === 'Y' && <div>적정온도</div>}
                            {currentShelter.CHK4_YN === 'Y' && <div>전기료지원</div>}
                            {currentShelter.CHK5_YN === 'Y' && <div>간판부착</div>}
                            {currentShelter.CHK6_YN === 'Y' && <div>홍보물비치</div>}
                            {currentShelter.CHK7_YN === 'Y' && <div>숙박가능</div>}
                            {currentShelter.CHK8_YN === 'Y' && <div>야간개방</div>}
                        </div>

                        <div className='heating-centre-detail-info-operating'>
                            {currentShelter.C_DT_STRT && <div>운영시작일 <span>{currentShelter.C_DT_STRT}</span> / </div>}
                            {currentShelter.C_DT_END && <div>운영종료일 <span>{currentShelter.C_DT_END}</span> / </div>}
                            {currentShelter.C_STRT && <div>평일 시작시간 <span>{currentShelter.C_STRT}</span> / </div>}
                            {currentShelter.C_END && <div>평일 종료시간 <span>{currentShelter.C_END}</span> / </div>}
                            {currentShelter.C_STRT_WD && <div>주말 시작시간 <span>{currentShelter.C_STRT_WD}</span> / </div>}
                            {currentShelter.C_END_WD && <div>주말 종료시간 <span>{currentShelter.C_END_WD}</span></div>}
                        </div>

                        <div className='heating-centre-detail-info-count'>
                            {currentShelter.USE_PRNB && <div>사용가능 인원 <span>{currentShelter.USE_PRNB}</span> / </div>}
                            {currentShelter.HEAT1_CNT && <div>열풍기 보유 대수 <span>{currentShelter.HEAT1_CNT}</span> / </div>}
                            {currentShelter.HEAT2_CNT && <div>히터 보유 대수 <span>{currentShelter.HEAT2_CNT}</span> / </div>}
                            {currentShelter.HEAT3_CNT && <div>난로 보유 대수 <span>{currentShelter.HEAT3_CNT}</span> / </div>}
                            {currentShelter.HEAT4_CNT && <div>라디에이터 보유 대수 <span>{currentShelter.HEAT4_CNT}</span> / </div>}
                        </div>
                    </div>
                )}

                {currentShelter !== null && currentShelter.type === 'shuntPlace' && (
                    <div className='shunt-place-detail-info'>
                        <div>도로명 주소 : {currentShelter.ADR_NAM}</div>

                        <div>행정동 이름 : {currentShelter.HJD_NAM}</div>
                        <div>사용가능 인원 : {currentShelter.HOU_CNT_M}</div>
                        <div>시설 유형 : {currentShelter.EQUP_TYPE}</div>
                        <div>전화번호 : {currentShelter.TEL_NO_CN}</div>
                        <div>평일 이용 시간 : {currentShelter.WKDY_USE_HR}</div>
                        <div>주말 이용 시간 : {currentShelter.WKND_USE_HR}</div>
                        <div>회원제 여부 : {currentShelter.MEMBERSHIP_YN}</div>
                        <div>면적 : {currentShelter.AREA}</div>
                        <div>비고 : {currentShelter.REMARK}</div>
                    </div>
                )}
            </div>
        </>
    );
}