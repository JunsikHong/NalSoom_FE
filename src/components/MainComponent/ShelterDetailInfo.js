//css
import '@Style/ShelterDetailInfo.css'

//lib
import useShelterStore from '@Store/shelterStore';

export default function ShelterDetailInfo() {

    const { currentShelterType, currentShelter } = useShelterStore();

    return (
        <>
            <div className="shelter-detail-info-container">
                <ul className='shelter-detail-info-filter'>
                    <li className='shelter-detail-info-search-box'>
                        <input type='text' className='shelter-search-box' placeholder='통합검색'></input>
                    </li>
                    <li className='shelter-detail-info-search-time-condition'>
                        <select className='shelter-time-condition'>
                            <option value={'가까운 순'}>가까운 순</option>
                            <option value={'좋아요 많은순'}>좋아요 많은순</option>
                        </select>
                    </li>
                    <li className='shelter-detail-info-search-type-condition'>
                        <select className='shelter-type-condition'>
                            <option value={'total'}>통합</option>
                            <option value={'coolingCentre'}>무더위쉼터</option>
                            <option value={'heatingCentre'}>한파쉼터</option>
                            <option value={'finedustShelter'}>미세먼지대피소</option>
                        </select>
                    </li>
                </ul>
                <ul className='shelter-detail-info-list'>
                    <li className='shelter-detail-info-component'>
                        <div className='shelter-detail-info-head'>
                            <p className='shelter-detail-info-type'>
                                무더위쉼터
                            </p>
                            <div className='shelter-detail-info-like-wrap'>
                                <p className='shelter-detail-info-like-btn'>
                                    ♥︎
                                </p>
                                <p className='shelter-detail-info-like-count'>
                                    25
                                </p>
                            </div>
                        </div>
                        <div className='shelter-detail-info-body'>
                            <p className='shelter-detail-info-name'>
                                강동신용협동조합암사본점
                            </p>
                            <p className='shelter-detail-info-current-state'>
                                현재운영중
                            </p>
                        </div>
                        <div className='shelter-detail-info-foot'>
                            <p className='shelter-detail-info-review-count'>
                                💬 30
                            </p>
                            <div className='shelter-detail-info-review-wrap'>
                                <p className='shelter-detail-info-review-firstline'>
                                    너무 시원하고 좋아요
                                </p>
                                <p className='shelter-detail-info-more-btn'>
                                    ⬇️
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>



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