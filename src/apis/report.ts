import axios from "axios";
import { getCookie } from "utilities/Cookie";

const baseURL = process.env.REACT_APP_BASE_URL;

// 관리자 페이지 신고 처리하기
export const updateReportAPI = async (
  reportId: string | number,
  reportFalse: number
) => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/reportConfirm`,
      {
        reportId,
        reportFalse,
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

    console.log(response);

    return response;
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

// 관리자 페이지 신고 목록
export const fetchReportsAPI = async (
  sortKey?: string,
  sortValue?: string,
  page?: number,
  size?: number,
  field?: string,
  search?: string
) => {
  try {
    const report = await axios.get(
      `${baseURL}/report/all?sortKey=${sortKey}&sortValue=${sortValue}&page=${page}&size=${size}&search=${search}&field=${field}`,
      {
        headers: {
          "Content-Type": "application/json",
          Access: `${localStorage.getItem("access")}`,
          Refresh: `${getCookie("refresh")}`,
        },
        withCredentials: true,
      }
    );

    console.log(report);

    return report;
  } catch (err: any) {
    console.log(err);
    const code = err.response.data.code;
    let msgId = 0;

    if (code === 1) {
      msgId = 7; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    }

    throw { msgId };
  }
};

// 신고하기
export const addReportAPI = async (value: any) => {
  try {
    const response = await axios.post(
      `${baseURL}/report/add`,
      {
        postId: value.postId,
        reportType: value.reportType,
        reportDetail: value.reportDetail,
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

    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    } else if (code === 4) {
      msgId = 6; // 이미 신고한 게시물
    }
  }
};

// 마이 페이지 신고 목록
export const fetchReportAPI = async () => {
  try {
    const report = await axios.get(`${baseURL}/report/user`, {
      headers: {
        "Content-Type": "application/json",
        Access: `${localStorage.getItem("access")}`,
        Refresh: `${getCookie("refresh")}`,
      },
      withCredentials: true,
    });

    console.log("마아페이지 목록", report);
    return report;
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
  }
};
