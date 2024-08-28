import { Link } from "react-router-dom";
import calendar from "../../../Community/image/calendar.png";
import eye from "../../../Community/image/calendar.png";
import chat from "../../../Community/image/calendar.png";
import "./mypagePostCard.css";

interface MypagePostCardProps {
  post: any;
}

const MypagePostCard = ({ post }: MypagePostCardProps) => {
  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return `${month}/${day}`;
  }

  function calculateAge(birthDate: any) {
    if (!birthDate) return;
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
    if (!age) return;
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
    <li className="mypage-post-card">
      <div className="mypage-post-card-select"></div>
      <Link to={`post/${post.postId}`} className="mypage-post-card-link">
        <div className="mypage-post-card-head">
          <div className="mypage-post-card-head-profile">
            <div className="mypage-post-card-head-profile-img">
              <img
                src={post.userpic || "/img/defaultImage.jpg"}
                alt="profile"
              ></img>
            </div>
            <div className="mypage-post-card-head-profile-name">
              <p className="mypage-post-card-head-profile-name-font">
                {post.userId.nickname}
              </p>
              <div className="mypage-post-card-head-profile-name-spec">
                <p className="mypage-post-card-head-profile-name-spec-font">
                  {getAgeGroup(post.userId.birth)}
                </p>
                <div className="mypage-post-card-head-profile-name-spec-dot"></div>
                <p className="mypage-post-card-head-profile-name-spec-font">
                  {changeGender(post.userId.gender)}
                </p>
              </div>
            </div>
          </div>
          <div className="mypage-post-card-head-bar"></div>
          <div className="mypage-post-card-head-duration">
            <div className="mypage-post-card-duration-bar"></div>
            <div className="mypage-post-card-duration-img">
              <img
                src={calendar}
                alt="icon"
                className="mypage-post-card-duration-imgfile"
              ></img>
              <p className="mypage-post-card-duration-font">여행기간</p>
            </div>
            <div className="mypage-post-card-duration-spec">
              <p className="mypage-post-card-duration-spec-day">
                {calculateDuration(
                  post.scheduleId.startDate,
                  post.scheduleId.endDate
                )}
              </p>
              <div className="mypage-post-card-duration-spec-dot"></div>
              <p className="mypage-post-card-duration-spec-schedule">
                {formatDate(post.scheduleId.startDate)} -{" "}
                {formatDate(post.scheduleId.endDate)}
              </p>
            </div>
          </div>
        </div>
        <div className="mypage-post-card-img">
          <div className="mypage-post-card-img-main">
            {post.postPic && (
              <img
                src={
                  post.postPic.startsWith("/img")
                    ? `${post.postPic}`
                    : `data:image/${post.postPic.substring(
                        post.postPic.lastIndexOf(".") + 1
                      )};base64, ${post.postPic}`
                }
                alt="area_img"
                className="mypage-post-card-img-imgfile"
              />
            )}
          </div>
          <div className="mypage-post-card-img-location">
            <div className="myapge-post-card-location-img">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7244 7.11371C12.7244 10.6866 6.49995 16.3557 6.49995 16.3557C6.49995 16.3557 0.275513 10.6866 0.275513 7.11371C0.275513 3.54077 3.06229 0.644341 6.49995 0.644341C9.93761 0.644341 12.7244 3.54077 12.7244 7.11371Z"
                  fill="#008FF6"
                ></path>
                <ellipse
                  cx="6.50063"
                  cy="6.40462"
                  rx="2.81106"
                  ry="2.81106"
                  fill="#fff"
                ></ellipse>
              </svg>
            </div>
            <p className="mypage-post-card-location-font">{post.metroName}</p>
          </div>
          <div className="mypage-post-card-hide">
            <div className="mypage-post-card-hide-left">
              <p className="mypage-post-card-left-font">현재 모집중</p>
            </div>
            <div className="mypage-post-card-hide-right">
              <div className="mypage-post-card-right-box">
                <img src={eye} alt="icon" className="post-hide-imgfile"></img>
                <p className="mypage-post-card-right-font">{post.viewCount}</p>
              </div>
              <div className="mypage-post-card-right-box">
                <img src={chat} alt="icon" className="post-hide-imgfile"></img>
                <p className="mypage-post-card-right-font">3</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mypage-post-card-text">
          <p className="mypage-post-card-text-title">{post.postTitle}</p>
          <p className="mypage-post-card-text-body">{post.postContent}</p>
        </div>
      </Link>
    </li>
  );
};

export default MypagePostCard;
