import { useQuery } from '@tanstack/react-query';
import { postGoodData, deleteGoodData } from '@Services/useGood';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Good({shelterItem}) {

    const navigate = useNavigate();
    const [goodYN, setGoodYN] = useState(false);
    const [goodCount, setGoodCount] = useState(0);
    const [goodProperNum, setGoodProperNum] = useState(0);

    const goodYData = useQuery({ queryKey : ['postGoodData', shelterItem.shelterProperNum], queryFn : () => { return postGoodData(shelterItem.shelterProperNum) }, enabled : false}); //회원기능 : 좋아요 입력
    const goodNData = useQuery({ queryKey : ['deleteGoodData', goodProperNum], queryFn : () => { return deleteGoodData(goodProperNum) }, enabled : false}); //회원기능 : 좋아요 삭제

    useEffect(() => {
        setGoodYN(shelterItem.goodYN);
        setGoodCount(shelterItem.goodCount);
        setGoodProperNum(shelterItem.goodProperNum);
    }, []);

    useEffect(() => {
        if(goodYData.data) {
            setGoodProperNum(goodYData.data.goodProperNum);
        }
    }, [goodYData.isSuccess]);

    function goodClick () {

        //로그인 여부
        if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === '') {
            window.confirm('좋아요 기능은 회원만 사용할 수 있어요!') && navigate('/login');
            return;
        }

        if(goodYN) { //이미 good 누른 상태
            goodNData.refetch();
            setGoodCount(goodCount-1);
        } else { //아직 good 누르지 않은 상태
            goodYData.refetch();
            setGoodCount(goodCount+1);
        }

        setGoodYN(!goodYN);

    }

    return(
        <>
            <p className='shelter-detail-info-like-btn' onClick={goodClick}>{goodYN === true ? '♥︎' : '♡'}</p>
            <p className='shelter-detail-info-like-count'>{goodCount}</p>
        </>
    );
}