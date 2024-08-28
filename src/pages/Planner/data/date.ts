// 날짜는 자정 시간으로 고정
export const dateMidFormatter = (origin: Date) =>
  new Date(origin.setHours(0, 0, 0, 0));

// 달에 따른 날짜 계산하기
// 한 달전 날짜
export const monthAgo = (origin: Date) =>
  dateMidFormatter(new Date(origin.setMonth(origin.getMonth() - 1)));
// 이 달
export const curMonth = (origin: Date) => dateMidFormatter(origin);
// 다음달 날짜
export const monthLater = (origin: Date) =>
  dateMidFormatter(new Date(origin.setMonth(origin.getMonth() + 1)));

// 날짜 분해하기
export const destrucDate = (origin: Date) => {
  const year = origin.getFullYear();
  const month = origin.getMonth();
  const date = origin.getDate();

  return { year, month, date };
};

// 달의 마지막 날 구하기
const lastDayOfMonth = (origin: Date) => {
  const date = destrucDate(origin);

  return new Date(date.year, date.month + 1, 0).getDate();
};

// 달의 첫번째날 요일 구하기
const weekOfFirstDay = (origin: Date) => {
  const date = destrucDate(origin);

  return new Date(date.year, date.month, 1).getDay();
};

// 달의 날짜 구하기
export const CalcDatesOfMonth = (origin: Date) => {
  const dates: number[] = [];

  const date = dateMidFormatter(origin);

  const firstDay = weekOfFirstDay(date);
  const lastDate = lastDayOfMonth(date);
  const lastDateOfLastMonth = lastDayOfMonth(monthAgo(date));

  // 첫날이 일요일 아닌 경우 지난 달의 날짜 추가하기
  if (firstDay !== 0) {
    for (let i = firstDay - 1; i >= 0; i--) {
      const lastMonthDate = lastDateOfLastMonth - i;
      dates.push(lastMonthDate);
    }
  }

  for (let i = 1; i <= lastDate; i++) {
    dates.push(i);
  }

  return dates;
};
