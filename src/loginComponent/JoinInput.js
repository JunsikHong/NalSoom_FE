import 'style/Join.css';
import * as server from 'axiosConfig';
import { useState, useRef, useEffect } from 'react';

export default function JoinInput({ act }) {

    ////////////////////////////////////////////////////////////////////////////////////////
    const [joinIdValue, setJoinIdValue] = useState(''); //입력 ID값
    const [joinIdYnValue, setJoinIdYnValue] = useState(false); //입력 ID 검사 통과 여부
    const joinIdMessage = useRef(""); //아이디 정규표현식, 중복검사 메시지

    const [joinPwValue, setJoinPwValue] = useState(''); //입력 PW값
    const [joinPwYnValue, setJoinPwYnValue] = useState(false); //입력 Pw 검사 통과 여부
    const joinPwMessage = useRef(""); //비밀번호 정규표현식 검사

    const [joinEmailValue, setJoinEmailValue] = useState(''); //입력 EMAIL값
    const [joinEmailTailValue, setJoinEmailTailValue] = useState(''); //입력 Email Tail값
    const [joinEmailAuthValue, setJoinEmailAuthValue] = useState(''); //입력 Email Auth값
    const [joinEmailYnValue, setJoinEmailYnValue] = useState(false); //입력 EMAIL 검사 통과 여부
    const joinEmailMessage = useRef(""); //이메일 정규표현식 검사

    const [joinBtnYnValue, setJoinBtnYnValue] = useState(true); //회원가입 버튼 활성화/비활성화 값
    ////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if(pwCheck !== null && pwCheck !== '') pwCheck();
    },[joinPwValue]);

    //로그인 선택 시 로그인 페이지로 이동
    function loginPageBtn() {
        act({ state: 'login' });
    }

    //아이디 정규표현식 검사 및 중복검사
    function idCheck() {
        var regex = /^[a-z]+[a-z0-9]{4,19}$/g;
        if (regex.test(joinIdValue)) {
            server.userServer.post("/user/idDuplicateCheck", {
                userId: joinIdValue
            }).then(response => {
                if (response.data) {
                    joinIdMessage.current = "중복검사 성공!";
                    setJoinIdYnValue(true);
                } else {
                    joinIdMessage.current = "이미 있는 아이디입니다.";
                    setJoinIdYnValue(false);
                }
            });
        } else {
            joinIdMessage.current = "아이디는 영문자 또는 숫자 6~20자 입니다.";
            setJoinIdYnValue(false);
        }
        joinBtnYn();
    }

    //비밀번호 정규표현식 검사
    function pwCheck() {
        var regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
        if (regex.test(joinPwValue)) {
            joinPwMessage.current = "안전한 비밀번호입니다.";
            setJoinPwYnValue(true);
        } else {
            joinPwMessage.current = "8 ~ 16자 영문, 숫자, 특수문자를 포함해야합니다.";
            setJoinPwYnValue(false);
        }
        joinBtnYn();
    }

    //이메일 발송
    function emailCheck() {
        server.userServer.post("/user/emailCheck", {
            email : joinEmailValue + '@' + joinEmailTailValue
        }).then(response => {
            if(response.data) {
                window.alert('이메일을 발송하였습니다.');
            } else {
                window.alert('이메일 발송에 실패하였습니다.');
            }
        });
        joinBtnYn();
    }

    //이메일 인증번호 검사
    function emailAuth() {
        setJoinEmailYnValue(true);
        joinBtnYn();
    }

    //회원가입 버튼 활성화/비활성화
    function joinBtnYn() {
        if (joinIdYnValue && joinPwYnValue && joinEmailYnValue) {
            setJoinBtnYnValue(false);
        } else {
            setJoinBtnYnValue(true);
        }
    }

    //회원가입 선택 시 회원가입
    function joinBtn() {
        if (!joinBtnYnValue) {
            server.userServer.post("/user/join", {
                userId: joinIdValue,
                userPw: joinPwValue,
                email: joinEmailValue + '@' + joinEmailTailValue
            }).then(response => {
                if(response.data) {
                    window.alert('회원가입을 성공하였습니다.');
                    act({ state: 'login' });
                } else {
                    window.alert('회원가입에 실패하였습니다.');
                }
            })
        }
    }

    return (
        <div>
            <div className="login-page-btn-box">
                <button className="login-page-btn" onClick={loginPageBtn}>로그인</button>
            </div>
            <div className="join-input-box">
                <input type='text' className="join-id" id="join-id" value={joinIdValue} onChange={(e) => {setJoinIdValue(e.target.value)}} placeholder="아이디를 입력하세요" />
                <button className='id-check' onClick={idCheck}>중복검사</button>
                <p className='join-id-message'>{joinIdMessage.current}</p>
                
                <input type='password' className="join-pw" id="join-pw" value={joinPwValue} onChange={(e) => {setJoinPwValue(e.target.value)}} placeholder="비밀번호를 입력하세요" />
                <p className='join-pw-message'>{joinPwMessage.current}</p>

                <input type='text' className="join-email" id="join-email" value={joinEmailValue} onChange={(e) => {setJoinEmailValue(e.target.value)}} placeholder="이메일을 입력하세요" />
                <span>@</span>
                <select className='join-email-tail' id='join-email-tail' value={joinEmailTailValue} onChange={(e) => {setJoinEmailTailValue(e.target.value)}}>
                    <option>선택</option>
                    <option>naver.com</option>
                    <option>gmail.com</option>
                    <option>daum.net</option>
                    <option>hanmail.net</option>
                    <option>yahoo.co.kr</option>
                </select>
                <button className='email-check' onClick={emailCheck}>이메일발송</button>
                
                <input type='text' className='email-auth-value' id='email-auth-value' value={joinEmailAuthValue} onChange={(e) => {setJoinEmailAuthValue(e.target.value)}} placeholder='인증번호를 입력하세요'/>
                <button className='email-auth-btn' id='email-auth-btn' onClick={emailAuth}>본인인증</button>
                <p className='join-email-message'>{joinEmailMessage.current}</p>
            </div>
            <div className="join-btn-box">
                <button className="join-btn" disabled={joinBtnYnValue} onClick={joinBtn}>회원가입</button>
            </div>
        </div>
    );
}