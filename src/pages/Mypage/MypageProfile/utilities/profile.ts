import { app } from "firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const convertDataToDate = (origin: string) => {
  if (!origin) return;
  const year = origin.slice(0, 4);
  const month = origin.slice(4, 6);
  const date = origin.slice(6, 8);

  return `${year}년 ${month}월 ${date}일`;
};

// 이미지 업로드 핸들러 함수
export const handleImageUpload = async (
  image: File, // 업로드할 이미지 파일
  setImagePercent: (value: number) => void, // 이미지 업로드 진행 상태를 설정하는 함수
  setImageError: (value: boolean) => void, // 이미지 업로드 오류 상태를 설정하는 함수
  profile: {
    userpic: string; // 현재 프로필 사진 URL
    nickname: string; // 사용자 닉네임
    intro: string; // 사용자 소개글
  },
  setProfile: (value: {
    userpic: string; // 업데이트된 프로필 사진 URL
    nickname: string; // 사용자 닉네임
    intro: string; // 사용자 소개글
  }) => void, // 프로필 상태를 업데이트하는 함수

) => {
  // 이미지가 없을 경우 경고 메시지
  if (!image) {
    window.alert("사진을 올려주세요.");
    return;
  }

  // Firebase 스토리지 인스턴스 가져오기
  const storage = getStorage(app);

  // 파일 이름을 현재 시간과 원본 파일 이름으로 설정
  const fileName = new Date().getTime() + image.name;

  // Firebase 스토리지 참조 생성
  const storageRef = ref(storage, fileName);

  // 이미지 파일 업로드를 위한 업로드 작업 생성
  const uploadTask = uploadBytesResumable(storageRef, image);

  // 업로드 상태 변화에 대한 리스너 설정
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // 업로드 진행 상태 계산
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      // 이미지 업로드 진행 상태를 백분율로 설정
      setImagePercent(Math.round(progress));
      console.log("upload is " + progress + "% done");
    },
    (error) => {
      // 업로드 중 오류 발생 시 오류 상태 설정
      setImageError(true);
    },
    () => {
      // 업로드 완료 후 다운로드 URL을 가져와서 프로필 업데이트
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // 프로필 상태 업데이트: 새 이미지 URL로 변경
        setProfile({ ...profile, userpic: downloadURL });
      });
    }
  );
};
