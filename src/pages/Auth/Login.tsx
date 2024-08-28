import { useNavigate } from "react-router-dom";
import naver from "./image/naver.png";
function Login() {
  let navigate = useNavigate();

  const NaverLogin = () => {
    window.location.href =
      process.env.REACT_APP_BASE_URL + "/oauth2/authorization/naver";
  };

  return (
    <div className="login">
      <div className="login-banner">
        <p className="login-talk">
          로그인하고 <br></br>여행을 계속해요
        </p>
      </div>
      <div className="login-how">
        <button className="login-naver">
          <div className="login-naver-img">
            <img src={naver} alt="네이버" className="login-naver-img" />
          </div>
          <p className="login-naver-font" onClick={NaverLogin}>
            네이버 간편 로그인
          </p>
          <div className="login-balance"></div>
        </button>
        <button
          className="login-normal"
          onClick={() => {
            navigate("/login/normal");
          }}
        >
          <div className="login-normal0img">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.012 12.8247C12.3565 12.8247 12.6609 12.6653 13.0214 12.3068L20.0067 5.41434C19.6943 5.13546 19.1415 5 18.3645 5H5.44326C4.75434 5 4.26569 5.12749 3.98531 5.38247L11.0027 12.3068C11.3551 12.6653 11.6676 12.8247 12.012 12.8247ZM3.21629 17.6454L8.97597 11.9721L3.2243 6.32271C3.08011 6.57769 3 7 3 7.59761V16.4024C3 16.9841 3.0721 17.3984 3.21629 17.6454ZM20.7917 17.6375C20.9279 17.3904 21 16.9761 21 16.4024V7.59761C21 7.01594 20.9199 6.59363 20.7757 6.34661L15.0481 11.9721L20.7917 17.6375ZM5.63551 19H18.5567C19.2617 19 19.7583 18.8645 20.0467 18.6016L14.1829 12.8088L13.6862 13.2948C13.1335 13.8287 12.6048 14.0837 12.012 14.0837C11.4192 14.0837 10.8825 13.8287 10.3298 13.2948L9.83311 12.8088L3.9773 18.5857C4.29773 18.8566 4.85848 19 5.63551 19Z"
                fill="#252525"
              ></path>
            </svg>
          </div>
          <p className="login-normal-font">이메일 로그인</p>
          <div className="login-balance"></div>
        </button>
      </div>
      <div className="login-join">
        <p className="login-join-font">
          아직 계정이 없으신가요?
          <span
            className="login-join-join"
            onClick={() => {
              navigate("/join");
            }}
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
