import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "../Utility/Cookie";
import Write from "../pages/Community/Write";
import axios from "axios";
import Alert from "./Alert";

function Header() {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  async function comList() {
    await axios
      .post(
        baseUrl + "/communityList",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setuserId(response.data.userId);
        setNickname(response.data.nickname);
        setGender(response.data.gender);
        setBirth(response.data.birth);
        setStartDate(response.data.startDate);
        setEndDate(response.data.endDate);
        setMetroId(response.data.metroId);
        setPostId(response.data.postId);
        setPostTitle(response.data.postTitle);
        setPostContent(response.data.postContent);
        setPersonnel(response.data.personnel);
        setPostPic(response.data.postPic);
        setExposureStatus(response.data.exposureStatus);
        setViewCount(response.data.viewCount);
        console.log(userId);
      })
      .catch((err) => {
        console.log("err " + err);
      });
  }

  const [userId, setuserId] = useState();
  const [nickname, setNickname] = useState();
  const [gender, setGender] = useState();
  const [birth, setBirth] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [metroId, setMetroId] = useState();
  const [postId, setPostId] = useState();
  const [postTitle, setPostTitle] = useState();
  const [postContent, setPostContent] = useState();
  const [personnel, setPersonnel] = useState();
  const [postPic, setPostPic] = useState();
  const [exposureStatus, setExposureStatus] = useState();
  const [viewCount, setViewCount] = useState();

  const [clicked, setClicked] = useState(3);
  const [write, setWrite] = useState(0);

  let navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/login");
    window.scrollTo(0, 0);
  };

  const handleRole = () => {
    let role = localStorage.getItem('role');

    if(role == 'ROLE_USER'){
      handleShowAlert();
    }else{
      alert('안되유~');
    }
  }

  return (
    <>
      <div className="head">
        <div className="header">
          <div className="header-nav">
            <div className="header-nav-left">
              <button
                className={
                  "header-left-button" + (clicked == 0 ? "active" : "")
                }
                onClick={() => {
                  setClicked(0);
                  navigate("/community");
                }}
              >
                홈
              </button>
              <button
                className={
                  "header-left-button" + (clicked == 1 ? "active" : "")
                }
                onClick={() => {
                  setClicked(1);
                  navigate("/planner");
                }}
              >
                플래너
              </button>
            </div>
            {localStorage.key(0) != null ? (
              <div className="header-nav-right">
                <div className="header-nav-right-login">
                  {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                    <button
                      className="header-right-button"
                      onClick={() => {
                        setClicked(() => {
                          return 5;
                        });
                        navigate("/admin");
                      }}
                    >
                      관리자페이지
                    </button>
                  ) : (
                    <button
                      className="header-right-button"
                      onClick={() => {
                        setClicked(() => {
                          return 5;
                        });
                        navigate("/mypage");
                      }}
                    >
                      마이페이지
                    </button>
                  )}
                  <button
                    className="header-right-button"
                    onClick={() => {
                      setClicked(() => {
                        return 5;
                      });
                      localStorage.clear();
                      removeCookie("refresh");
                      navigate("/");
                    }}
                  >
                    로그아웃
                  </button>
                </div>
                <button
                  className="header-nav-right-write"
                  onClick={() => {
                    setWrite(1);
                  }}
                >
                  글쓰기
                </button>
              </div>
            ) : (
              <div className="header-nav-right">
                <div className="header-nav-right-login">
                  <button
                    className="header-right-button"
                    onClick={() => {
                      setClicked(() => {
                        return 5;
                      });
                      navigate("/login");
                    }}
                  >
                    로그인
                  </button>
                  <button
                    className="header-right-button"
                    onClick={() => {
                      setClicked(() => {
                        return 5;
                      });
                      navigate("/join");
                    }}
                  >
                    회원가입
                  </button>
                </div>
                <button
                  className="header-nav-right-write"
                  onClick={() => {
                    handleRole();
                  }}
                >
                  글쓰기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {write == 1 ? (
        <Write
          write={write}
          setWrite={setWrite}
          Nav={clicked}
          setNav={setClicked}
        ></Write>
      ) : null}
      {showAlert && (
        <Alert message="로그인 후 이용가능합니다" onClose={handleCloseAlert} />
      )}
    </>
  );
}

export default Header;
