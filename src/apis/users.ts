import axios from "axios";
import { getCookie } from "utilities/Cookie";

const baseURL = process.env.REACT_APP_BASE_URL;

// 유저 목록 가져오기
export const fetchUsersAPI = async (
  sortKey?: string,
  sortValue?: string,
  page?: number,
  size?: number,
  field?: string,
  search?: string
) => {
  try {
    const users = await axios.get(
      `${baseURL}/admin/users?sortKey=${sortKey}&sortValue=${sortValue}&page=${page}&size=${size}&search=${search}&field=${field}`,
      {
        headers: {
          "Content-Type": "application/json",
          Access: `${localStorage.getItem("access")}`,
          Refresh: `${getCookie("refresh")}`,
        },
        withCredentials: true,
      }
    );

    console.log(users);

    return users;
  } catch (err: any) {
    console.log(err);
    // const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    if (code === 1) {
      msgId = 1;
    } else if (code === 3) {
      msgId = 2;
    }

    throw { msgId };
  }
};

// 유저 정보 가져오기
export const fetchUserAPI = async (userId: string) => {
  try {
    const user = await axios.get(`${baseURL}/admin/userDetail/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Access: `${localStorage.getItem("access")}`,
        Refresh: `${getCookie("refresh")}`,
      },
      withCredentials: true,
    });

    return user;
  } catch (err: any) {
    console.log(err);
    const status = err.response.status;
    console.log(status);

    const code = err.response.data.code;
    let msgId = 0;

    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    } else if (status === 404) {
      msgId = 6;
    }

    throw { msgId };
  }
};

// 유저 등급 변경
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const user = await axios.post(
      `${baseURL}/admin/users/updateRole`,
      { userId, newRole: role },
      {
        headers: {
          "Content-Type": "application/json", 
          Access: `${localStorage.getItem("access")}`,
          Refresh: `${getCookie("refresh")}`,
        },
        withCredentials: true,
      }
    );

    return user;
  } catch (err: any) {
    console.log(err);
    const status = err.response.status;
    const code = err.response.data.code;
    let msgId = 0;

    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    }

    throw { msgId };
  }
};
