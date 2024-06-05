import 'style/Login.css';
import { useReducer } from 'react';
import LoginInput from 'loginComponent/LoginInput';
import JoinInput from 'loginComponent/JoinInput';

const loginStateFunc = (state, action) => {
    state = {
        state: action.state
    }
    return state;
}

export default function Login() {

    const [loginState, act] = useReducer(loginStateFunc, {
        state: 'login'
    }); //로그인 / 회원가입 상태 체크

    return (
        <div>
            <div className="login-join-wrap">
                {loginState.state === 'login' && <LoginInput act={act} />}
                {loginState.state === 'join' && <JoinInput act={act} />}
            </div>
        </div>
    );
}