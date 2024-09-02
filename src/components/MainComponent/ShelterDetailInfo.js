//css
import '@Style/ShelterDetailInfo.css'

//lib
import useShelterStore from '@Store/shelterStore';
import { FaSearch } from 'react-icons/fa';
import Review from '@ShelterComponent/Review';
import Detail from '@ShelterComponent/Detail';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getBoardData, getGoodData } from '@Services/useBoard';
import { useNavigate } from 'react-router-dom';


export default function ShelterDetailInfo() {

    const navigate = useNavigate();
    
    const shelterData = useQuery({queryKey : ['shelterData']}); //캐싱된 대피소 데이터 불러오기
    
    const [doGetBoardData, setDoGetBoardData] = useState(false); // 게시판 데이터 Fetching
    const boardData = useQuery({ queryKey: ['boardData'], queryFn: getBoardData, enabled : doGetBoardData }); //게시판 데이터
    
    const [doGetGoodData, setDoGetGoodData] = useState(false); //좋아요 데이터 Fetching
    const goodData = useQuery({ queryKey: ['goodData'], queryFn : getGoodData, enabled : doGetGoodData }); // 회원기능 : 본인 좋아요 여부 확인
    
    const [matchedData, setMatchedData] = useState([]); //matched 데이터

    //shelterData Fetching 시점
    useEffect(() => {
        if(shelterData.isFetched) {
            setDoGetBoardData(true);
        }
    }, [shelterData.data]);

    //boardData Success 시점
    useEffect(() => {
        if(boardData.isSuccess) {
            if(localStorage.getItem('user_proper_num')) {
                setDoGetGoodData(true);
            } else {
                matchingData();
            }
        }
    }, [boardData.data]);

    //goodData Success 시점
    useEffect(() => {
        if(goodData.isSuccess) {
            matchingData();
        }
    }, [goodData.data]);

    //shelterData와 boardData matching
    function matchingData() {
        let tempMatchedData = [];
        shelterData.data.resultArray1.forEach(shelterItem => {
            const matching = boardData.data.find(boardItem => 
                boardItem.areaCD === shelterItem.AREA_CD
                && boardItem.shelterType === 'coolingCentre'
            );

            if(matching) {
                tempMatchedData.push({
                    shelterType : 'coolingCentre',
                    ...matching,
                    R_AREA_NM : shelterItem.R_AREA_NM
                });
            }
        });

        shelterData.data.resultArray2.forEach(shelterItem => {
            const matching = boardData.data.find(boardItem => 
                boardItem.areaCD === shelterItem.AREA_CD
                && boardItem.shelterType === 'heatingCentre'
            );

            if(matching) {
                tempMatchedData.push({
                    shelterType : 'heatingCentre',
                    ...matching,
                    R_AREA_NM : shelterItem.R_AREA_NM
                });
            }
        });

        shelterData.data.resultArray3.forEach(shelterItem => {
            const matching = boardData.data.find(boardItem => 
                boardItem.areaCD === shelterItem.AREA_CD
                && boardItem.shelterType === 'finedustShelter'
            );

            if(matching) {
                tempMatchedData.push({
                    shelterType : 'finedustShelter',
                    ...matching,
                    R_AREA_NM : shelterItem.R_AREA_NM
                });
            }
        });

        setMatchedData(tempMatchedData);

    }

    //good Click/UnClick
    // function goodClick(listData) {
    //     if(localStorage.getItem('accessToken')) {
    //         setGoodClickItem({
    //             shelterType : listData.shelterType,
    //             areaCD : listData.AREA_CD
    //         });
    //         setDoPutGoodClick(true);
    //     } else {
    //         window.alert('로그인 후에 사용 가능합니다');
    //         navigate('/login');
    //     }
    // }

    // const { currentShelterType, currentShelter, setCurrentShelter, setCurrentShelterType } = useShelterStore(); //현재 map에서 선택된 요소
    // const [doPutGoodClick, setDoPutGoodClick] = useState(false); // 게시판 좋아요 클릭 Fetching
    // const [goodClickItem, setGoodClickItem] = useState({}); //좋아요 한 Item 식별자
    // const goodData = useQuery({ queryKey: ['goodData'], queryFn : () => {putGoodClick(goodClickItem)}, enabled : doPutGoodClick}); //게시판 좋아요 클릭

    //SQL에 미리 뷰 정의(shelter_proper_num에 대해 최근 리뷰1개, 좋아요 개수)

    //반복 돌리면서 

    //프론트에서 Good에 area_cd, shelter_type 넘겨서
    //Good에서 이것들 가지고 서버에 좋아요 개수 요청 (최초 10개만)

    //프론트에서 area_cd, shelter_type 가지고 서버에 최근 리뷰1개 요청 (최초 10개만)

    //Review클릭 시 area_cd, shelter_type 가지고 서버에 리뷰 요청 (최초 10개만)

    //제목 클릭 시 Detail에서 currentShelterStore에서 정보 가져와서 띄우기

    return (
        <>
            <div className="shelter-detail-info-container">

                {/* 검색 */}
                <ul className='shelter-detail-info-filter'>
                    <li className='shelter-detail-info-search-box'>
                        <input type='text' className='shelter-search-box' placeholder='통합검색'></input>
                        <FaSearch className="shelter-search-icon" />
                    </li>
                    <li className='shelter-detail-info-search-condition'>
                        <select className='shelter-time-condition'>
                            <option value={'가까운 순'}>가까운 순</option>
                            <option value={'좋아요 많은순'}>좋아요 많은순</option>
                        </select>

                        <select className='shelter-type-condition'>
                            <option value={'total'}>전체</option>
                            <option value={'coolingCentre'}>무더위쉼터</option>
                            <option value={'heatingCentre'}>한파쉼터</option>
                            <option value={'finedustShelter'}>미세먼지대피소</option>
                        </select>
                        <button className='refresh-btn'>↩︎</button>
                    </li>
                </ul>

                {/* 게시판 */}
                <ul className='shelter-detail-info-list'>
                    {matchedData.length !== 0 ? matchedData.map((item, index) => 
                        <li className='shelter-detail-info-component' key={index}>

                            {/* head에 Good 개수 표시 및 좋아요 클릭 시 좋아요 */}
                            <div className='shelter-detail-info-head'>
                                <p className='shelter-detail-info-type'>
                                    {item.shelterType === 'coolingCentre' && '무더위쉼터'}
                                    {item.shelterType === 'heatingCentre' && '한파쉼터'}
                                    {item.shelterType === 'finedustShelter' && '미세먼지대피소'}
                                </p>
                                <div className='shelter-detail-info-like-wrap'>
                                    <p className='shelter-detail-info-like-btn'>
                                        {/*  onClick={(item) => {goodClick(item)}} */}
                                        {!localStorage.getItem('user_proper_num') && <span>♡</span>}
                                        
                                        {/* ♥︎ */}
                                    </p>
                                    <p className='shelter-detail-info-like-count'>
                                        {item.goodCount}
                                    </p>
                                </div>
                            </div>

                            {/* body 클릭 시 Detail */}
                            <div className='shelter-detail-info-body'>
                                <p className='shelter-detail-info-name'>
                                    {item.R_AREA_NM} 
                                </p>
                                <p className='shelter-detail-info-current-state'>
                                    현재운영중
                                </p>
                            </div>

                            {/* foot 클릭시 Review */}
                            <div className='shelter-detail-info-foot'>
                                <p className='shelter-detail-info-review-count'>
                                    💬 {item.reviewCount}
                                </p>
                                <div className='shelter-detail-info-review-wrap'>
                                    <p className='shelter-detail-info-review-firstline'>
                                        {item.reviewCount !== 0 && item.reviewContent}
                                    </p>
                                    <p className='shelter-detail-info-more-btn'>
                                        ⬇️ 
                                    </p>
                                </div>
                            </div>
                        </li>

                    ) : <div className='no-found-wrap'>
                            <div className='no-found'>
                                검색결과가 존재하지 않습니다
                            </div>
                        </div>}
                </ul>

            </div>
        </>
    );
}