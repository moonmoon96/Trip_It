import { useEffect, useState } from "react";
import calendar from "./image/calendar.png";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cut from "./Cut";
import Ban from "./Ban";
import Rewrite from "./Rewrite";
import Delete from "./Delete";
import Warn from "./Warn";
import { getCookie } from "Utility/Cookie";

function Detail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const postId = searchParams.get("post");
  const userId = searchParams.get("user");

  interface Detail {
    userId: number | null;
    loggedUserId: number;
    nickname: string;
    gender: string;
    birth: string;
    userpic: string;
    startDate: string;
    endDate: string;
    metroId: string;
    postId: number;
    postTitle: string;
    postContent: string;
    personnel: number;
    postPic: string;
    exposureStatus: number;
    viewCount: number;
    metroName: string;
  }

  const [details, setDetails] = useState<Detail[]>([]);
  const [rewrite, setRewrite] = useState(0);
  const [del, setDel] = useState(0);
  const [cut, setCut] = useState(0);
  const [ban, setBan] = useState(0);
  const [onclick, setOnclick] = useState(false);
  const [text, setText] = useState("모집중");
  const [warn, setWarn] = useState(0);

  const handleClick = () => {
    setOnclick(!onclick);
  };

  const handleClicks = () => {
    setWarn(1);
  };

  useEffect(() => {
    async function detList() {
      const checkToken = localStorage.getItem("access");

      try {
        if (!checkToken) {
          let url = `${process.env.REACT_APP_BASE_URL}/community/communityDetailGuest/${userId}/${postId}`;

          let response = await axios.get(url);

          setDetails(response.data);
        } else {
          let url = `${process.env.REACT_APP_BASE_URL}/community/communityDetail/${userId}/${postId}`;

          let response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Access: `${localStorage.getItem("access")}`,
              Refresh: `${getCookie("refresh")}`,
            },
            withCredentials: true,
          });

          setDetails(response.data);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    }

    detList();
  }, []);

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    let formatDate =
      date.getFullYear() +
      "." +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "." +
      ("0" + date.getDate()).slice(-2);

    return formatDate;
  }

  function calculateAge(birthDate: any) {
    const birthYear = parseInt(birthDate.substring(0, 4), 10);
    const birthMonth = parseInt(birthDate.substring(4, 6), 10) - 1;
    const birthDay = parseInt(birthDate.substring(6, 8), 10);

    const today = new Date();
    let age = today.getFullYear() - birthYear;

    if (
      today.getMonth() < birthMonth ||
      (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
      age--;
    }

    return age;
  }

  function getAgeGroup(birthDate: any) {
    const age = calculateAge(birthDate);

    if (age < 10) {
      return "10대 미만";
    } else {
      const ageGroup = Math.floor(age / 10) * 10;
      return `${ageGroup}대`;
    }
  }

  function calculateDuration(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let timeDifference = end.getTime() - start.getTime();

    let daysDifference = timeDifference / (1000 * 3600 * 24);

    daysDifference = Math.floor(daysDifference) + 1;

    return daysDifference + "일";
  }

  function changeGender(gender: any) {
    if (gender === "m") {
      return "남";
    } else if (gender === "f") {
      return "여";
    }
  }

  return (
    <>
      {details.map((detail) => (
        <div key={detail.postId} className="detail">
          <div className="detail-img">
            {detail.postPic && (
              <img
                src={
                  detail.postPic.startsWith("/img")
                    ? `${detail.postPic}`
                    : `data:image/${detail.postPic.substring(
                        detail.postPic.lastIndexOf(".") + 1
                      )};base64, ${detail.postPic}`
                }
                alt="area_img"
                className="detail-imgfile"
              />
            )}
          </div>
          <div className="detail-body">
            <div className="detail-body-left">
              <>
                <div className="detail-left">
                  <p className="detail-left-title">{detail.postTitle}</p>
                  <div className="detail-left-sub">
                    <div className="detail-left-sub-left">
                      <p className="detail-left-sub-left-font">
                        조회수 {detail.viewCount}
                      </p>
                      <p className="detail-left-sub-left-font">메시지 5</p>
                    </div>
                    <div className="detail-left-sub-right">
                      {detail.loggedUserId == Number(userId) ? (
                        <>
                          {detail.exposureStatus == 1 && (
                            <p
                              className="detail-left-sub-right-font"
                              onClick={() => setRewrite(1)}
                            >
                              수정
                            </p>
                          )}
                          <p
                            className="detail-left-sub-right-font"
                            onClick={() => setDel(1)}
                          >
                            삭제
                          </p>
                          <br></br>
                        </>
                      ) : (
                        <>
                          <p
                            className="detail-left-sub-right-font"
                            onClick={() => {
                              setCut(1);
                            }}
                          >
                            차단
                          </p>
                          <p
                            className="detail-left-sub-right-font"
                            onClick={() => {
                              setBan(1);
                            }}
                          >
                            신고
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="detail-left-main">
                    <div className="detail-left-plan">
                      <p className="detail-left-plan-font">여행 일정</p>
                      <div className="detail-left-plan-body">
                        <div className="detail-left-plan-body-box">
                          <div>
                            <img
                              src={calendar}
                              alt="icon"
                              className="plan-body-left-imgfile"
                            ></img>
                          </div>
                          <p className="plan-body-box-font">
                            {formatDate(detail.startDate)} -{" "}
                            {formatDate(detail.endDate)} (
                            {calculateDuration(
                              detail.startDate,
                              detail.endDate
                            )}
                            )
                          </p>
                        </div>
                        <div className="detail-left-plan-body-box">
                          <div>
                            <svg
                              width="13"
                              height="17"
                              viewBox="0 0 13 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.7244 7.11371C12.7244 10.6866 6.49995 16.3557 6.49995 16.3557C6.49995 16.3557 0.275513 10.6866 0.275513 7.11371C0.275513 3.54077 3.06229 0.644341 6.49995 0.644341C9.93761 0.644341 12.7244 3.54077 12.7244 7.11371Z"
                                fill="#808080"
                              ></path>
                              <ellipse
                                cx="6.50063"
                                cy="6.40462"
                                rx="2.81106"
                                ry="2.81106"
                                fill="#FFFFFF"
                              ></ellipse>
                            </svg>
                          </div>
                          <p className="plan-body-box-font">
                            {detail.metroName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="detail-left-content">
                      <p className="detail-left-plan-font">여행 소개</p>
                      <p className="plan-body-box-font">{detail.postContent}</p>
                    </div>
                  </div>
                  <div className="detail-divb">
                    {detail.exposureStatus == 1 ? (
                      <>
                        <button
                          className={
                            "detail-button" + (text == "모집완료" ? "2" : "")
                          }
                          disabled={
                            detail.loggedUserId != Number(userId) ||
                            text == "모집완료"
                          }
                          onClick={() => {
                            handleClick();
                          }}
                        >
                          {text}
                        </button>
                        {onclick == true && (
                          <div
                            className={`list-container ${
                              onclick ? "open" : ""
                            }`}
                          >
                            <ul>
                              <li
                                className="keep"
                                onClick={() => {
                                  handleClick();
                                  setText("모집중");
                                }}
                              >
                                모집중
                              </li>
                              <li
                                className="done"
                                onClick={() => {
                                  handleClicks();
                                }}
                              >
                                모집완료
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <button className="detail-button2">모집완료</button>
                    )}
                  </div>
                </div>
              </>
            </div>
            <div className="detail-body-right">
              <div className="detail-body-right-box">
                <div className="detail-right-box-content">
                  <p className="detail-right-box-font">여행장</p>
                  <div className="right-box-content-box">
                    <div className="right-box-content-box-top">
                      <div className="box-top-imgfile">
                        <img
                          className="dpi"
                          src={detail.userpic || "/img/defaultImage.jpg"}
                        ></img>
                      </div>
                      <div className="box-top-box">
                        <p className="box-top-box-font">{detail.nickname}</p>
                        <div className="box-top-box-sub">
                          <p className="box-top-box-sub-one">
                            {getAgeGroup(detail.birth)}
                          </p>
                          <p className="box-top-box-sub-two">
                            {changeGender(detail.gender)}
                          </p>
                          <p className="box-top-box-sub-three">한국</p>
                        </div>
                      </div>
                    </div>
                    <p className="right-box-content-box-top-font">
                      친화력 좋은 여행자에요.
                    </p>
                  </div>
                </div>
                <button className="chat-button">채팅하기</button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {rewrite == 1 ? (
        <Rewrite
          postId={postId}
          postTitle={details.map((detail) => detail.postTitle)}
          postContent={details.map((detail) => detail.postContent)}
          rewrite={rewrite}
          setRewrite={setRewrite}
        ></Rewrite>
      ) : null}
      {del == 1 ? (
        <Delete postId={postId} del={del} setDel={setDel}></Delete>
      ) : null}
      {cut == 1 ? <Cut cut={cut} setCut={setCut}></Cut> : null}
      {ban == 1 ? <Ban ban={ban} setBan={setBan}></Ban> : null}
      {warn == 1 ? (
        <Warn
          warn={warn}
          setWarn={setWarn}
          onclick={onclick}
          setOnclick={setOnclick}
          text={text}
          setText={setText}
          postId={postId}
        ></Warn>
      ) : null}
    </>
  );
}

export default Detail;
