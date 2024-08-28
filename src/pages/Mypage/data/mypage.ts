import { SortandSearchType } from "../types/mypage";

// 목록 사이즈 크기 목록
export const sizeArray = [12, 16, 20, 24, 28];

// 마이 페이지
export const mypageList = [
  { title: "개인정보", link: "./profile" },
  { title: "내 일정", link: "./schedules" },
  { title: "내 모집글", link: "./posts" },
  { title: "차단 목록", link: "./blocks" },
  { title: "신고 목록", link: "./reports" },
];

// 마이 페이지 일정 페이지
export const mypageScheduleSnSArray: SortandSearchType[] = [
  {
    field: { name: "index" },
    type: "index",
    title: "번호",
    sort: { key: "", value: "" },
    search: { able: false },
  },
  {
    field: { name: "scheduleId" },
    type: "checkbox",
    title: "삭제",
    sort: { key: "", value: "" },
    search: { able: false },
  },
  {
    field: { name: "metroId" },
    type: "normal",
    title: "지역",
    sort: { key: "metroId", value: "asc" },
    search: {
      able: true,
      type: "normal",
    },
  },
  {
    field: { name: "scheduleTitle" },
    type: "normal",
    title: "일정 제목",
    sort: { key: "scheduleTitle", value: "asc" },
    search: {
      able: true,
      type: "normal",
    },
  },
  {
    field: { name: "registerDate" },
    type: "date", // 값 그대로 적용
    title: "등록 날짜",
    sort: { key: "registerDate", value: "desc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "startDate" },
    type: "date", // 값 그대로 적용
    title: "시작 날짜",
    sort: { key: "startDate", value: "asc" },
    search: { able: false, type: "normal" },
  },
  {
    field: { name: "endDate" },
    type: "date", // 값 그대로 적용
    title: "종료 날짜",
    sort: { key: "endDate", value: "asc" },
    search: { able: false, type: "normal" },
  },
];

// 마이 페이지 차단 목록
export const mypageBlockSnSArray: SortandSearchType[] = [
  {
    field: { name: "index" },
    type: "index",
    title: "번호",
    sort: { key: "", value: "" },
    search: { able: false },
  },

  {
    field: { name: "nickname" },
    type: "normal", // 값 그대로 적용
    title: "차단 당한 유저",
    sort: { key: "nickname", value: "asc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "blockDate" },
    type: "date", // 값 그대로 적용
    title: "차단 날짜",
    sort: { key: "blockDate", value: "desc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "unBlock" },
    type: "unBlock",
    title: "차단 해제",
    sort: { key: "", value: "" },
    search: { able: false },
  },
  {
    field: { name: "blockId" },
    type: "checkbox",
    title: "선택",
    sort: { key: "", value: "" },
    search: { able: false },
  },
];

// 마이 페이지 신고 목록
export const mypageReportSnSArray: SortandSearchType[] = [
  {
    field: { name: "index" },
    type: "index",
    title: "번호",
    sort: { key: "", value: "" },
    search: { able: false },
  },

  {
    field: { name: "postTitle" },
    type: "normal",
    title: "모집글",
    sort: { key: "postId.postTitle", value: "asc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "reportReason" },
    type: "normal",
    title: "신고유형",
    sort: { key: "reportType.reportReason", value: "asc" },
    search: {
      able: true,
      type: "select",
      enum: { R1: "음란", R2: "폭력", R3: "욕설", R4: "기타" },
    },
  },
  {
    field: { name: "reportDetail" },
    type: "normal",
    title: "신고 상세",
    sort: { key: "reportDetail", value: "asc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "reportDate" },
    type: "date",
    title: "신고 날짜",
    sort: { key: "reportDate", value: "desc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "reportFalse" },
    type: "reportResult",
    title: "신고처리여부",
    sort: { key: "reportFalse", value: "asc" },
    search: {
      able: true,
      type: "select",
      enum: { 0: "처리 중", 1: "허위 신고", 2: "처리 완료", 3: "중복 신고" },
    },
  },
];

// 마이 페이지 모집글 페이지
export const mypagePostSnsArry: SortandSearchType[] = [
  {
    field: { name: "index" },
    type: "index",
    title: "번호",
    sort: { key: "", value: "" },
    search: { able: false },
  },
  {
    field: { name: "postId" },
    type: "checkbox",
    title: "삭제",
    sort: { key: "", value: "" },
    search: { able: false },
  },
  {
    field: { name: "scheduleId", nested: ["scheduleId", "scheduleTitle"] },
    type: "nested",
    title: "일정",
    sort: { key: "postId", value: "asc" },
    search: { able: false, type: "normal" },
  },
  {
    field: { name: "postTitle" },
    type: "normal",
    title: "글제목",
    sort: { key: "postTitle", value: "asc" },
    search: {
      able: true,
      type: "normal",
    },
  },
  {
    field: { name: "postContent" },
    type: "normal",
    title: "글내용",
    sort: { key: "postContent", value: "asc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "personnel" },
    type: "normal",
    title: "모집인원",
    sort: { key: "personnel", value: "desc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "postDate" },
    type: "date", // 값 그대로 적용
    title: "등록날짜",
    sort: { key: "postDate", value: "desc" },
    search: { able: false, type: "normal" },
  },
  {
    field: { name: "postPic" },
    type: "image",
    title: "사진",
    sort: { key: "postPic", value: "desc" },
    search: { able: false },
  },
  {
    field: { name: "recruitStatus" },
    type: "normal",
    title: "모집상태",
    sort: { key: "recruitStatus", value: "desc" },
    search: {
      able: true,
      type: "select",
      enum: { true: "모집중", false: "모집완료" },
    },
  },
  {
    field: { name: "viewCount" },
    type: "normal",
    title: "조회수",
    sort: { key: "viewCount", value: "desc" },
    search: { able: true, type: "normal" },
  },
  {
    field: { name: "exposureStatus" },
    type: "normal",
    title: "노출 상태",
    sort: { key: "exposureStatus", value: "desc" },
    search: {
      able: true,
      type: "select",
      enum: { true: "노출중", false: "노출차단" },
    },
  },
];
