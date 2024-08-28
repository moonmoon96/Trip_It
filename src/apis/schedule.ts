import axios from "axios";
import { ScheduleDtoInputType, ScheduleDetailDtoInputType } from "types/plan";
import { getCookie } from "utilities/Cookie";

const baseURL = process.env.REACT_APP_BASE_URL;

// 마이 페이지에서 일정 목록을 가져오는 함수
export const fetchSchedulesMAPI = async () => {
  try {
    // 서버의 마이 페이지 일정 목록 API에 GET 요청을 보내는 부분
    const schedule = await axios.get(`${baseURL}/mypage/schedules`, {
      headers: {
        "Content-Type": "application/json", // 요청의 콘텐츠 타입을 JSON으로 설정
        Access: `${localStorage.getItem("access")}`, // Access 토큰을 헤더에 추가
        Refresh: `${getCookie("refresh")}`, // Refresh 토큰을 헤더에 추가
      },
      withCredentials: true, // 크로스 도메인 요청에서 쿠키를 포함하도록 설정
    });

    console.log(schedule); // 서버 응답을 콘솔에 출력
    return schedule; // 서버 응답을 반환
  } catch (err: any) {
    console.log(err); // 에러를 콘솔에 출력
    const status = err.response.status; // HTTP 상태 코드를 추출
    const code = err.response.data.code; // 에러 코드를 추출
    let msgId = 0; // 메시지 ID 초기화

    // 에러 코드에 따라 메시지 ID를 설정
    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    }

    throw { msgId }; // 설정된 메시지 ID와 함께 에러를 던짐
  }
};

// 관리자 페이지에서 일정 목록을 가져오는 함수
export const fetchSchedulesAAPI = async (
  sortKey?: string, // 정렬할 필드
  sortValue?: string, // 정렬 방향 (오름차순 또는 내림차순)
  page?: number, // 페이지 번호
  size?: number, // 페이지당 항목 수
  field?: string, // 검색할 필드
  search?: string // 검색어
) => {
  console.log(sortKey, sortValue, page, size, field, search); // 요청 파라미터를 콘솔에 출력

  try {
    // 서버의 관리자 페이지 일정 목록 API에 GET 요청을 보내는 부분
    const schedule = await axios.get(
      `${baseURL}/admin/schedules?sortKey=${sortKey}&sortValue=${sortValue}&page=${page}&size=${size}&search=${search}&field=${field}`,
      {
        headers: {
          "Content-Type": "application/json", // 요청의 콘텐츠 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // Access 토큰을 헤더에 추가
          Refresh: `${getCookie("refresh")}`, // Refresh 토큰을 헤더에 추가
        },
        withCredentials: true, // 크로스 도메인 요청에서 쿠키를 포함하도록 설정
      }
    );

    console.log(schedule); // 서버 응답을 콘솔에 출력
    return schedule; // 서버 응답을 반환
  } catch (err: any) {
    console.log(err); // 에러를 콘솔에 출력
    const status = err.response.status; // HTTP 상태 코드를 추출
    const code = err.response.data.code; // 에러 코드를 추출
    let msgId = 0; // 메시지 ID 초기화

    // 에러 코드에 따라 메시지 ID를 설정
    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 정보를 불러올 수 없음
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    }

    throw { msgId }; // 설정된 메시지 ID와 함께 에러를 던짐
  }
};

// 마이페이지 일정 삭제
export const deleteSchedulesMAPI = async (scheduleIds: (string | number)[]) => {
  try {
    const response = await axios.post(
      `${baseURL}/mypage/schedules/delete-schedules`,
      {
        scheduleIds,
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

    return response;
  } catch (err: any) {
    console.log(err);

    const code = err.response.data.code;

    if (code === 1) {
      console.log("권한 없음");
    }

    throw { code: 1 };
  }
};

// 관리자 페이지 일정 삭제
export const deleteSchedulesAAPI = async (sheduleIds: (string | number)[]) => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/schedules/delete`,
      {
        sheduleIds,
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

    return response;
  } catch (err) {
    throw { err };
  }
};

// 일정 등록하기
export const saveScheduleAPI = async (value: {
  scheduleDto: ScheduleDtoInputType;
  detailScheduleDto: ScheduleDetailDtoInputType[];
}) => {
  try {
    const response = await axios.post(`${baseURL}/home/saveSchedule`, value, {
      headers: {
        "Content-Type": "application/json", // 요청 본문이 JSON 형식임을 지정
        Access: `${localStorage.getItem("access")}`, // 액세스 토큰을 요청 헤더에 포함
        Refresh: `${getCookie("refresh")}`, // 리프레시 토큰을 요청 헤더에 포함
      },
      withCredentials: true, // 쿠키와 자격 증명을 포함하여 요청
    });

    return response;
  } catch (err) {
    throw { err };
  }
};

// 일정 상세 가져오기
export const fetchScheduleDetails = async (scheduleId: string | number) => {
  try {
    const response = await axios.get(
      `${baseURL}/mypage/schedules/${scheduleId}`,
      {
        headers: {
          "Content-Type": "application/json", // 요청의 콘텐츠 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // Access 토큰을 헤더에 추가
          Refresh: `${getCookie("refresh")}`, // Refresh 토큰을 헤더에 추가
        },
        withCredentials: true, // 크로스 도메인 요청에서 쿠키를 포함하도록 설정
      }
    );

    console.log(response.data);

    return response;
  } catch (err: any) {
    console.log(err); // 에러를 콘솔에 출력
    const status = err.response.status; // HTTP 상태 코드를 추출
    const code = err.response.data.code; // 에러 코드를 추출
    let msgId = 0; // 메시지 ID 초기화

    // 에러 코드에 따라 메시지 ID를 설정
    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    }

    throw { msgId }; // 설정된 메시지 ID와 함께 에러를 던짐
  }
};

export const updateScheduleAPI = async (value: {
  scheduleDto: ScheduleDtoInputType;
  detailScheduleDto: ScheduleDetailDtoInputType[];
}) => {
  try {
    const response = await axios.patch(
      `${baseURL}/mypage/update-schedules`,
      value,
      {
        headers: {
          "Content-Type": "application/json", // 요청의 콘텐츠 타입을 JSON으로 설정
          Access: `${localStorage.getItem("access")}`, // Access 토큰을 헤더에 추가
          Refresh: `${getCookie("refresh")}`, // Refresh 토큰을 헤더에 추가
        },
        withCredentials: true, // 크로스 도메인 요청에서 쿠키를 포함하도록 설정
      }
    );

    return response;
  } catch (err: any) {
    console.log(err); // 에러를 콘솔에 출력
    const status = err.response.status; // HTTP 상태 코드를 추출
    const code = err.response.data.code; // 에러 코드를 추출
    let msgId = 0; // 메시지 ID 초기화

    // 에러 코드에 따라 메시지 ID를 설정
    if (code === 1) {
      msgId = 3; // 권한 없음
    } else if (code === 2) {
      msgId = 4; // 업데이트 안됨
    } else if (code === 3) {
      msgId = 5; // 내부 에러
    }

    throw { msgId }; // 설정된 메시지 ID와 함께 에러를 던짐
  }
};
