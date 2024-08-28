//css
import '@Style/LoginInput.css'

//lib
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserAuthData } from '@Services/useUserLogin';
import { getUserKakaoAuthData } from '@Services/useKakaoUserLogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LoginInput({ act }) {

    const navigate = useNavigate();
    const [loginIdValue, setLoginIdValue] = useState(''); //입력 ID값
    const [loginPwValue, setLoginPwValue] = useState(''); //입력 PW값
    const [showPassword, setShowPassword] = useState(false); //비밀번호 일시 표시

    const [doLogin, setDoLogin] = useState(false); //로그인 버튼
    const [doKakaoLogin, setDoKakaoLogin] = useState(false); //카카오 로그인 버튼

    //userServer Fetching
    const userAuthData = useQuery({ queryKey: ['userAuthData'], queryFn: () => getUserAuthData(loginIdValue, loginPwValue), enabled: doLogin });

    //userServer Fetching manage
    useEffect(() => {
        if (userAuthData.data && userAuthData.data.accessToken) {
            localStorage.setItem('grantType', userAuthData.data.grantType);
            localStorage.setItem('accessToken', userAuthData.data.accessToken);
            localStorage.setItem('refreshToken', userAuthData.data.refreshToken);
            setDoLogin(false);
            navigate('/');
          } else if (userAuthData.isFetched && (!userAuthData.data || !userAuthData.data.accessToken)) {
            window.alert('아이디 혹은 패스워드가 일치하지 않습니다.');
            setDoLogin(false);
          }
    }, [userAuthData.data, userAuthData.isFetched]);

    //kakaoServer Fetching
    const userKakaoAuthData = useQuery({ queryKey: ['userKakaoAuthData'], queryFn: () => getUserKakaoAuthData(loginIdValue, loginPwValue), enabled: doKakaoLogin });

    //kakaoServer Fetching manage
    useEffect(() => {
    }, [userKakaoAuthData.data]);

    //비밀번호 일시 표시
    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    };

    //로그인
    function loginBtn() {
        setDoLogin(true);
    }

    //카카오로그인
    function apiLoginBtn() {
        setDoKakaoLogin(true);
    }

    //회원가입 선택 시 회원가입 페이지로 이동
    function joinPageBtn() {
        act({ state: 'join' });
    }

    return (
        <div>
            <div className='id-input-box'>
                <input type='text' placeholder='ID' id="id" className='id' value={loginIdValue} onChange={(e) => { setLoginIdValue(e.target.value) }} />
            </div>
            <div className='pw-input-box'>
                <input type={showPassword ? 'text' : 'password'} placeholder='PW' id="pw" className='pw' value={loginPwValue} onChange={(e) => { setLoginPwValue(e.target.value) }} />
                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
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