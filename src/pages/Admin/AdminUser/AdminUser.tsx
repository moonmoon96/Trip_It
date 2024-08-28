import "./adminUser.css";
import { useEffect, useRef, useState } from "react";
import { UserType } from "types/users";
import { convertDataToDate } from "utilities/profile";
import { fetchUserAPI } from "apis/users";
import { changeUserRoleAPI } from "apis/profile";
import { useParams } from "react-router-dom";
import useProtectAdmin from "hooks/useProtectAdmin";

const AdminUser = () => {
  useProtectAdmin();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserType>();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!userId) return;

    fetchUserAPI(userId)
      .then((res) => {
        if (!res) return;
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err: any) => {
        if (err.msgId) {
          switch (err.msgId) {
            case 3:
              console.error("권한이 없습니다.");
              break;
            case 4:
              console.error("업데이트되지 않았습니다.");
              break;
            case 5:
              console.error("내부 서버 오류입니다.");
              break;
            case 6:
              console.error("잘못된 요청입니다.");
              break;
            default:
              console.error("알 수 없는 오류가 발생했습니다.");
          }
        } else {
          console.error("예상치 못한 오류가 발생했습니다:", err);
        }
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRole = (role: string) => {
    if (!user) return;
    changeUserRoleAPI(user.userId, role)
      .then((res) => {
        if (!res) return;
        console.log(res.data);
        const newUser = {
          ...user,
          role,
        };
        setUser(newUser);
        setOpenDropdown(!openDropdown);
      })
      .catch((err: any) => {
        console.log(err);
        setOpenDropdown(!openDropdown);
      });
  };

  if (loading) {
    return <li>loading...</li>;
  }

  const defaultImage = "/images/defaultImage.jpg";
  return (
    <>
      <div className="admin-user-modal"></div>
      <div className="admin-user">
        <div className="admin-user-container">
          <div className="admin-user-photo">
            <div className="admin-user-photo-container">
              <img src={user?.userpic || defaultImage} alt="유저 이미지" />
            </div>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">닉네임</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={user?.nickname}
              />
            </span>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">소개글</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={user?.intro}
              />
            </span>
          </div>

          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">비밀번호</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={`*************`}
              />
            </span>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">이름</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={user?.username}
              />
            </span>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">생년월일</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={user && convertDataToDate(user?.birth)}
              />
            </span>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">이메일</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={user?.email}
              />
            </span>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">신고수</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={user?.reportCount}
              />
            </span>
          </div>
          <div className="admin-user-item">
            <span className="admin-user-detail">
              <p className="admin-user-detail-title">등급</p>
              <input
                type="text"
                className="admin-user-detail-info"
                defaultValue={
                  user?.[`role`] === "ROLE_USER"
                    ? "일반회원"
                    : user?.[`role`] === "ROLE_ADMIN"
                    ? "관리자"
                    : user?.[`role`] === "ROLE_A"
                    ? // && user?.[`endDate`]
                      `일반회원(7일 정지[${convertDataToDate(
                        user?.[`endDate`]
                      )} 종료])
                    `
                    : user?.[`role`] === "ROLE_B" && user?.[`endDate`]
                    ? `일반회원(30일 정지[${convertDataToDate(
                        user?.[`endDate`]
                      )} 종료])`
                    : user?.[`role`] === "ROLE_C" && user?.[`endDate`]
                    ? "정지회원(영구 정지)"
                    : user?.[`role`] === "ROLE_C"
                    ? "탈퇴 회원"
                    : ""
                }
              />
            </span>
            <span className="admin-user-detail-control" ref={dropdownRef}>
              <p
                className="admin-user-detail-control-title"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                등급 변경
              </p>
              <ul
                className={`admin-user-detail-control-container${
                  openDropdown ? " open" : ""
                }`}
              >
                <li
                  className="admin-user-detail-control-item"
                  onClick={() => handleRole("ROLE_USER")}
                >
                  일반회원
                </li>
                <li
                  className="admin-user-detail-control-item"
                  onClick={() => handleRole("ROLE_ADMIN")}
                >
                  관리자
                </li>
                <li
                  className="admin-user-detail-control-item"
                  onClick={() => handleRole("ROLE_A")}
                >
                  일반회원(7일 정지)
                </li>
                <li
                  className="admin-user-detail-control-item"
                  onClick={() => handleRole("ROLE_B")}
                >
                  일반회원(30일 정지)
                </li>
                <li
                  className="admin-user-detail-control-item"
                  onClick={() => handleRole("ROLE_B")}
                >
                  일반회원(영구정지)
                </li>
              </ul>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUser;
