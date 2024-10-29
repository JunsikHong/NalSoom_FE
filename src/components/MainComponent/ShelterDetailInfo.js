//css
import '@Style/ShelterDetailInfo.css'

//lib
import useShelterStore from '@Store/shelterStore';
import { FaSearch } from 'react-icons/fa';
import Good from './ShelterComponent/Good';
import Review from '@ShelterComponent/Review';
import Detail from '@ShelterComponent/Detail';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { getBoardData, getGoodData, getReviewData } from '@Services/useBoard';

export default function ShelterDetailInfo() {

    const { mapShelters } = useShelterStore(); //현재 MapData에 표시된 대피소 (내주변 대피소)
    const [ matchedData, setMatchedData ] = useState([]); //matched 데이터

    const [ searchTerm, setSearchTerm ] = useState(''); //검색어
    const [ searchShelterType, setSearchShelterType ] = useState(''); //타입 검색
    const [ searchSorting, setSearchSorting ] = useState(''); //정렬 검색

    const pointDetail = useRef([]); //detail click
    const pointReview = useRef([]); //review click

    const sheltersData = useQuery({ queryKey : ['sheltersData'] });    
    const boardData = useQuery({ queryKey: ['boardData'], queryFn: () => { return getBoardData(mapShelters) }, enabled : false }); //게시판 데이터
    const goodData = useQuery({ queryKey: ['goodData'], queryFn : getGoodData, enabled : false }); // 회원기능 : 본인 좋아요 여부 확인
    const reviewData = useQuery({ queryKey : ['reviewData'], queryFn : getReviewData, enabled : false}); //리뷰 데이터

    //shelterData Fetching 시점
    useEffect(() => {
        if(sheltersData.isSuccess) {
            //good data
            if(localStorage.getItem('accessToken') !== null && localStorage.getItem('accessToken') !== '') {
                goodData.refetch();
            }

            //review data
            // reviewData.refetch();

            //board data
            boardData.refetch();
        }
    }, [sheltersData.isSuccess, mapShelters]);

    //boardData Success 시점
    useEffect(() => {
        var tempMatchedData = [];

        //boardData
        if(boardData.isSuccess) {
            //temp shelter data
            var tempShelterData = [...sheltersData.data];
            var tempBoardData = [...boardData.data];

            //api 정보 + 서버 정보
            matchShelterName(tempShelterData, tempBoardData, tempMatchedData);   

            //사용 여부
            matchUseYN(tempMatchedData);

            //리뷰 정보
            // matchReview(tempMatchedData);
        }
        
        //goodData
        if(goodData.isSuccess) {
            //좋아요 여부
            matchGoodYN(tempMatchedData);
        }

        //setting
        setMatchedData(tempMatchedData);
    }, [boardData.isSuccess, goodData.isSuccess, reviewData.isSuccess, mapShelters]);

    //api 정보 + 서버 정보
    function matchShelterName(tempShelterData, tempBoardData, tempMatchedData) {
        for (let i = 0 ; i < tempShelterData.length; i++) {
            for(let j = 0 ; j < tempBoardData.length; j++) {
                if(tempShelterData[i].type === tempBoardData[j].shelterType &&
                    tempShelterData[i].shelterSN === tempBoardData[j].shelterSN
                ) {
                    tempMatchedData.push({
                        ...tempShelterData[i],
                        ...tempBoardData[j],
                        shelterName : tempShelterData[i].R_AREA_NM
                    });
                }
            }
        }
    }

    //좋아요 여부
    function matchGoodYN(tempMatchedData) {
        for (var i = 0; i < tempMatchedData.length; i++) {
            for (var j = 0; j < goodData.data.length; j++) {
                if (goodData.data[j].shelterProperNum === tempMatchedData[i].shelterProperNum) {
                    tempMatchedData[i].goodYN = true;
                    tempMatchedData[i].goodProperNum = goodData.data[j].goodProperNum;
                    break;
                } else {
                    tempMatchedData[i].goodYN = false;
                }
            }
        }
    }

    //사용가능 여부
    function matchUseYN(tempMatchedData) {
        const date = new Date();
        const formattedDate = date.toLocaleDateString(); // 오늘 날짜
        const formattedTime = date.getHours(); // 현재 시간

        for(var i = 0 ; i < tempMatchedData.length; i++) {
            switch(tempMatchedData[i].type) {
                case 'TbGtnHwcwP' :
                    let operBeginDate = new Date(tempMatchedData[i].OPER_BGNG_YMD);
                    let operEndDate = new Date(tempMatchedData[i].OPER_END_YMD)
                    if(formattedDate > operBeginDate &&
                        formattedDate < operEndDate
                    ) {
                        tempMatchedData[i].useYN = true;
                    } else {
                        tempMatchedData[i].useYN = false;
                    }
                    break;
                case 'TbGtnCwP' : 
                    let dtStartDate = new Date(tempMatchedData[i].DT_START);
                    let dtEndDate = new Date(tempMatchedData[i].DT_END);
                    if (formattedDate > dtStartDate &&
                        formattedDate < dtEndDate
                    ) {
                        tempMatchedData[i].useYN = true;
                    } else {
                        tempMatchedData[i].useYN = false;
                    }
                    break;
                case 'shuntPlace' : 
                    if(tempMatchedData[i].WKDY_USE_HR === '04:00-익일01:00') {
                        if(formattedTime > 1 && formattedTime < 4) {
                            tempMatchedData[i].useYN = false;
                        } else {
                            tempMatchedData[i].useYN = true;
                        }
                    } else if(tempMatchedData[i].WKDY_USE_HR === '24시간') {
                        tempMatchedData[i].useYN = true;
                    } else if(tempMatchedData[i].WKDY_USE_HR === '05:00-24:00'){
                        if(formattedTime > 0 && formattedTime < 5) {
                            tempMatchedData[i].useYN = false;
                        } else {
                            tempMatchedData[i].useYN = true;
                        }
                    } else {
                        let beginTime = tempMatchedData[i].WKDY_USE_HR.slice(0,1);
                        let endTime = tempMatchedData[i].WKDY_USE_HR.slice(3,4);
                        if(formattedTime > beginTime && formattedTime < endTime) {
                            tempMatchedData[i].useYN = true;
                        } else { 
                            tempMatchedData[i].useYN = false;
                        }
                    }
                    break;
                default : 
                    break;
            }
        }
    }
    
    //검색
    function clickSearch () {

    }

    //상세보기
    function clickDetail(index) {
        const element = pointDetail.current[index];
        if(element) {
            if(element.nextElementSibling.style.display === 'block') {
                element.nextElementSibling.style.display = 'none'
            } else {
                element.nextElementSibling.style.display = 'block'
            }
        }
    }

    //리뷰
    function clickReview(index) {
        const element = pointReview.current[index];
        if(element) {
            if(element.nextElementSibling.style.display === 'block') {
                element.nextElementSibling.style.display = 'none'
            } else {
                element.nextElementSibling.style.display = 'block'
            }
        }
    }

    //더보기
    function clickMore() {

    }


    return (
        <>
            <div className="shelter-detail-info-container">

                {/* 검색 */}
                <ul className='shelter-detail-info-filter'>
                    <li className='shelter-detail-info-search-box'>
                        <input type='text' className='shelter-search-box' placeholder='통합검색' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                        <FaSearch className="shelter-search-icon" />
                    </li>
                    <li className='shelter-detail-info-search-condition'>
                        <select className='shelter-time-condition' value={searchSorting} onChange={(e) => setSearchSorting(e.target.value)}>
                            <option value={'좋아요 많은순'}>좋아요 많은순</option>
                            <option value={'가까운 순'}>가까운 순</option>
                        </select>

                        <select className='shelter-type-condition' value={searchShelterType} onChange={(e) => setSearchShelterType(e.target.value)}>
                            <option value={'total'}>전체</option>
                            <option value={'coolingCentre'}>무더위쉼터</option>
                            <option value={'heatingCentre'}>한파쉼터</option>
                            <option value={'finedustShelter'}>미세먼지대피소</option>
                        </select>
                        <button className='refresh-btn' onClick={clickSearch}>↩︎</button>
                    </li>
                </ul>

                {/* 게시판 */}
                <ul className='shelter-detail-info-list'>
                    {matchedData.length !== 0 ? matchedData.map((item, index) => 
                        <li className='shelter-detail-info-component' key={index}>

                            {/* head에 Good 개수 표시 및 좋아요 클릭 시 좋아요 */}
                            <div className='shelter-detail-info-head'>
                                <p className='shelter-detail-info-type'>
                                    {item.shelterType === 'TbGtnHwcwP' && '한파쉼터'}
                                    {item.shelterType === 'TbGtnCwP' && '무더위쉼터'}
                                    {item.shelterType === 'shuntPlace' && '미세먼지대피소'}
                                    <span className='shelter-detail-info-length'>
                                        {item.length && (
                                            item.length >= 1000 ? `${Math.round(item.length / 1000)}km` : `${item.length}m`
                                        )}
                                    </span>
                                </p>
                                <div className='shelter-detail-info-like-wrap'>
                                    <Good key={item.shelterProperNum} shelterItem={item}/>
                                </div>
                            </div>

                            {/* body 클릭 시 Detail */}
                            <div className='shelter-detail-info-body' ref={element => pointDetail.current[index] = element} onClick={() => clickDetail(index)}>
                                <p className='shelter-detail-info-name'>
                                    {item.shelterName} 
                                </p>
                                {item.useYN === true ? 
                                    <p className='shelter-detail-info-current-state useY'>현재운영중</p> : 
                                    <p className='shelter-detail-info-current-state useN'>운영종료</p>}

                            </div>
                            
                            <div className='shelter-detail-info-wrap' style={{ display: 'none' }}>
                                <Detail key={index} shelterItem={item} />
                            </div>

                            {/* foot 클릭시 Review */}
                            <div className='shelter-detail-info-foot' ref={element => pointReview.current[index] = element} onClick={() => clickReview(index)}>
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
                            
                            <div className='shelter-detail-info-review-list-wrap' style={{ display: 'none' }}>
                                <Review key={index} shelterItem={item} />
                            </div>

                        </li>

                    ) : <div className='no-found-wrap'>
                            <div className='no-found'>
                                검색결과가 존재하지 않습니다
                            </div>
                        </div>}
                </ul>

                {/* 더보기 */}
                <div className='shelter-detail-info-more-wrap' onClick={clickMore}>
                    <p className='shelter-detail-info-more'>더보기</p>
                </div>
            </div>
        </>
    );
}