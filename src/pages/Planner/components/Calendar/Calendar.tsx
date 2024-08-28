import { ColumnType } from "types/plan";

import "./calendar.css";
import { convertDateTypeToDate2 } from "utilities/date";
import { CalcDatesOfMonth } from "pages/Planner/data/date";

export interface CalendarProps {
  year: number;
  month: number;
  dates: Date[];
  setDates: (value: Date[]) => void;
  setSelectedDate?: (value: Date) => void;
  columns?: { [key: string]: ColumnType[] };
  setColumns?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
}

const Calendar = ({
  year,
  month,
  dates,
  setDates,
  setSelectedDate,
  columns,
  setColumns,
}: CalendarProps) => {
  // 일 ~ 토
  const weekOfDay: string[] = ["일", "월", "화", "수", "목", "금", "토"];
  // 날짜
  const datesOfMonth = CalcDatesOfMonth(new Date(year, month, 1));

  // 오늘 날짜
  const today = new Date();

  // 선택한 날짜를 string으로 변환
  const stringDates: string[] = [];
  for (let i = 0; i < dates.length; i++) {
    const str = dates[i].toLocaleDateString();

    stringDates.push(str);
  }

  // 날짜를 선택하는 함수
  const SelectDate = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    selectedDate: Date
  ) => {
    e.stopPropagation();
    const newColumns = dates?.reduce((acc, date) => {
      // 현재 날짜를 기반으로 빈 배열을 할당
      acc[convertDateTypeToDate2(date)] = [];
      return acc;
    }, {} as Record<string, any>); // 새로운 객체를 생성
    // 첫 선택인 경우
    if (dates.length === 0) {
      setDates([selectedDate]);
      setColumns?.(newColumns);
      // 두 번째 선택인 경우
    } else if (dates.length === 1) {
      // 시작 날짜
      const start = dates[0];
      // 마지막 날짜 비교일
      const end = new Date(
        new Date(start).setDate(new Date(start).getDate() + 10)
      );
      // 시작 날짜보다 이전이거나 비교 날짜보다는 이후인 경우
      if (start > selectedDate || selectedDate > end) {
        // dates 배열을 새로 생성
        setDates([selectedDate]);
        setColumns?.(newColumns);
      } else {
        // 시작 날짜보다 이후이고 비교 날짜보다는 이전인 경우
        // 날짜 차이 계산
        const diff =
          (selectedDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        // 선택한 날짜 배열
        const selected = [];
        // 0부터 차이 나는 날짜까지의 날짜 생성하고 선택한 날짜 배열에 추가함
        for (let i = 0; i <= diff; i++) {
          const d = new Date(dates[0]);
          const e = new Date(new Date(d).setDate(new Date(d).getDate() + i));
          selected.push(e);
        }

        // 생성한 날짜 배열로 업데이트
        setDates([...selected]);
        setSelectedDate?.(start);
        setColumns?.(newColumns);
      }
    }
    // 이미 선택한 날짜 배열이 있는 경우
    else {
      setDates([selectedDate]);
      setColumns?.(newColumns);
    }
  };

  // 선택 가능 날짜 비교일
  const selectable =
    dates[0] &&
    new Date(new Date(dates[0]).setDate(new Date(dates[0]).getDate() + 10));

  return (
    <div className="calendar">
      <div className="calendar-grid">
        <ul className="calendar-grid-container">
          {weekOfDay.map((day, index) => (
            <li
              key={day}
              className={`calendar-grid-item${
                index % 7 === 0 ? " sunday" : index % 7 === 6 ? " saturday" : ""
              }`}
            >
              <div className="calendar-grid-item-content">{day}</div>
            </li>
          ))}

          {datesOfMonth.map((date, index) => (
            <li
              key={
                date > index + 1
                  ? `${year}${month - 1}${date}`
                  : `${year}${month}${date}`
              }
              className={`calendar-grid-item${
                date > index + 1
                  ? " prev-month"
                  : index % 7 === 0
                  ? " sunday"
                  : index % 7 === 6
                  ? " saturday"
                  : ""
              }${
                today.toLocaleDateString() ===
                new Date(year, month, date).toLocaleDateString()
                  ? " today"
                  : ""
              }${
                (date > index + 1 &&
                  stringDates.includes(
                    new Date(year, month - 1, date).toLocaleDateString()
                  )) ||
                (date <= index + 1 &&
                  stringDates.includes(
                    new Date(year, month, date).toLocaleDateString()
                  ))
                  ? " selected"
                  : ""
              }${
                (date > index + 1 &&
                  dates.length === 1 &&
                  dates[0] < new Date(year, month - 1, date)) ||
                (date <= index + 1 &&
                  dates.length === 1 &&
                  dates[0] < new Date(year, month, date) &&
                  new Date(year, month, date) < selectable)
                  ? " selectable"
                  : ""
              }`}
              onClick={
                date > index + 1
                  ? (e) => SelectDate(e, new Date(year, month - 1, date))
                  : (e) => SelectDate(e, new Date(year, month, date))
              }
            >
              <div className="calendar-grid-item-content">{date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
