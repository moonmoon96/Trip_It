import axios from "axios";
import { getCookie } from "utilities/Cookie";

const baseURL = process.env.REACT_APP_BASE_URL;

// 마이 페이지 차단 목록
export const fetchBlockAPI = async () => {
  try {
    const block = await axios.get(`${baseURL}/mypage/block`, {
      headers: {
        "Content-Type": "application/json",
        Access: `${localStorage.getItem("access")}`,
        Refresh: `${getCookie("refresh")}`,
      },
      withCredentials: true,
    });

    return block;
  } catch (error) {
    console.log(error);
  }
};

// 관리자 페이지 차단 목록
export const fetchBlocksAPI = async (
  sortKey?: string,
  sortValue?: string,
  page?: number,
  size?: number,
  field?: string,
  search?: string
) => {
  try {
    const blocks = await axios.get(
      `${baseURL}/block/all?sortKey=${sortKey}&sortValue=${sortValue}&page=${page}&size=${size}&search=${search}&field=${field}`,
      {
        headers: {
          "Content-Type": "application/json",
          Access: `${localStorage.getItem("access")}`,
          Refresh: `${getCookie("refresh")}`,
        },
        withCredentials: true,
      }
    );

    return blocks;
  } catch (err: any) {
    console.log(err);
    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    if (code === 1) {
      msgId = 6;
    } else if (code === 2 || code === 3) {
      msgId = 3;
    } else if (code === 4) {
      msgId = 4;
    }

    throw { msgId };
  }
};

// 차단 해제 API 호출 함수
export const unBlockAPI = async (blockId: string | number) => {
  try {
    // 서버에 차단 해제 요청을 POST 방식으로 전송
    const response = await axios.post(
      `${baseURL}/block/delete`, // 요청을 보낼 서버의 URL
      {
        blockId, // 요청 본문에 포함될 차단 해제할 ID
      },
      {
        headers: {
          "Content-Type": "application/json", // 요청 본문이 JSON 형식임을 지정
          Access: `${localStorage.getItem("access")}`, // 액세스 토큰을 요청 헤더에 포함
          Refresh: `${getCookie("refresh")}`, // 리프레시 토큰을 요청 헤더에 포함
        },
        withCredentials: true, // 쿠키와 자격 증명을 포함하여 요청
      }
    );

    // 서버로부터의 응답 반환
    return response;
  } catch (err: any) {
    console.log(err);
    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    if (code === 2 || code === 3) {
      msgId = 3;
    } else if (code === 4) {
      msgId = 4;
    }

    throw { msgId };
  }
};

// 관리자 차단 해제 API 호출 함수
export const unBlockByAdminAPI = async (blockId: string | number) => {
  try {
    // 서버에 차단 해제 요청을 POST 방식으로 전송
    const response = await axios.post(
      `${baseURL}/admin/block/unblock`, // 요청을 보낼 서버의 URL
      {
        blockId, // 요청 본문에 포함될 차단 해제할 ID
      },
      {
        headers: {
          "Content-Type": "application/json", // 요청 본문이 JSON 형식임을 지정
          Access: `${localStorage.getItem("access")}`, // 액세스 토큰을 요청 헤더에 포함
          Refresh: `${getCookie("refresh")}`, // 리프레시 토큰을 요청 헤더에 포함
        },
        withCredentials: true, // 쿠키와 자격 증명을 포함하여 요청
      }
    );

    // 서버로부터의 응답 반환
    return response;
  } catch (err: any) {
    console.log(err);
    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;
    // 응답 코드가 1인 경우, 차단 해제 요청 권한이 없음을 알림
    if (code === 1) {
      msgId = 5;
    } else if (code === 2 || code === 3) {
      msgId = 3;
    } else if (code === 4) {
      msgId = 4;
    }

    throw { msgId };
  }
};

// 차단 추가 하기
export const blockUserAPI = async (value: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/block/add`,
      {
        nickname: value,
        blockedId: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Access: `${localStorage.getItem("access")}`,
          Refresh: `${getCookie("refresh")}`,
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (err: any) {
    console.log(err);

    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    console.log(status, code);
    if (err.response.data.code === 1) {
      msgId = 1;
    }
    if (err.response.data.code === "1") {
      alert("자기 자신을 차단할 수 없습니다.");
    }
    if (err.response.data.code === "2") {
      alert("이미 차단한 사용자입니다.");
    }

    throw { msgId };
  }
};
