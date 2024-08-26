//css
import '@Style/ShelterDetailInfo.css'

//lib
import useShelterStore from '@Store/shelterStore';

export default function ShelterDetailInfo() {

    const { currentShelterType, currentShelter } = useShelterStore();

    return (
        <>
            <div className="shelter-detail-info-container">
                <div className="shelter-detail-info">
                    {currentShelter !== null && currentShelterType === 'coolingCentre' && (
                        <div>
                            <div>대피소 명칭 : {currentShelter.R_AREA_NM}</div>
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

                    {currentShelter !== null && currentShelterType === 'heatingCentre' && (
                        <div>
                            <div>대피소 명칭 : {currentShelter.R_AREA_NM}</div>
                            <div>도로명 주소 : {currentShelter.R_DETL_ADD}</div>
                            <div>사용가능 인원 : {currentShelter.USE_PRNB}</div>
                            <div>열풍기 보유 대수 : {currentShelter.HEAT1_CNT}</div>
                            <div>히터 보유 대수 : {currentShelter.HEAT2_CNT}</div>
                            <div>난로 보유 대수 : {currentShelter.HEAT3_CNT}</div>
                            <div>라디에이터 보유 대수 : {currentShelter.HEAT4_CNT}</div>
                            <div>냉방기 기구비 여부 : {currentShelter.CHK1_YN}</div>
                            <div>휴식공간 여부 : {currentShelter.CHK2_YN}</div>
                            <div>야간개방 여부 : {currentShelter.CHK3_YN}</div>
                            <div>전기료지원 여부 : {currentShelter.CHK5_YN}</div>
                            <div>전기료지원 여부 : {currentShelter.CHK6_YN}</div>
                            <div>홍보물비치 여부 : {currentShelter.CHK7_YN}</div>
                            <div>숙박가능 여부 : {currentShelter.CHK8_YN}</div>
                            <div>홍보물비치 여부 : {currentShelter.CHK7_YN}</div>
                            <div>한파쉼터 운영시작일 : {currentShelter.C_DT_STRT}</div>
                            <div>한파쉼터 운영종료일 : {currentShelter.C_DT_END}</div>
                            <div>한파쉼터 평일 시작시간 : {currentShelter.C_STRT}</div>
                            <div>한파쉼터 평일 종료시간 : {currentShelter.C_END}</div>
                            <div>한파쉼터 주말 시작시간 : {currentShelter.C_STRT_WD}</div>
                            <div>한파쉼터 주말 종료시간 : {currentShelter.C_END_WD}</div>
                        </div>
                    )}

                    {currentShelter !== null && currentShelterType === 'finedustShelter' && (
                        <div>
                            
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}