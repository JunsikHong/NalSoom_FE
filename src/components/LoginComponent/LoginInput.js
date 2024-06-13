//css
import '@Style/LoginInput.css'

//lib
import { userServer } from '@/axiosConfig';
import { useState } from 'react';

export default function LoginInput({ act }) {

    const [loginIdValue, setLoginIdValue] = useState(''); //입력 ID값
    const [loginPwValue, setLoginPwValue] = useState(''); //입력 ID값

    //카카오 로그인 선택 시 api-login 실행
    function apiLoginBtn() {
    }

    //로그인 선택 시 jwt-login 실행
    function loginBtn() {
        userServer.post('/user/login', {
            userId: loginIdValue,
            userPw: loginPwValue
        }).then(response => {
            localStorage.setItem('grantType', response.data.grantType);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        });
    }

    //회원가입 선택 시 회원가입 페이지로 이동
    function joinPageBtn() {
        act({ state: 'join' });
    }

    return (
        <div>
            <div className='id-pw-input-box'>
                <input type='text' placeholder='ID' id="id" className='id' value={loginIdValue} onChange={(e) => { setLoginIdValue(e.target.value) }} />
                <input type='password' placeholder='PW' id="pw" className='pw' value={loginPwValue} onChange={(e) => { setLoginPwValue(e.target.value) }} />
            </div>
            <div className="login">
                <button className='login-btn' onClick={loginBtn}>로그인</button>
            </div>
            <div className='api-login'>
                <button className='api-login-btn' onClick={apiLoginBtn}>카카오 로그인</button>
            </div>
            <div className='join-page'>
                <button className='join-page-btn' onClick={joinPageBtn}>회원가입</button>
            </div>
        </div>
    );
}