import React, { useRef, useState } from "react";
import {
  checkPassordAPI,
  resignAPI,
  updatePasswordAPI,
  updateProfileAPI,
} from "apis/profile";
import useModalOutsideClick from "hooks/useModalOutsideClick";
import { ModalMessageExtend } from "types/modal";
import { ProfileType, UserType } from "types/users";

interface MypageProfileModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  user: UserType | undefined;
  setUser: (value: UserType) => void;
  message: ModalMessageExtend | undefined;
  setMessage: (value: ModalMessageExtend) => void;
  profile: ProfileType;
  setProfile: (value: ProfileType) => void;
  setOpenProfile: (value: boolean) => void;
  setRequesting: (value: boolean) => void;
}

const MypageProfileModal = ({
  open,
  setOpen,
  user,
  setUser,
  message,
  setMessage,
  profile,
  setProfile,
  setOpenProfile,
  setRequesting,
}: MypageProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");

  useModalOutsideClick(modalRef, () => setOpen(false), open);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setPassword(value);
  };

  const checkPassword = async () => {
    try {
      const res = await checkPassordAPI(password);
      if (res.status === 200) {
        setMessage({
          type: "confirm",
          theme: "correct",
          msgs: {
            title: "비밀번호가 확인되었습니다.",
            detail: "원하시는 비밀번호를 입력하세요.",
          },
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({
        type: "confirm",
        theme: "return",
        msgs: {
          title: "비밀번호가 틀렸습니다.",
          detail: "다시 시도하시겠습니까?",
        },
      });
    } finally {
      setPassword(""); // 이곳에서 비밀번호를 초기화합니다.
    }
  };

  const changePassword = async () => {
    setPassword("");
    const validation = ValidatePw(password);
    if (!validation) {
      setMessage({
        type: "confirm",
        theme: "correct",
        msgs: {
          title: "비밀번호 형식이 잘못되었습니다.",
          detail: "다시 작성해주세요.",
        },
      });
      return;
    }

    try {
      const res = await updatePasswordAPI(password);
      if (res.status === 200) {
        setPassword("***********************************"); // 비밀번호 입력 필드 초기화
        setMessage({
          type: "alert",
          theme: "completed",
          msgs: {
            title: "비밀번호가 변경되었습니다.",
            detail: "",
          },
        });
      }
    } catch (err: any) {
      console.log(err);
      if (err.msgId === 3) {
        setPassword("");
        setMessage({
          type: "confirm",
          theme: "correct",
          msgs: {
            title: "기존 비밀번호와 동일합니다.",
            detail: "기존 비밀번호와 다른 비밀번호를 입력하세요.",
          },
        });
      }
    } finally {
      setPassword(""); // 이곳에서 비밀번호를 초기화합니다.
    }
  };

  const ValidatePw = (value: string) => {
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/;
    return pwRegex.test(value);
  };

  // 프로필 업데이트
  const submitProfile = () => {
    const updatedFields: ProfileType = { userpic: "", nickname: "", intro: "" };

    if (user?.userpic !== profile.userpic && profile.userpic.length !== 0) {
      updatedFields.userpic = profile.userpic;
    } else {
      updatedFields.userpic = user ? user.userpic : "";
    }
    if (user?.nickname !== profile.nickname && profile.nickname.length !== 0) {
      updatedFields.nickname = profile.nickname;
    } else {
      updatedFields.nickname = user ? user.nickname : "";
    }
    if (user?.intro !== profile.intro && profile.intro.length !== 0) {
      updatedFields.intro = profile.intro;
    } else {
      updatedFields.intro = user ? user.intro : "";
    }

    setRequesting(true);

    updateProfileAPI(updatedFields)
      .then((res) => {
        if (!res) return;
        if (res.status === 200) {
          if (!user) return;
          const newUser = {
            ...user,
            userpic: updatedFields.userpic,
            nickname: updatedFields.nickname,
            intro: updatedFields.intro,
          };

          setUser(newUser);
          setProfile({ userpic: "", nickname: "", intro: "" });
          setMessage({
            type: "alert",
            theme: "completed",
            msgs: {
              title: "프로필이 업데이트 되었습니다.",
              detail: "",
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.msgId === 6) {
          setMessage({
            type: "alert",
            theme: "incompleted",
            msgs: {
              title: "동일한 닉네임을 가진 사용자가 있습니다.",
              detail: "다른 닉네임으로 다시 시도해주세요.",
            },
          });
          setProfile({ userpic: "", nickname: "", intro: "" });
          return;
        }
        setMessage({
          type: "alert",
          theme: "incompleted",
          msgs: {
            title: "알 수 없는 이유로 업데이트가 실패했습니다.",
            detail: "잠시 후에 다시 시도해주세요.",
          },
        });
      })
      .finally(() => setRequesting(false));
  };

  const handleAlert = () => {
    setOpen(!open);
  };

  const handleCancel = () => {
    setOpen(!open);
    setPassword("");
  };

  const handleResign = async () => {
    await resignAPI()
      .then((res) => {
        if (!res) return;

        setMessage({
          type: "alert",
          theme: "normal",
          msgs: {
            title: "탈퇴가 완료되었습니다.",
            detail: "",
          },
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`mypage-schedule-modal${open ? " open" : ""}`}>
      <div className="mypage-schedule-modal-container" ref={modalRef}>
        <div className="mypage-schedule-modal-wrapper">
          <p className="mypage-schedule-modal-title">{message?.msgs.title}</p>
          <p className="mypage-schedule-modal-detail">{message?.msgs.detail}</p>
          {(message?.theme === "askPasswordChange" ||
            message?.theme === "correct") && (
            <div className="input-container">
              <input
                type="password"
                className="check-password"
                onChange={(e) => handleOnChange(e)}
                value={password}
              />
            </div>
          )}
          <div
            className={`mypage-schedule-modal-btns${
              message?.type === "confirm" ? " confirm" : ""
            }`}
          >
            {message?.type === "confirm" && (
              <button
                className="mypage-schedule-modal-btns-cancel"
                onClick={handleCancel}
              >
                취소
              </button>
            )}
            {message?.type === "confirm" ? (
              <button
                className="mypage-schedule-modal-btns-confirm"
                onClick={
                  message.theme === "askPasswordChange"
                    ? checkPassword
                    : message.theme === "return"
                    ? () =>
                        setMessage({
                          type: "confirm",
                          theme: "askPasswordChange",
                          msgs: {
                            title: "비밀번호를 변경하시겠습니까?",
                            detail:
                              "비밀번호 변경 전 현재 비밀번호를 확인합니다.",
                          },
                        })
                    : message.theme === "correct"
                    ? changePassword
                    : message.theme === "leave"
                    ? handleResign
                    : submitProfile
                }
              >
                확인
              </button>
            ) : (
              <button
                className="mypage-schedule-modal-btns-alert"
                onClick={handleAlert}
              >
                확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageProfileModal;
