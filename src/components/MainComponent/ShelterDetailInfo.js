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
import { getBoardData } from '@Services/useBoard';
import { getGoodData } from '@Services/useGood';

export default function ShelterDetailInfo() {

    const { mapShelters } = useShelterStore(); //현재 MapData에 표시된 대피소 (내주변 대피소)
    const [ matchedData, setMatchedData ] = useState([]); //matched 데이터

    const [ searchTerm, setSearchTerm ] = useState(''); //검색어
    const searchShelter = useRef([]); //검색어로 검색한 대피소
    const [ searchShelterType, setSearchShelterType ] = useState('normal'); //타입 검색
    const [ searchSortBy, setSearchSortBy ] = useState('good'); //정렬 검색
    const [ searchPaging, setSearchPaging ] = useState(0) //페이징 검색
    const [ searchSize, setSearchSize ] = useState(10) //페이징 사이즈

    const pointDetail = useRef([]); //detail click

    const sheltersData = useQuery({ queryKey : ['sheltersData'] });    
    const boardData = useQuery({ queryKey: ['boardData'], queryFn: () => { return getBoardData(searchShelter.current, searchShelterType, searchSortBy, searchPaging, searchSize) }, enabled : false }); //게시판 데이터
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
            var tempGoodData = [...goodData.data];
            //좋아요 여부
            matchGoodYN(tempGoodData, tempMatchedData);
        }

        //setting
        setMatchedData(tempMatchedData);
    }, [boardData.data, goodData.data]);

    //api 정보 + 서버 정보
    function matchShelterBoard(tempShelterData, tempBoardData, tempMatchedData) {
        for(let i = 0 ; i < tempBoardData.length; i++) {
            for(let j = 0 ; j < tempShelterData.length; j++) {
                if(tempBoardData[i].shelterType == tempShelterData[j].type &&
                    tempBoardData[i].shelterSN == tempShelterData[j].shelterSN
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
    function matchGoodYN(tempGoodData, tempMatchedData) {
        for (var i = 0; i < tempMatchedData.length; i++) {
            for (var j = 0; j < tempGoodData.length; j++) {
                if (tempGoodData[j].shelterProperNum === tempMatchedData[i].shelterProperNum) {
                    tempMatchedData[i].goodYN = true;
                    tempMatchedData[i].goodProperNum = tempGoodData[j].goodProperNum;
                    break;
                } else {
                    tempMatchedData[i].goodYN = false;
                }
            }
        }
    }

    //검색
    function clickSearch () {
        //검색 조건
        //1. 검색어 -> 검색어에 SQL Injection 방어 -> 통과
        //2. 대피소 타입 -> total, TbGtnHwcwP, TbGtnCwP, shuntPlace -> 통과
        //3. 정렬 -> good, review -> 통과
        //3-1. 정렬 -> distance -> mapShelters -> 통과
        //4. 페이징 -> 통과

        //검색어 유효성 검사
        if (searchTerm.length > 20) {
            window.alert('검색어는 최대 20자 이하여야 합니다.');
            return;
        }

        //대피소 타입 유효성 검사
        if(!(searchShelterType === 'normal' || searchShelterType === 'TbGtnHwcwP' || searchShelterType === 'TbGtnCwP' || searchShelterType === 'shuntPlace')) {
            window.alert('유효한 대피소 데이터가 아닙니다.');
            return;
        }

        //정렬 유형 검사
        if(!(searchSortBy === 'good' || searchSortBy === 'review' || searchSortBy === 'distance')) {
            window.alert('유효한 정렬 데이터가 아닙니다.');
            return;
        }

        //내 주변
        if(searchSortBy === 'distance' && (mapShelters.length === 0 || mapShelters[0] === undefined)) {
            window.alert('내 주변의 대피소 데이터가 없습니다.');
            return;
        }

        var tempSearchShelter = [];
        //내 주변 검색어 있을 때 mapShelters
        if(searchSortBy === 'distance') {
            if (searchTerm !== '' && searchTerm !== null) {
                tempSearchShelter = mapShelters.filter(shelter => shelter.R_AREA_NM.includes(searchTerm));
                searchShelter.current = tempSearchShelter;
            }
        //검색어만 있을 때 sheltersData
        } else {
            if (searchTerm !== '' && searchTerm !== null) {
                window.alert('곧 서비스를 시작할게요!');
                return;
                tempSearchShelter = sheltersData.data.filter(shelter => shelter.R_AREA_NM.includes(searchTerm));
                searchShelter.current = tempSearchShelter;
            }
        }
        

        //board 데이터 정상적으로 불러왔을 때 검색 가능
        if(boardData.isSuccess) {
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
        if(boardData.isSuccess) {
            setSearchPaging(searchPaging+1);
            clickSearch();
        }
    }


    return (
        <>
            <div className="shelter-detail-info-container">

                {/* 검색 */}
                <ul className='shelter-detail-info-filter'>
                    <li className='shelter-detail-info-search-box'>
                        <input type='text'
                            className='shelter-search-box'
                            placeholder='통합검색'
                            value={searchTerm}
                            required
                            minLength={3}
                            maxLength={20}
                            pattern="[A-Za-z0-9]+"
                            onChange={(e) => setSearchTerm(e.target.value)}></input>
                        <FaSearch className="shelter-search-icon" />
                    </li>
                    <li className='shelter-detail-info-search-condition'>
                        <select className='shelter-time-condition' value={searchSortBy} onChange={(e) => setSearchSortBy(e.target.value)}>
                            <option value={'good'}>좋아요 많은순</option>
                            <option value={'review'}>리뷰 많은순</option>
                            {/* <option value={'distance'}>가까운 순</option> */}
                        </select>

                        <select className='shelter-type-condition' value={searchShelterType} onChange={(e) => setSearchShelterType(e.target.value)}>
                            <option value={'normal'}>기본</option>
                            <option value={'TbGtnHwcwP'}>무더위쉼터</option>
                            <option value={'TbGtnCwP'}>한파쉼터</option>
                            <option value={'shuntPlace'}>미세먼지대피소</option>
                        </select>

                        <select className='shelter-size-condition' value={searchSize} onChange={(e) => setSearchSize(e.target.value)}>
                            <option value={10}>10개씩</option>
                            <option value={20}>20개씩</option>
                            <option value={30}>30개씩</option>
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
                                        {item.shelterType === 'TbGtnHwcwP' && '무더위쉼터'}
                                        {item.shelterType === 'TbGtnCwP' && '한파쉼터'}
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