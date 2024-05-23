export default function LoginInput({ act }) {

    //카카오 로그인 선택 시 api-login 실행
    function apiLoginBtn() {
    }

    //회원가입 선택 시 회원가입 페이지로 이동
    function joinPageBtn() {
        act({ state: 'join' });
    }

    return (
        <div>
            <div className='id-pw-input-box'>
                <input type='text' placeholder='ID' id="id" className='id' />
                <input type='password' placeholder='PW' id="pw" className='pw' />
            </div>
            <div className="login">
                <button className='login-btn'>로그인</button>
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