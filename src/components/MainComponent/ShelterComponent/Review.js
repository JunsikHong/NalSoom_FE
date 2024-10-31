//css
import '@Style/ShelterDetailInfo.css'

import { getReviewDataList, postReviewData,postComplaintReviewData, updateReviewData, deleteReviewData } from '@Services/useReview';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import { FaPen, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

export default function Review({ shelterItem }) {

    const navigate = useNavigate();
    const [ complaintReviewProperNum, setComplaintReviewProperNum ] = useState(0); //신고 할 리뷰 번호

    const reviewDataList = useQuery({ queryKey : ['reviewDataList', shelterItem.shelterProperNum], queryFn : () => { return getReviewDataList(shelterItem.shelterProperNum) }, enabled : false}); //리뷰 10개 가져오기
    const newReviewData = useQuery({ queryKey : ['newReviewData', shelterItem.shelterProperNum], queryFn : () => { return postReviewData(newReviewContent, shelterItem.shelterProperNum) }, enabled : false}); //리뷰 쓰기
    const modifiedReviewData = useQuery({ queryKey : ['updateReviewData', shelterItem.shelterProperNum], queryFn : () => { return updateReviewData(updateReviewProperNum, updateReviewContent) }, enabled : false}); //리뷰 수정
    const deletedReviewData = useQuery({ queryKey : ['deleteReviewData', shelterItem.shelterProperNum], queryFn : () => { return deleteReviewData(deleteReviewProperNum) }, enabled : false}); //리뷰 삭제

    const complaintReviewData = useQuery({ queryKey : ['complaintReviewData', complaintReviewProperNum], queryFn : () => { return postComplaintReviewData(complaintReviewProperNum, complaintReviewContent) }, enabled : false }); //리뷰 신고

    const [ viewRecentReview, setViewRecentReview] = useState(false); //리뷰 보이기
    const [ recentReviewData, setRecentReviewData ] = useState([]); //리뷰 최신순 10개
    
    const [ newReviewContent, setNewReviewContent] = useState(''); //새로운 리뷰 내용
    
    const [ updateReviewProperNum, setUpdateReviewProperNum ] = useState(); //수정 할 리뷰 번호
    const [ updateReviewContent, setUpdateReviewContent ] = useState(''); //수정 할 리뷰 내용
    const pointUpdateReview = useRef([]); //review update click
    
    const [ deleteReviewProperNum, setDeleteReviewProperNum ] = useState(); //삭제 할 리뷰 번호

    const [ complaintReviewContent, setComplaintReviewContent ] = useState(''); //신고 할 리뷰 내용
    const pointComplaintReview = useRef([]); //review complaint click

    //새로운 리뷰 데이터 생성 후에 -> 리뷰 데이터 새로 불러오기
    useEffect(() => {
        if (newReviewData.isSuccess) {
            reviewDataList.refetch();
            window.alert('새로운 리뷰를 등록했어요!');
        }
    }, [newReviewData.data]);

    //리뷰 수정 완료 후에 -> 리뷰 데이터 새로 불러오기
    useEffect(() => {
        if (modifiedReviewData.isSuccess) {
            reviewDataList.refetch();
            window.alert('리뷰 수정이 완료되었습니다!');
        }
    }, [modifiedReviewData.data]);

    //리뷰 삭제 완료 후에 -> 리뷰 데이터 새로 불러오기
    useEffect(() => {
        if(deletedReviewData.isSuccess) {
            reviewDataList.refetch();
            window.alert('리뷰 삭제가 완료되었습니다!');
        }
    }, [deletedReviewData.data]);

    //리뷰 데이터 새로 불러온 후에 -> 최근 리뷰 데이터 재설정
    useEffect(() => {
        if(reviewDataList.isSuccess) {
            setRecentReviewData(reviewDataList.data);
        }
    }, [reviewDataList.data, newReviewData.data, modifiedReviewData.data, deletedReviewData.data]);

    //최근 리뷰 불러오기 select
    function clickRecentReview() {
        if(!viewRecentReview) {
            reviewDataList.refetch();
            setViewRecentReview(true);
        } else {
            setViewRecentReview(false);
        }
    }

    //새로운 리뷰 작성 create
    function clickNewReview() {

        //로그인 여부
        if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === '') {
            window.confirm('리뷰 작성은 회원만 할 수 있어요!') && navigate('/login');
            return;
        }

        //리뷰 내용 유효성 검사
        if(newReviewContent === '') {
            window.alert('리뷰 내용을 작성해주세요!');
            return;
        }

        //리뷰 내용 유효성 검사
        if(newReviewContent.length < 5 || newReviewContent.length > 100) {
            window.alert('리뷰는 최소 5자 ~ 최대 100자까지만 작성 가능해요!');
            return;
        }

        newReviewData.refetch();
        setNewReviewContent('');
    }

    //내가 쓴 리뷰 수정 update
    function clickReviewUpdate(reviewProperNum) {
        const element = pointUpdateReview.current[reviewProperNum];
        if(element) {
            const updateElement = element.current.parentElement.nextElementSibling;
            console.log(updateElement);
            if (updateElement.style.display === 'none') {
                updateElement.style.display = 'block';
                setUpdateReviewProperNum(reviewProperNum);
            }
        }
    }
    
    //내가 쓴 리뷰 수정 확인 update
    function clickReviewUpdateConfirm(reviewProperNum) {
        if(!updateReviewProperNum) {
            window.alert('일시적 오류입니다. 새로고침 후 다시 시도해주세요!');
            return;
        }

        if(updateReviewContent.length < 5 || updateReviewContent.length > 100) {
            window.alert('리뷰는 최소 5자 ~ 최대 100자까지만 작성 가능해요!');
        }

        modifiedReviewData.refetch();
        clickReviewUpdateCancel(reviewProperNum);
    }

    //내가 쓴 리뷰 수정 취소 update
    function clickReviewUpdateCancel(reviewProperNum) {
        const element = pointUpdateReview.current[reviewProperNum];
        if(element) {
            const updateElement = element.current.parentElement.nextElementSibling;
            if (updateElement.style.display === 'block') {
                updateElement.style.display = 'none';
                setUpdateReviewProperNum();
                setUpdateReviewContent('');
            }
        }
    }

    //내가 쓴 리뷰 삭제 delete
    function clickReviewDelete(reviewProperNum) {
        setDeleteReviewProperNum(reviewProperNum);
        const deleteYn = window.confirm('리뷰를 삭제하시겠습니까?');

        if(deleteYn) {
            deletedReviewData.refetch();
        } else {
            setDeleteReviewProperNum();
        }
    }

    //리뷰 신고
    function clickReviewComplaint (reviewProperNum) {
        if(localStorage.getItem('accessToken') === null && localStorage.getItem('accessToken') === '') {
            window.confirm('로그인 이후에 신고 가능합니다.') && navigate('/login');
            return;
        }

        const element = pointComplaintReview.current[reviewProperNum];
        if(element) {
            const complaintElement = element.current.parentElement.nextElementSibling.nextElementSibling;
            if (complaintElement.style.display === 'none') {
                complaintElement.style.display = 'block';
                setComplaintReviewProperNum(reviewProperNum);
            }
        }
    }

    //리뷰 신고 확인
    function clickReviewComplaintConfirm(reviewProperNum) {
        if(!complaintReviewProperNum) {
            window.alert('일시적 오류입니다. 새로고침 후 다시 시도해주세요!');
            return;
        }

        if(complaintReviewContent.length < 5 || complaintReviewContent.length > 500) {
            window.alert('리뷰신고 내용을 최소 5자 이상 최대 500자 이하로 작성해주세요!');
        }

        complaintReviewData.refetch();
        clickReviewComplaintCancel(reviewProperNum)
    }

    //리뷰 신고 취소
    function clickReviewComplaintCancel(reviewProperNum) {
        const element = pointComplaintReview.current[reviewProperNum];
        if(element) {
            const complaintElement = element.current.parentElement.nextElementSibling.nextElementSibling;
            if (complaintElement.style.display === 'block') {
                complaintElement.style.display = 'none';
                setComplaintReviewProperNum();
                setComplaintReviewContent('');
            }
        }
    }

    //리뷰 시간 표기
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
                
                {/* 리뷰 개수 및 최신 댓글 */}
                <p className='shelter-detail-info-review-count'>💬 {recentReviewData.length !== 0 ? recentReviewData.length : shelterItem.reviewCount}</p>
                <div className='shelter-detail-info-review-firstline-btn-wrap'>
                    {shelterItem.reviewCount !== 0 || recentReviewData.length !== 0 ? <p className='shelter-detail-info-review-firstline'>{recentReviewData.length !== 0 ? recentReviewData[0].reviewContent : shelterItem.reviewContent}</p> : <></>}
                    {shelterItem.reviewCount !== 0 || recentReviewData.length !== 0 ? <p className='shelter-detail-info-more-btn'>⬇️</p> : <></>}
                </div>
            
            </div>
            <ul className='shelter-detail-info-recent-review-wrap'>
                {recentReviewData.length !== 0 && viewRecentReview && recentReviewData.map(recentReview =>
                    <li className='shelter-detail-info-recent-review-list' key={recentReview.reviewProperNum}>
                        
                        {/* 리뷰 내용 수정 삭제 신고 */}
                        <p className='shelter-detail-info-recent-review'>{recentReview.reviewContent}</p> 
                        <div className='shelter-detail-info-recent-review-right'>
                            <p className='shelter-detail-info-recent-review-time'>{reviewTimeFormat(recentReview.reviewWriteTime)}</p>
                            {recentReview.myReview &&
                                <>
                                    <p className='shelter-detail-info-recent-review-update' ref={element => pointUpdateReview.current[recentReview.reviewProperNum] = element} onClick={() => clickReviewUpdate(recentReview.reviewProperNum)}><FaPen/></p>
                                    <p className='shelter-detail-info-recent-review-delete' onClick={() => clickReviewDelete(recentReview.reviewProperNum)}><FaTrash /></p>
                                </>
                            }
                            <p className='shelter-detail-info-recent-review-complaint' ref={element => pointComplaintReview.current[recentReview.reviewProperNum] = element} onClick={() => clickReviewComplaint(recentReview.reviewProperNum)}>신고</p>
                        </div>

                        {/* 리뷰 수정 */}
                        <div style={{display : 'none'}}>
                            <div>
                                <input type='text' className='update-review-box' placeholder='리뷰 수정 중...' value={updateReviewContent} onChange={(e) => setUpdateReviewContent(e.target.value)}></input>
                                <p className='shelter-detail-info-recent-review-update-confirm' onClick={() => clickReviewUpdateConfirm(recentReview.reviewProperNum)}><FaCheck/></p>
                                <p className='shelter-detail-info-recent-review-update-cancel' onClick={() => clickReviewUpdateCancel(recentReview.reviewProperNum)}><FaTimes/></p>
                            </div>
                        </div>

                        {/* 리뷰 신고 */}
                        <div style={{display : 'none'}}>
                            <div>
                                <input type='text' className='review-complaint-box' placeholder='신고 내용을 입력해 주세요' value={complaintReviewContent} onChange={(e) => setComplaintReviewContent(e.target.value)}></input>
                                <p className='shelter-detail-info-review-complaint-confirm' onClick={() => clickReviewComplaintConfirm(recentReview.reviewProperNum)}>신고하기</p>
                                <p className='shelter-detail-info-review-complaint-cancel' onClick={() => clickReviewComplaintCancel(recentReview.reviewProperNum)}>취소</p>
                            </div>
                        </div>

                    </li>)
                }
            </ul>

            {/* 새로운 리뷰 작성 */}
            <div className='shelter-detail-info-review-wrap'>
                <input type='text' className='new-review-box' placeholder='리뷰를 남겨주세요 (욕설이나 비방의 목적으로 작성한 글은 삭제조치 됩니다)' value={newReviewContent} onChange={(e) => setNewReviewContent(e.target.value)}></input>
                <button className='new-review-btn' onClick={clickNewReview}>↩︎</button>
            </div>

        </>
    );
}