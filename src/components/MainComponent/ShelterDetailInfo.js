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
import { getBoardData, getGoodData } from '@Services/useBoard';

export default function ShelterDetailInfo() {

    const { mapShelters } = useShelterStore(); //현재 MapData에 표시된 대피소 (내주변 대피소)
    const [ matchedData, setMatchedData ] = useState([]); //matched 데이터

    const [ searchTerm, setSearchTerm ] = useState(''); //검색어
    const [ searchShelterType, setSearchShelterType ] = useState(''); //타입 검색
    const [ searchSorting, setSearchSorting ] = useState(''); //정렬 검색
    const [ searchPaging, setSearchPaging ] = useState(0) //페이징 검색

    const pointDetail = useRef([]); //detail click

    const sheltersData = useQuery({ queryKey : ['sheltersData'] });    
    const boardData = useQuery({ queryKey: ['boardData'], queryFn: () => { return getBoardData(mapShelters, searchTerm, searchShelterType, searchSorting, searchPaging) }, enabled : false }); //게시판 데이터
    const goodData = useQuery({ queryKey: ['goodData'], queryFn : getGoodData, enabled : false }); // 회원기능 : 본인 좋아요 여부 확인

    //shelterData Fetching 시점
    useEffect(() => {
        if(sheltersData.isSuccess) {
            //good data
            if(localStorage.getItem('accessToken') !== null && localStorage.getItem('accessToken') !== '') {
                goodData.refetch();
            }

            //board data
            boardData.refetch();
        }
    }, [sheltersData.isSuccess]);

    //boardData Success 시점
    useEffect(() => {
        var tempMatchedData = [];

        //boardData
        if(boardData.isSuccess) {
            var tempShelterData = [...sheltersData.data];
            var tempBoardData = [...boardData.data];
            //api 정보 + 서버 정보
            matchShelterBoard(tempShelterData, tempBoardData, tempMatchedData);   
        }
        
        //goodData
        if(goodData.isSuccess) {
            //좋아요 여부
            matchGoodYN(tempMatchedData);
        }

        //setting
        setMatchedData(tempMatchedData);
    }, [boardData.isSuccess, goodData.isSuccess]);

    //api 정보 + 서버 정보
    function matchShelterBoard(tempShelterData, tempBoardData, tempMatchedData) {
        for(let i = 0 ; i < tempBoardData.length; i++) {
            for(let j = 0 ; j < tempShelterData.length; j++) {
                if(tempBoardData[i].shelterType === tempShelterData[j].type &&
                    tempBoardData[i].shelterSN === tempShelterData[j].shelterSN
                ) {
                    tempMatchedData.push({
                        ...tempBoardData[i],
                        ...tempShelterData[j],
                        shelterName : tempShelterData[j].R_AREA_NM
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
    
    //검색
    function clickSearch () {
        if(boardData.isSuccess && goodData.isSuccess) {
            boardData.refetch();
        }
    }

    //상세보기
    function clickDetail(shelterProperNum) {
        const element = pointDetail.current[shelterProperNum];
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
        if(boardData.isSuccess && goodData.isSuccess) {
            setSearchPaging(searchPaging+10);
            boardData.refetch();
        }
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
                            <option value={'good'}>좋아요 많은순</option>
                            <option value={'review'}>리뷰 많은순</option>
                            <option value={'distance'}>가까운 순</option>
                        </select>

                        <select className='shelter-type-condition' value={searchShelterType} onChange={(e) => setSearchShelterType(e.target.value)}>
                            <option value={'total'}>전체</option>
                            <option value={'TbGtnHwcwP'}>무더위쉼터</option>
                            <option value={'TbGtnCwP'}>한파쉼터</option>
                            <option value={'shuntPlace'}>미세먼지대피소</option>
                        </select>
                        <button className='refresh-btn' onClick={clickSearch}>↩︎</button>
                    </li>
                </ul>

                {/* 게시판 */}
                <ul className='shelter-detail-info-list'>
                    {boardData.isLoading && goodData.isLoading ? <>loading...</> :
                        matchedData.length !== 0 ? matchedData.map((item, index) =>
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
                                        <Good key={item.shelterProperNum} shelterItem={item} />
                                    </div>
                                </div>

                                {/* body 클릭 시 Detail */}
                                <div className='shelter-detail-info-body' ref={element => pointDetail.current[item.shelterProperNum] = element} onClick={() => clickDetail(item.shelterProperNum)}>
                                    <p className='shelter-detail-info-name'>
                                        {item.shelterName}
                                    </p>
                                    {item.useYN === true ?
                                        <p className='shelter-detail-info-current-state useY'>현재운영중</p> :
                                        <p className='shelter-detail-info-current-state useN'>운영종료</p>}
                                </div>

                                <div className='shelter-detail-info-wrap' style={{ display: 'none' }}>
                                    <Detail key={item.shelterProperNum} shelterItem={item} />
                                </div>

                                {/* foot 클릭시 Review */}
                                <div className='shelter-detail-info-foot-wrap'>
                                    <Review key={item.shelterProperNum} shelterItem={item} />
                                </div>
                            </li>

                        ) : <div className='no-found-wrap'>
                            <div className='no-found'>
                                검색결과가 존재하지 않습니다
                            </div>
                        </div>
                    }
                </ul>

                {/* 더보기 */}
                <div className='shelter-detail-info-more-wrap' onClick={clickMore}>
                    <p className='shelter-detail-info-more'>더보기</p>
                </div>
            </div>
        </>
    );
}