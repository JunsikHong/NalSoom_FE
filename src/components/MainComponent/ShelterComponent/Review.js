//css
import '@Style/ShelterDetailInfo.css'

import { getReviewDataList, postReviewData } from '@Services/useBoard';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

export default function Review({ shelterItem }) {

    const navigate = useNavigate();

    const newReviewData = useQuery({ queryKey : ['newReviewData', shelterItem.shelterProperNum], queryFn : () => { return postReviewData(newReviewContent, shelterItem.shelterProperNum) }, enabled : false}); //리뷰 쓰기
    const reviewDataList = useQuery({ queryKey : ['reviewDataList', shelterItem.shelterProperNum], queryFn : () => { return getReviewDataList(shelterItem.shelterProperNum) }, enabled : false}); //리뷰 10개 가져오기

    const [ newReviewContent, setNewReviewContent] = useState(''); //새로운 리뷰 내용
    const [ recentReviewData, setRecentReviewData ] = useState([]); //리뷰 최신순 10개
    const [ viewRecentReview, setViewRecentReview] = useState(false); //리뷰 보이기

    useEffect(() => {
        if(reviewDataList.isSuccess) {
            setRecentReviewData(reviewDataList.data);
        }
    }, [reviewDataList.data, newReviewData.data]);

    useEffect(() => {
        if(newReviewData.isSuccess) {
            reviewDataList.refetch();
        }
    }, [newReviewData.data]);

    function clickNewReview() {

        //로그인 여부
        if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === '') {
            window.confirm('리뷰 기능은 회원만 사용할 수 있어요!') && navigate('/login');
            return;
        }

        if (newReviewContent !== '') {
            newReviewData.refetch();
            setNewReviewContent('');
        } else {
            window.alert('리뷰 내용을 작성해주세요!');
        }
    }

    function clickRecentReview() {
        if(!viewRecentReview) {
            if(!reviewDataList.data) {
                reviewDataList.refetch();
            }
            setViewRecentReview(true);
        } else {
            setViewRecentReview(false);
        }
    }

    function reviewTimeFormat(dateString) {
        const now = new Date();
        const date = new Date(dateString);

        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays >= 3) {
            // 3일 이상 경과한 경우 MM/DD 형식으로 표시
            const options = { month: 'numeric', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        } else if (diffInDays > 0) {
            return `${diffInDays}일전`;
        } else if (diffInHours > 0) {
            return `${diffInHours}시간전`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes}분전`;
        } else {
            return '방금전'; // 1분 이내의 경우
        }
    }

    return (
        <>
            <div className='shelter-detail-info-foot' onClick={clickRecentReview}>
                <p className='shelter-detail-info-review-count'>💬 {recentReviewData.length !== 0 ? recentReviewData.length : shelterItem.reviewCount}</p>
                <div className='shelter-detail-info-review-firstline-btn-wrap'>
                    {shelterItem.reviewCount !== 0 || recentReviewData.length !== 0 ? <p className='shelter-detail-info-review-firstline'>{recentReviewData.length !== 0 ? recentReviewData[0].reviewContent : shelterItem.reviewContent}</p> : <></>}
                    {shelterItem.reviewCount !== 0 || recentReviewData.length !== 0 ? <p className='shelter-detail-info-more-btn'>⬇️</p> : <></>}
                </div>
            </div>
            <ul className='shelter-detail-info-recent-review-wrap'>
                {recentReviewData.length !== 0 && viewRecentReview &&
                    recentReviewData.map(recentReview => 
                        <li className='shelter-detail-info-recent-review-list' key={recentReview.reviewProperNum}>
                            <p className='shelter-detail-info-recent-review'>{recentReview.reviewContent}</p>
                            <p className='shelter-detail-info-recent-review-time'>{reviewTimeFormat(recentReview.reviewWriteTime)}</p>
                            <p className='shelter-detail-info-recent-review-update'></p>
                            <p className='shelter-detail-info-recent-review-delete'></p>
                        </li>
                    )
                }
            </ul>
            <div className='shelter-detail-info-review-wrap'>
                <input type='text' className='new-review-box' placeholder='리뷰를 남겨주세요 (욕설이나 비방의 목적으로 작성한 글은 삭제조치 됩니다)' value={newReviewContent} onChange={(e) => setNewReviewContent(e.target.value)}></input>
                <button className='new-review-btn' onClick={clickNewReview}>↩︎</button>
            </div>
        </>
    );
}