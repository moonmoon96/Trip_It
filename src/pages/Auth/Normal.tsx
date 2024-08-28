import { useNavigate } from "react-router-dom";
import Find from "./Find";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getCookie, removeCookie, setCookie } from "../../Utility/Cookie";
import Try from "./TryNormal";

function Normal() {
  const [find, setFind] = useState("");
  const [keepClicked, setKeepClicked] = useState(0);
  const [LoginInput, setLoginInput] = useState({
    loginEmail: "",
    loginEmailValid: false,
    loginPw: "",
    loginPwValid: false,
  });

  const [val, setVal] = useState("");

  let navigate = useNavigate();

  async function doLogin() {
    await axios
      .post(
        process.env.REACT_APP_BASE_URL + "/login",
        {
          email: LoginInput.loginEmail,
          password: LoginInput.loginPw,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        let access = response.data.access;
        let refresh = response.data.refresh;
        let role = response.data.role;
        localStorage.setItem("access", access);
        localStorage.setItem("role", role);
        setCookie("refresh", refresh);
        navigate("/");
      })
      .catch(function (err) {
        const msg = err.response.data;
        if (msg) {
          setVal("에러");
        }
        console.log("에러" + msg);
      });
  }

  const LoginSubmit = LoginInput.loginEmailValid && LoginInput.loginPwValid;

  useEffect(() => {
    const emailRegex = /.+/;
    setLoginInput((prev) => ({
      ...prev,
      loginEmailValid: emailRegex.test(LoginInput.loginEmail),
    }));
  }, [LoginInput.loginEmail]);

  useEffect(() => {
    const pwRegex = /.+/;
    setLoginInput((prev) => ({
      ...prev,
      loginPwValid: pwRegex.test(LoginInput.loginPw),
    }));
  }, [LoginInput.loginPw]);

  return (
    <>
      <div className="normal">
        <p className="normal-login">로그인</p>
        <div className="normal-login-input">
          <input
            value={LoginInput.loginEmail}
            className="normal-login-email"
            type="text"
            placeholder="이메일 주소"
            maxLength={40}
            onChange={(e) =>
              setLoginInput({ ...LoginInput, loginEmail: e.target.value })
            }
          ></input>
          <div className="normal-login-balance">
            <input
              value={LoginInput.loginPw}
              className="normal-login-pw"
              type="password"
              placeholder="비밀번호"
              maxLength={40}
              onChange={(e) =>
                setLoginInput({ ...LoginInput, loginPw: e.target.value })
              }
            ></input>
          </div>
        </div>
        <div className="normal-login-keep">
          <button
            className={"keep-button" + (keepClicked === 1 ? "able" : "")}
            onClick={() => {
              keepClicked === 0 ? setKeepClicked(1) : setKeepClicked(0);
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 6.65217L5.58333 11L12 1"
                stroke="#fff"
                stroke-width="1.5"
              ></path>
            </svg>
          </button>
          <p
            className="normal-login-font"
            onClick={() => {
              keepClicked === 0 ? setKeepClicked(1) : setKeepClicked(0);
            }}
          >
            이메일 저장
          </p>
        </div>
        <button
          className={
            "normal-login-button" + (LoginSubmit == true ? "active" : "")
          }
          type="submit"
          disabled={!LoginSubmit}
          onClick={doLogin}
        >
          로그인
        </button>
        <div className="normal-login-find">
          <div className="normal-login-find-left">
            <p
              className="normal-login-find-font"
              onClick={() => {
                setFind("이메일 찾기");
              }}
            >
              이메일 찾기
            </p>
            <p
              className="normal-login-find-font"
              onClick={() => {
                setFind("비밀번호 찾기");
              }}
            >
              비밀번호 찾기
            </p>
          </div>
          <p
            className="normal-login-find-font"
            onClick={() => {
              navigate("/join");
            }}
          >
            회원가입
          </p>
        </div>
      </div>
      {find == "이메일 찾기" ? (
        <Find find={find} setFind={setFind}></Find>
      ) : find == "비밀번호 찾기" ? (
        <Find find={find} setFind={setFind}></Find>
      ) : null}
      {val == "에러" ? <Try val={val} setValid={setVal}></Try> : null}
    </>
  );
}

export default Normal;
