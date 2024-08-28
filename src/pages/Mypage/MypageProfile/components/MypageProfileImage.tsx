import React, { forwardRef } from "react";
import useHandleClickImage from "../hook/useHandleClickImage";

export interface ProfileImageProps {
  userpic: string | undefined;
  profilePic: string;
}

// React.forwardRef를 사용하여 ref를 전달하도록 변경
const MypageProfileImage = forwardRef<HTMLInputElement, ProfileImageProps>(
  ({ userpic, profilePic }, ref) => {
    const handleClickImage = useHandleClickImage(ref);

    return (
      <img
        src={
          profilePic.length !== 0
            ? profilePic
            : userpic
            ? userpic
            : "/images/defaultImage.jpg"
        }
        alt="프로필 사진"
        onClick={handleClickImage}
      />
    );
  }
);

// React.memo로 ProfileImage를 감싸서 props 변경 시에만 재렌더링되도록 설정
export default React.memo(MypageProfileImage, (prevProps, nextProps) => {
  // props 비교 함수, 필요에 따라 비교 조건을 조정할 수 있습니다.
  return (
    prevProps.profilePic === nextProps.profilePic &&
    prevProps.userpic === nextProps.userpic
  );
});
