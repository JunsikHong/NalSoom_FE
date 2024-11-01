//css
import '@Style/JoinInput.css';

//lib
import { useQuery } from '@tanstack/react-query';
import { checkIdDuplicate, sendEmail, checkEmail, putUserAuthData } from '@Services/useUserJoin';
import { useState, useRef, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function JoinInput({ act }) {

    const [joinIdValue, setJoinIdValue] = useState(''); //입력 ID값
    const [joinIdMessage, setJoinIdMessage] = useState(''); //아이디 정규표현식, 중복검사 메시지
    const idInputElement = useRef(); //아이디 인풋 태그

    const [joinPwValue, setJoinPwValue] = useState(''); //입력 PW값
    const [joinPwDoubleCheckValue, setJoinPwDoubleCheckValue] = useState(''); //재입력 PW값 
    const [joinPwMessage, setJoinPwMessage] = useState(''); //비밀번호 정규표현식 검사 메시지
    const showPwYn = useRef(false);
    const pwInputElement = useRef(); //비밀번호 인풋 태그
    const pwDoubleCheckInputElement = useRef(); //비밀번호 재입력 인풋 태그

    const [joinNameValue, setJoinNameValue] = useState(''); //입력 NAME 값
    const [joinNameMessage, setJoinNameMessage] = useState(''); //이름 정규표현식 검사 메시지

    const [joinEmailValue, setJoinEmailValue] = useState(''); //입력 EMAIL값
    const [joinEmailTailValue, setJoinEmailTailValue] = useState(''); //입력 Email Tail값
    const [joinEmailMessage, setJoinEmailMessage] = useState(''); //이메일 정규표현식 검사 메시지
    const [joinEmailAuthValue, setJoinEmailAuthValue] = useState(''); //입력 Email Auth값
    const emailInputElement = useRef(); //이메일 인풋 태그
    const emailTailInputElement = useRef(); //이메일 꼬리 인풋 태그
    const emailAuthInputWrapElement = useRef(); //이메일 인증번호 박스 태그
    const emailAuthInputElement = useRef(); //이메일 인증번호 인풋 태그

    const [joinAddressValue, setJoinAddressValue] = useState(''); //입력 ADDRESS 값

    const [checkYn, setCheckYn] = useState({});

    const joinValue = useRef({});

    //userServer idDuplicateCheck Fetching
    const userIdDuplicateCheckData = useQuery({ queryKey: ['userIdDuplicateCheckData'], queryFn: () => checkIdDuplicate(joinIdValue), enabled: false });

    //userServer idDuplicateCheck Fetching manage
    useEffect(() => {
        if (userIdDuplicateCheckData.isSuccess) {
            setJoinIdMessage("중복검사 성공!");
            setCheckYn({...checkYn, checkId : true});
            idInputElement.current.disabled = true;
        } else if (userIdDuplicateCheckData.isError){
            setJoinIdMessage("이미 있는 아이디입니다.");
            setCheckYn({...checkYn, checkId : false});
        }
    }, [userIdDuplicateCheckData.data]);

    //userServer sendEmail Fetching
    const userSendEmailData = useQuery({ queryKey: ['userSendEmailData'], queryFn: () => sendEmail(joinEmailValue, joinEmailTailValue), enabled: false });

    //userServer sendEmail Fetching manage
    useEffect(() => {
        if (userSendEmailData.isSuccess) {
            window.alert('이메일을 발송하였습니다.');
            emailInputElement.current.disabled = true;
            emailTailInputElement.current.disabled = true;
        } else if (userSendEmailData.isError) {
            window.alert('이메일 발송에 실패하였습니다.');
        }
    }, [userSendEmailData.data]);

    //userServer checkEmail Fetching
    const userCheckEmailData = useQuery({ queryKey: ['userCheckEmailData'], queryFn: () => checkEmail(joinEmailAuthValue), enabled: false });

    //userServer checkEmail Fetching manage
    useEffect(() => {
        if (userCheckEmailData.isSuccess) {
            window.alert('인증번호가 일치합니다.');
            setCheckYn({...checkYn, checkEmail : true});
            emailAuthInputElement.current.disabled = true;
        } else if (userCheckEmailData.isError) {
            window.alert('인증번호가 일치하지 않습니다.');
            setCheckYn({...checkYn, checkEmail : false});
        }
    }, [userCheckEmailData.data]);

    //userServer join Fetching
    const userJoinData = useQuery({ queryKey: ['userJoinData'], queryFn: () => putUserAuthData(joinIdValue, joinPwValue, joinNameValue, joinEmailValue, joinEmailTailValue, joinAddressValue), enabled: false });

    //userServer join Fetching manage
    useEffect(() => {
        if (userJoinData.isSuccess) {
            window.alert('회원가입을 성공하였습니다.');
            act({ state: 'login' });
        } else if (userJoinData.isError) {
            window.alert('회원가입에 실패하였습니다.');
        }
    }, [userJoinData.data]);

    //로그인 선택 시 로그인 페이지로 이동
    function loginPageBtn() {
        act({ state: 'login' });
    }

    //아이디 정규표현식 검사 및 중복검사
    function idCheck() {
        var regex = /^[a-z]+[a-z0-9]{4,19}$/g;
        if (regex.test(joinIdValue)) {
            userIdDuplicateCheckData.refetch();
        } else {
            setJoinIdMessage("아이디는 영문자 또는 숫자 6~20자 입니다.");
            checkYn.current.checkId = false;
        }
    }

    //비밀번호 정규표현식 검사
    function pwCheck(inputValue) {
        var regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
        if (regex.test(inputValue)) {
            setJoinPwMessage('안전한 비밀번호입니다.');
            setCheckYn({...checkYn, checkPw : true});
        } else {
            setJoinPwMessage('8 ~ 16자 영문, 숫자, 특수문자를 포함해야합니다.');
            setCheckYn({...checkYn, checkPw : false});
        }
    }

    //비밀번호 재입력 일치여부 검사
    function pwDoubleCheck(inputValue) {
        if (joinPwValue === inputValue && checkYn.checkPw) {
            setJoinPwMessage('비밀번호가 일치합니다.');
            pwInputElement.current.disabled = true;
            pwDoubleCheckInputElement.current.disabled = true;
            setCheckYn({...checkYn, doubleCheckPw : true});
        } else if (joinPwValue === inputValue && !checkYn.checkPw) {
            setJoinPwMessage('8 ~ 16자 영문, 숫자, 특수문자를 포함해야합니다.');
            setCheckYn({...checkYn, doubleCheckPw : false});
        } else if (joinPwValue !== inputValue) {
            setJoinPwMessage('비밀번호가 일치하지 않습니다.');
            setCheckYn({...checkYn, doubleCheckPw : false});
        } else {
            setJoinPwMessage('사용할 수 없는 비밀번호입니다.');
            setCheckYn({...checkYn, doubleCheckPw : false});
        }
    }

    //비밀번호 일시 표시
    function togglePasswordVisibility() {
        showPwYn.current = !showPwYn.current;
    };

    //이름 정규표현식 검사
    function nameCheck(inputValue) {
        var regex = /^(?=.{3,10}$)[A-Za-z가-힣]+$/;
        if(regex.test(inputValue)) {  
            setCheckYn({...checkYn, checkName : true});
            setJoinNameMessage('');
        } else {
            setCheckYn({...checkYn, checkName : false});
            setJoinNameMessage('이름은 한글 혹은 영문 10글자 이내입니다.');
        }
    }

    //이메일 발송
    function emailSend() {
        if(joinEmailValue !== '' && joinEmailTailValue !== '') {
            userSendEmailData.refetch();
            emailAuthInputWrapElement.current.style.display = 'flex';
        } else {
            window.alert('이메일을 입력해주세요!');
        }
    }

    //이메일 인증번호 검사
    function emailCheck() {
        if(joinEmailAuthValue !== '') {
            userCheckEmailData.refetch();
        } else {
            window.alert('인증 번호를 입력해주세요!');
        }
    }

    //회원가입 버튼 활성화/비활성화
    useEffect(() => {
        if (checkYn.checkId && checkYn.checkPw && checkYn.checkName && checkYn.doubleCheckPw && checkYn.checkEmail) {
            checkYn.checkTotal = true;
        } else {
            checkYn.checkTotal = false;
        }
    }, [checkYn]);
    
    //회원가입
    function joinBtn() {
        if (checkYn.checkTotal) {
            userJoinData.refetch();
        }
    }

    return (
        <div>
            <div className="login-page-btn-box">
                <button className="login-page-btn" onClick={loginPageBtn}>로그인페이지로</button>
            </div>
            <div className="join-input-box">
                <div className='join-input-id-wrap'>
                    <input type='text' className="join-id" id="join-id" ref={idInputElement} value={joinIdValue} onChange={(e) => { setJoinIdValue(e.target.value) }} placeholder="아이디를 입력하세요" />
                    <button className='id-check' onClick={idCheck}>중복검사</button>
                </div>
                <p className='join-id-message' style={{color : joinIdMessage === '중복검사 성공!' ? 'green' : 'red'}} >{joinIdMessage}</p>

                <div className='join-input-pw-wrap'>
                    <input type={showPwYn.current ? 'text' : 'password'} ref={pwInputElement} className="join-pw" id="join-pw" value={joinPwValue} onChange={(e) => { setJoinPwValue(e.target.value); pwCheck(e.target.value); }} placeholder="비밀번호를 입력하세요" />
                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>{showPwYn.current ? <FaEyeSlash /> : <FaEye />}</span>
                </div>

                <div className='join-input-double-check-pw-wrap'>
                    <input type='password' className="join-pw-double-check" id="join-pw-double-check" ref={pwDoubleCheckInputElement} value={joinPwDoubleCheckValue} onChange={(e) => { setJoinPwDoubleCheckValue(e.target.value); pwDoubleCheck(e.target.value); }} placeholder="비밀번호를 재입력하세요" />
                </div>
                <p className='join-pw-message' style={{color : joinPwMessage === '안전한 비밀번호입니다.' || joinPwMessage === '비밀번호가 일치합니다.' ? 'green' : 'red'}}>{joinPwMessage}</p>

                <div className='join-input-name-wrap'>
                    <input type='text' className="join-name" id="join-name" value={joinNameValue} onChange={(e) => { setJoinNameValue(e.target.value); nameCheck(e.target.value); }} placeholder="이름을 입력하세요" />
                </div>
                <p className='join-name-message'>{joinNameMessage}</p>

                <div className='join-input-email-wrap'>
                    <input type='text' className="join-email" id="join-email" ref={emailInputElement} value={joinEmailValue} onChange={(e) => { setJoinEmailValue(e.target.value) }} placeholder="이메일을 입력하세요" />
                    <span>@</span>
                    <select className='join-email-tail' id='join-email-tail' ref={emailTailInputElement} value={joinEmailTailValue} onChange={(e) => { setJoinEmailTailValue(e.target.value) }}>
                        <option>선택</option>
                        <option>naver.com</option>
                        <option>gmail.com</option>
                        <option>daum.net</option>
                        <option>hanmail.net</option>
                        <option>yahoo.co.kr</option>
                    </select>
                    <button className='email-check' onClick={emailSend}>전송</button>
                </div>
                <p className='join-email-send-message'></p>

                <div className='join-input-auth-wrap' style={{display : 'none'}} ref={emailAuthInputWrapElement}>
                    <input type='text' className='email-auth-value' id='email-auth-value' ref={emailAuthInputElement} value={joinEmailAuthValue} onChange={(e) => { setJoinEmailAuthValue(e.target.value) }} placeholder='인증번호를 입력하세요' />
                    <button className='email-auth-btn' id='email-auth-btn' onClick={emailCheck}>본인인증</button>
                </div>
                <p className='join-email-message'>{joinEmailMessage}</p>

                <div className='join-input-address-wrap'>
                    <input type='text' className='join-address' id='join-address' value={joinAddressValue} onChange={(e) => { setJoinAddressValue(e.target.value) }} placeholder='주소를 입력하세요' />
                </div>
            </div>

            <div className="join-btn-box">
                <button className="join-btn" style={{
                    backgroundColor: checkYn.checkTotal ? '#45a049' : '#a5d6a7',
                    cursor: checkYn.checkTotal ? 'pointer' : 'not-allowed',
                }}
                    disabled={!checkYn.checkTotal} onClick={joinBtn}>회원가입</button>
            </div>
        </div>
    );
}
