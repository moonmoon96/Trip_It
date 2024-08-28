import axios from "axios";
import { ProfileType } from "types/users";
import { getCookie } from "utilities/Cookie";

const baseURL = process.env.REACT_APP_BASE_URL;

export const fetchProfileAPI = async () => {
  try {
    const profile = await axios.get(`${baseURL}/mypage/profile`, {
      headers: {
        "Content-Type": "application/json",
        Access: `${localStorage.getItem("access")}`,
        Refresh: `${getCookie("refresh")}`,
      },
      withCredentials: true,
    });

    console.log(profile);
    return profile;
  } catch (error) {
    console.log(error);
  }
};

// 현재 비밀번호 확인 API 호출 함수
export const checkPassordAPI = async (password: string) => {
  try {
    // 비밀번호 확인 요청을 서버에 보냄
    const response = await axios.post(
      `${baseURL}/mypage/profile/passwordCheck`, // 비밀번호 확인 엔드포인트
      {
        password, // 요청 본문에 비밀번호 포함
      },
      {
        headers: {
          "Content-Type": "application/json", // 요청 본문 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // 액세스 토큰 헤더 설정
          Refresh: `${getCookie("refresh")}`, // 리프레시 토큰 헤더 설정
        },
        withCredentials: true, // 쿠키를 요청에 포함
      }
    );

    return response; // 서버 응답 반환
  } catch (err: any) {
    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    // 에러 발생 시 처리
    if (code === 1 || status === 401) {
      // 비밀번호가 일치하지 않는 경우
      msgId = 1;
    }

    throw { msgId };
  }
};

// 비밀번호 변경 API 호출 함수
export const updatePasswordAPI = async (password: string) => {
  try {
    // 비밀번호 변경 요청을 서버에 보냄
    const response = await axios.post(
      `${baseURL}/mypage/profile/passwordUpdate`, // 비밀번호 변경 엔드포인트
      {
        password, // 요청 본문에 새로운 비밀번호 포함
      },
      {
        headers: {
          "Content-Type": "application/json", // 요청 본문 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // 액세스 토큰 헤더 설정
          Refresh: `${getCookie("refresh")}`, // 리프레시 토큰 헤더 설정
        },
        withCredentials: true, // 쿠키를 요청에 포함
      }
    );

    return response; // 서버 응답 반환
  } catch (err: any) {
    // 에러 발생 시 처리
    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    if (code === 1 || status === 422) {
      msgId = 3;
    }

    throw { msgId };
  }
};

// 프로필 변경
export const updateProfileAPI = async (profile?: ProfileType) => {
  try {
    const response = await axios.patch(
      `${baseURL}/mypage/profile/profileUpdate`,
      {
        userpic: profile?.userpic,
        nickname: profile?.nickname,
        intro: profile?.intro,
      },
      {
        headers: {
          "Content-Type": "application/json", // 요청 본문 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // 액세스 토큰 헤더 설정
          Refresh: `${getCookie("refresh")}`, // 리프레시 토큰 헤더 설정
        },
        withCredentials: true, // 쿠키를 요청에 포함
      }
    );

    console.log(response);

    return response; // 서버 응답 반환
  } catch (error: any) {
    console.log(error);
    console.log(error.message);
    let msgId = 0;
    const message = error.message;
    if (message === "Network Error") {
      msgId = 7;

      throw { msgId };
    }
    const status = error.response.status;
    const code = error.response.data.code;

    if (code === 1 || status === 409) {
      msgId = 6;
    } else if (code === 2 || status === 422) {
      msgId = 5;
    }

    throw { msgId };
  }
};

export const changeUserRoleAPI = async (
  userId: number | string,
  role: string
) => {
  try {
    // 비밀번호 변경 요청을 서버에 보냄
    const response = await axios.post(
      `${baseURL}/admin/changeUserRole`, // 비밀번호 변경 엔드포인트
      {
        userId,
        newRole: role,
      },
      {
        headers: {
          "Content-Type": "application/json", // 요청 본문 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // 액세스 토큰 헤더 설정
          Refresh: `${getCookie("refresh")}`, // 리프레시 토큰 헤더 설정
        },
        withCredentials: true, // 쿠키를 요청에 포함
      }
    );

    return response; // 서버 응답 반환
  } catch (err: any) {
    throw { err };
  }
};

export const resignAPI = async () => {
  try {
    const response = await axios.delete(`${baseURL}/mypage/delete-user`, {
      headers: {
        "Content-Type": "application/json", // 요청 본문 타입을 JSON으로 설정
        Access: `${localStorage.getItem("access")}`, // 액세스 토큰 헤더 설정
        Refresh: `${getCookie("refresh")}`, // 리프레시 토큰 헤더 설정
      },
      withCredentials: true, // 쿠키를 요청에 포함
    });

    return response; // 서버 응답 반환
  } catch (error) {
    console.log(error);

    throw { error };
  }
};
