import "./mypageProfile.css";
import { useEffect, useRef, useState } from "react";
import { fetchProfileAPI } from "apis/profile";
import MypageProfileImage from "./components/MypageProfileImage";
import MypageProfileModal from "./components/MypageProfileModal";
import useHandleClickImage from "./hook/useHandleClickImage";
import { convertDataToDate, handleImageUpload } from "utilities/profile";
import { debounce } from "utilities/debounce";
import { ProfileType, UserType } from "types/users";
import { ModalMessageExtend } from "types/modal";
import { LuClipboardEdit, LuLoader2, LuPencil } from "react-icons/lu";
import useProtectMypage from "hooks/useProtectMypage";

const MypageProfile = () => {
  useProtectMypage();
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ModalMessageExtend>();
  const [user, setUser] = useState<UserType>();
  const [openProfile, setOpenProfile] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  // 이미지 업로드 진행 상태 백분율
  const [imagePercent, setImagePercent] = useState(0);
  // 이미지 업로드 에러 상태
  const [imageError, setImageError] = useState(false);
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<ProfileType>({
    intro: "",
    userpic: "",
    nickname: "",
  });
  const handleClickImage = useHandleClickImage(imageRef);

  // 유저 정보 가져오기
  useEffect(() => {
    setLoading(true);
    try {
      fetchProfileAPI()
        .then((res) => {
          if (!res) return;
          console.log(res.data);

          setUser(res?.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 변경 사항이 있는지 확인하기
  useEffect(() => {
    if (profile.userpic.length !== 0 && user?.userpic !== profile.userpic) {
      setOpenProfile(true);
    } else if (
      profile.nickname.length !== 0 &&
      user?.nickname !== profile.nickname
    ) {
      setOpenProfile(true);
    } else if (profile.intro.length !== 0 && user?.intro !== profile.intro) {
      setOpenProfile(true);
    } else {
      setOpenProfile(false);
    }
  }, [profile]);

  // 이미지에 변화가 있으면 업데이트
  useEffect(() => {
    if (image) {
      handleImageUpload(
        image,
        setImagePercent,
        setImageError,
        profile,
        setProfile,
        setOpen,
        setMessage
      );
    }
  }, [image]);

  // 회원 탈퇴
  const handleLeave = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setOpen(!open);
    setMessage({
      type: "confirm",
      theme: "leave",
      msgs: {
        title: "정말로 탈퇴하시겠습니까?",
        detail: "",
      },
    });
  };

  const onProfileChange = (id: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const debouncedProfileChange = debounce(onProfileChange, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    debouncedProfileChange(id, value);
  };

  const askProfileUpdate = () => {
    setOpen(true);
    setMessage({
      type: "confirm",
      theme: "askProfileUpdate",
      msgs: {
        title: "프로필을 업데이트하시겠습니까?",
        detail: "변경하면 되돌릴 수 없습니다.",
      },
    });
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  const debouncedPasswordChange = debounce(onPasswordChange, 500);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    debouncedPasswordChange(value);
  };

  const checkPassword = () => {
    setOpen(true);
    setMessage({
      type: "confirm",
      theme: "askPasswordChange",
      msgs: {
        title: "비밀번호를 변경하시겠습니까?",
        detail: "비밀번호 변경 전 현재 비밀번호를 확인합니다.",
      },
    });
  };

  if (loading) {
    return (
      <div className="mypage-mobile-profile-loading">
        <p>loading...</p>
      </div>
    );
  }

  return (
    <>
      <MypageProfileModal
        open={open}
        setOpen={setOpen}
        user={user}
        setUser={setUser}
        message={message}
        setMessage={setMessage}
        profile={profile}
        setProfile={setProfile}
        setOpenProfile={setOpenProfile}
        setRequesting={setRequesting}
      />
      <div className="mypage-profile">
        <div className="mypage-profile-container">
          <div className="mypage-profile-photo">
            <div className="mypage-profile-photo-container">
              <input
                type="file"
                ref={imageRef}
                hidden
                accept="image/*"
                onChange={(e) =>
                  setImage(
                    e.currentTarget?.files
                      ? e.currentTarget.files[0]
                      : undefined
                  )
                }
              />
              <MypageProfileImage
                userpic={user?.userpic}
                profilePic={profile.userpic}
                ref={imageRef}
              />
              <figure
                className="mypage-profile-photo-icon"
                onClick={handleClickImage}
                title="수정"
              >
                <LuPencil />
              </figure>
            </div>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">닉네임</p>
              <input
                type="text"
                id="nickname"
                className={`mypage-profile-detail-data`}
                defaultValue={user ? user.nickname : ""}
                onChange={handleInputChange}
              />
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">소개글</p>
              <input
                type="text"
                id="intro"
                className={`mypage-profile-detail-data`}
                defaultValue={user ? user.intro : ""}
                onChange={handleInputChange}
              />
            </span>
          </div>
          <div className={`mypage-profile-btn${openProfile ? " open" : ""}`}>
            <span
              className="mypage-profile-update"
              onClick={() => askProfileUpdate()}
            >
              {requesting ? (
                <span
                  className={
                    requesting
                      ? "mypage-profile-update-icon requesting"
                      : "mypage-profile-update-icon"
                  }
                >
                  <LuLoader2 />
                </span>
              ) : (
                "프로필 변경"
              )}
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">비밀번호</p>
              <input
                type="text"
                className={`mypage-profile-detail-data open`}
                defaultValue={`****************`}
                onChange={handlePasswordChange}
              />
            </span>
            <span className="mypage-profile-edit">
              <p onClick={() => checkPassword()}>
                <LuClipboardEdit />
              </p>
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">이름</p>
              <input
                type="text"
                className="mypage-profile-detail-info"
                defaultValue={user?.username}
              />
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">생년월일</p>
              <input
                type="text"
                className="mypage-profile-detail-info"
                defaultValue={user && convertDataToDate(user?.birth)}
              />
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">이메일</p>
              <input
                type="text"
                className="mypage-profile-detail-info"
                defaultValue={user?.email}
              />
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">신고수</p>
              <input
                type="text"
                className="mypage-profile-detail-info"
                defaultValue={user?.reportCount}
              />
            </span>
          </div>
          <div className="mypage-profile-item">
            <span className="mypage-profile-detail">
              <p className="mypage-profile-detail-title">등급</p>
              <input
                type="text"
                className="mypage-profile-detail-info"
                defaultValue={
                  user?.[`role`] === "ROLE_USER"
                    ? "일반회원"
                    : user?.[`role`] === "ROLE_ADMIN"
                    ? "관리자"
                    : user?.[`role`] === "ROLE_A"
                    ? `일반회원(7일 정지[${convertDataToDate(
                        user?.[`endDate`]
                      )} 종료])`
                    : user?.[`role`] === "ROLE_B"
                    ? `일반회원(30일 정지[${convertDataToDate(
                        user?.[`endDate`]
                      )} 종료])`
                    : user?.[`role`] === "ROLE_C"
                    ? "정지회원(영구 정지)"
                    : user?.[`role`] === "ROLE_C"
                    ? "탈퇴 회원"
                    : ""
                }
              />
            </span>
          </div>

          <li className="mypage-profile-item leave">
            <span
              className="mypage-profile-leave"
              onClick={(e) => handleLeave(e)}
            >
              회원탈퇴
            </span>
          </li>
        </div>
      </div>
    </>
  );
};

export default MypageProfile;
