import { useState } from "react";
import "./plannerCalendarAccordian.css";
import {
  IoIosArrowDropleft,
  IoIosArrowDropright,
  IoIosArrowDropup,
} from "react-icons/io";
import { convertDateTypeToDate1 } from "utilities/date";
import Calendar from "pages/Planner/components/Calendar/Calendar";

export interface PlannerInfoAccordianProps {
  openAccordian: string;
  handleOpenAccordian: (value: string) => void;
  dates: Date[];
  setDates: (value: Date[]) => void;
}

const PlannerCalendarAccordian = ({
  openAccordian,
  handleOpenAccordian,
  dates,
  setDates,
}: PlannerInfoAccordianProps) => {
  const today = new Date();
  const year = today.getFullYear();
  const curMonth = today.getMonth();
  const date = today.getDate();
  const [month, setMonth] = useState(curMonth);

  const startDate = dates.length > 1 ? convertDateTypeToDate1(dates[0]) : "";

  const endDate =
    dates.length > 1 ? convertDateTypeToDate1(dates[dates.length - 1]) : "";

  const handleMonth = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    month: number
  ) => {
    e.stopPropagation();
    setMonth(month);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.touches[0].clientX;
    const touchDiff = touchStartX - touchEndX;

    if (Math.abs(touchDiff) > 100) {
      // 터치 이동 거리가 100픽셀 이상일 때
      if (touchDiff > 0) {
        // 오른쪽에서 왼쪽으로 스크롤 (다음 달로 이동)
        setMonth((prevMonth) => (prevMonth + 1) % 12);
      } else {
        // 왼쪽에서 오른쪽으로 스크롤 (이전 달로 이동)
        setMonth((prevMonth) => (prevMonth - 1 + 12) % 12);
      }
      setTouchStartX(null); // 터치 시작 위치 리셋
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  return (
    <section
      className={`planner-places-accordian-calendar${
        openAccordian === "calendar"
          ? " active"
          : dates.length > 1
          ? " completed"
          : ""
      }`}
      onClick={() => handleOpenAccordian("calendar")}
    >
      <div className="planner-places-accordian-calendar-title">
        <span className="planner-places-accordian-calendar-title-container">
          <p className="planner-places-accordian-calendar-title-name">
            날짜 선택
          </p>
          <p className="planner-places-accordian-calendar-title-detail">
            {`( ${
              dates.length > 1
                ? "기간 : " + startDate + "~" + endDate
                : "기간 : 선택전"
            } )`}
          </p>
        </span>

        <p
          className={`planner-places-accordian-calendar-title-icon${
            openAccordian === "calendar" ? " active" : ""
          }`}
        >
          <IoIosArrowDropup />
        </p>
      </div>
      <ul
        className={`planner-places-accordian-calendar-container${
          openAccordian === "calendar" ? " active" : ""
        }`}
      >
        <ul className="planner-places-accordian-calendar-month">
          <span
            className="planner-places-accordian-calendar-month-prev"
            onClick={(e) => handleMonth(e, month - 1)}
          >
            <IoIosArrowDropleft />
          </span>
          <span className="planner-places-accordian-calendar-month-current">
            {month + 1}월
          </span>
          <span
            className="planner-places-accordian-calendar-month-next"
            onClick={(e) => handleMonth(e, month + 1)}
          >
            <IoIosArrowDropright />
          </span>
        </ul>
        <ul
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Calendar
            year={year}
            month={month}
            dates={dates}
            setDates={setDates}
          />
        </ul>
      </ul>
    </section>
  );
};

export default PlannerCalendarAccordian;
