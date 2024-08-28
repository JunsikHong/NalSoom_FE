//css
import '@Style/JoinInput.css';

//lib
import { useQuery } from '@tanstack/react-query';
import { checkIdDuplicate, sendEmail, checkEmail, putUserAuthData } from '@Services/useUserJoin';
import { useState, useRef, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function JoinInput({ act }) {

    const [joinIdValue, setJoinIdValue] = useState(''); //입력 ID값
    const [joinIdYnValue, setJoinIdYnValue] = useState(false); //입력 ID 검사 통과 여부
    const [doDuplicateCheck, setDoDuplicateCheck] = useState(false); //ID 중복검사 Fetching
    const [joinIdMessage, setJoinIdMessage] = useState(''); //아이디 정규표현식, 중복검사 메시지

    const [joinPwValue, setJoinPwValue] = useState(''); //입력 PW값
    const [showPassword, setShowPassword] = useState(false); //비밀번호 일시 표시
    const [joinPwYnValue, setJoinPwYnValue] = useState(false); //입력 PW 검사 통과 여부

    const [joinPwDoubleCheckValue, setJoinPwDoubleCheckValue] = useState(''); //재입력 PW값 
    const [joinDoubleCheckPwYnValue, setJoinDoubleCheckPwYnValue] = useState(false); //재입력 PW 일치여부 검사 통과 여부
    const joinPwMessage = useRef(""); //비밀번호 정규표현식 검사

    const [joinEmailValue, setJoinEmailValue] = useState(''); //입력 EMAIL값
    const [joinEmailTailValue, setJoinEmailTailValue] = useState(''); //입력 Email Tail값
    const [doSendEmail, setDoSendEmail] = useState(false); //Email 전송 Fetching
    const joinEmailMessage = useRef(""); //이메일 정규표현식 검사

    const [joinEmailAuthValue, setJoinEmailAuthValue] = useState(''); //입력 Email Auth값
    const [joinEmailYnValue, setJoinEmailYnValue] = useState(false); //입력 EMAIL 검사 통과 여부
    const [doCheckEmail, setDoCheckEmail] = useState(false); //Email Auth 값 전송 Fetching

    const [joinBtnYnValue, setJoinBtnYnValue] = useState(true); //회원가입 버튼 활성화/비활성화 값
    const [doJoin, setDoJoin] = useState(false); //Join Fetching

    //userServer idDuplicateCheck Fetching
    const userIdDuplicateCheckData = useQuery({ queryKey: ['userIdDuplicateCheckData'], queryFn: () => checkIdDuplicate(joinIdValue), enabled: doDuplicateCheck });

    //userServer idDuplicateCheck Fetching manage
    useEffect(() => {
        if (userIdDuplicateCheckData.data === true) {
            setJoinIdMessage("중복검사 성공!");
            setJoinIdYnValue(true);
            setDoDuplicateCheck(false);
        } else if (userIdDuplicateCheckData.data === false) {
            setJoinIdMessage("이미 있는 아이디입니다.");
            setJoinIdYnValue(false);
            setDoDuplicateCheck(false);
        }
    }, [userIdDuplicateCheckData.data]);

    //userServer sendEmail Fetching
    const userSendEmailData = useQuery({ queryKey: ['userSendEmailData'], queryFn: () => sendEmail(joinEmailValue, joinEmailTailValue), enabled: doSendEmail });

    //userServer sendEmail Fetching manage
    useEffect(() => {
        if (userSendEmailData.data === true) {
            window.alert('이메일을 발송하였습니다.');
            setDoSendEmail(false);
        } else if (userSendEmailData.data === false) {
            window.alert('이메일 발송에 실패하였습니다.');
            setDoSendEmail(false);
        }
    }, [userSendEmailData.data]);

    //userServer checkEmail Fetching
    const userCheckEmailData = useQuery({ queryKey: ['userCheckEmailData'], queryFn: () => checkEmail(joinEmailAuthValue), enabled: doCheckEmail });

    //userServer checkEmail Fetching manage
    useEffect(() => {
        if (userCheckEmailData.data === true) {
            window.alert('인증번호가 일치합니다.');
            setJoinEmailYnValue(true);
            setDoCheckEmail(false);
        } else if (userCheckEmailData.data === false) {
            window.alert('인증번호가 일치하지 않습니다.');
            setDoCheckEmail(false);
        }
    }, [userCheckEmailData.data]);

    //userServer join Fetching
    const userJoinData = useQuery({ queryKey: ['userJoinData'], queryFn: () => putUserAuthData(joinIdValue, joinPwValue, joinEmailValue, joinEmailTailValue), enabled: doJoin });

    //userServer join Fetching manage
    useEffect(() => {
        if (userJoinData.data === true) {
            setDoJoin(false);
            window.alert('회원가입을 성공하였습니다.');
            act({ state: 'login' });
        } else if (userJoinData.data === false) {
            window.alert('회원가입에 실패하였습니다.');
            setDoJoin(false);
        }
    }, [userJoinData]);

    //로그인 선택 시 로그인 페이지로 이동
    function loginPageBtn() {
        act({ state: 'login' });
    }

    //아이디 정규표현식 검사 및 중복검사
    function idCheck() {
        var regex = /^[a-z]+[a-z0-9]{4,19}$/g;
        if (regex.test(joinIdValue)) {
            setDoDuplicateCheck(true);
        } else {
            setJoinIdMessage("아이디는 영문자 또는 숫자 6~20자 입니다.");
            setJoinIdYnValue(false);
            setDoDuplicateCheck(false);
        }
    }

    //비밀번호 정규표현식 검사
    function pwCheck(inputValue) {
        var regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
        if (regex.test(inputValue)) {
            joinPwMessage.current = "안전한 비밀번호입니다.";
            setJoinPwYnValue(true);
        } else {
            joinPwMessage.current = "8 ~ 16자 영문, 숫자, 특수문자를 포함해야합니다.";
            setJoinPwYnValue(false);
        }
    }

    //비밀번호 재입력 일치여부 검사
    function pwDoubleCheck(inputValue) {
        if (joinPwValue === inputValue && joinPwYnValue === true) {
            joinPwMessage.current = "비밀번호가 일치합니다.";
            setJoinDoubleCheckPwYnValue(true);
        } else if (joinPwValue === inputValue && joinPwYnValue === false) {
            joinPwMessage.current = "8 ~ 16자 영문, 숫자, 특수문자를 포함해야합니다.";
            setJoinDoubleCheckPwYnValue(false);
        } else if (joinPwValue !== inputValue) {
            joinPwMessage.current = "비밀번호가 일치하지 않습니다.";
            setJoinDoubleCheckPwYnValue(false);
        } else {
            joinPwMessage.current = "사용할 수 없는 비밀번호입니다.";
            setJoinDoubleCheckPwYnValue(false);
        }
    }

    //비밀번호 일시 표시
    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    };

    //이메일 발송
    function emailSend() {
        setDoSendEmail(true);
    }

    //이메일 인증번호 검사
    function emailCheck() {
        setDoCheckEmail(true);
    }
    
    //회원가입 버튼 활성화/비활성화
    useEffect(() => {
        if (joinIdYnValue && joinPwYnValue && joinDoubleCheckPwYnValue && joinEmailYnValue) {
            setJoinBtnYnValue(false);
        } else {
            setJoinBtnYnValue(true);
        }
    }, [joinIdYnValue, joinPwYnValue, joinDoubleCheckPwYnValue, joinEmailYnValue])

    //회원가입
    function joinBtn() {
        if (!joinBtnYnValue) setDoJoin(true);
    }

    return (
        <div>
            <div className="login-page-btn-box">
                <button className="login-page-btn" onClick={loginPageBtn}>로그인페이지로</button>
            </div>
            <div className="join-input-box">
                <div className='join-input-id-wrap'>
                    <input type='text' className="join-id" id="join-id" value={joinIdValue} onChange={(e) => { setJoinIdValue(e.target.value) }} placeholder="아이디를 입력하세요" />
                    <button className='id-check' onClick={idCheck}>중복검사</button>
                </div>
                <p className='join-id-message'>{joinIdMessage}</p>

                <div className='join-input-pw-wrap'>
                    <input type={showPassword ? 'text' : 'password'} className="join-pw" id="join-pw" value={joinPwValue} onChange={(e) => { setJoinPwValue(e.target.value); pwCheck(e.target.value); }} placeholder="비밀번호를 입력하세요" />
                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>

                <div className='join-input-double-check-pw-wrap'>
                    <input type='password' className="join-pw-double-check" id="join-pw-double-check" value={joinPwDoubleCheckValue} onChange={(e) => { setJoinPwDoubleCheckValue(e.target.value); pwDoubleCheck(e.target.value); }} placeholder="비밀번호를 재입력하세요" />
                </div>
                <p className='join-pw-message'>{joinPwMessage.current}</p>

                <div className='join-input-email-wrap'>
                    <input type='text' className="join-email" id="join-email" value={joinEmailValue} onChange={(e) => { setJoinEmailValue(e.target.value) }} placeholder="이메일을 입력하세요" />
                    <span>@</span>
                    <select className='join-email-tail' id='join-email-tail' value={joinEmailTailValue} onChange={(e) => { setJoinEmailTailValue(e.target.value) }}>
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

                <div className='join-input-auth-wrap'>
                    <input type='text' className='email-auth-value' id='email-auth-value' value={joinEmailAuthValue} onChange={(e) => { setJoinEmailAuthValue(e.target.value) }} placeholder='인증번호를 입력하세요' />
                    <button className='email-auth-btn' id='email-auth-btn' onClick={emailCheck}>본인인증</button>
                </div>
                <p className='join-email-message'>{joinEmailMessage.current}</p>
            </div>

            <div className="join-btn-box">
                <button className="join-btn" style={{
                    backgroundColor: joinBtnYnValue ? '#a5d6a7' : '#45a049',
                    cursor: joinBtnYnValue ? 'not-allowed' : 'pointer',
                }}
                    disabled={joinBtnYnValue} onClick={joinBtn}>회원가입</button>
            </div>
        </div>
    );
}
