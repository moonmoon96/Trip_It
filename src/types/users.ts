export interface ProfileType {
  userpic: string; // 사용자 프로필 사진 URL (예: "")
  nickname: string; // 닉네임 (예: "강고양이")
  intro: string; // 자기소개 (예: "")
}

export interface UserType extends ProfileType {
  birth: string; // 생년월일 (예: "20060515")
  email: string; // 이메일 (예: "test@gmail.com")
  gender: "m" | "f"; // 성별 (예: "f" 혹은 "m")
  userId: string | number; // 사용자 ID (예: "669cb8b6955638cc128c0782")
  password: string; // 비밀번호 해시 (예: "$2a$10$gpUg7i9Oqb7oAdHwH/5yj.xEUD9N4QsLE3Ig0P2S2TPLlIUheeR/2")
  regdate: string; // 가입 날짜 (예: "2024-07-21T07:28:54.796Z")
  reportCount: number; // 신고 횟수 (예: 0)
  role: string; // 사용자 역할 (예: "ROLE_USER")
  username: string; // 사용자 이름 (예: "강해린")
  _id?: string; // MongoDB 문서 ID (예: "669cb8b6955638cc128c0782")
  endDate?: string; // 정지 혹은 탈퇴 날짜 (예: "2024-07-21T07:28:54.796Z")
}
