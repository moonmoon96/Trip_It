import { Dispatch, SetStateAction, useState } from "react";
import "./plannerCalendar.css";

import { useNavigate } from "react-router-dom";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import Calendar from "pages/Planner/components/Calendar/Calendar";

export interface PlannerCalendarProps {
  dates: Date[];
  setDates: Dispatch<SetStateAction<Date[]>>;
}
const PlannerCalendar = ({ dates, setDates }: PlannerCalendarProps) => {
  const navigate = useNavigate();

  const today = new Date();
  const year = today.getFullYear();
  const curMonth = today.getMonth();

  const [month, setMonth] = useState(curMonth);

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
    <div className="planner-calendar">
      <section className="planner-calendar-title">
        <h3>날짜 설정</h3>
      </section>
      <section className="planner-calendar-month">
        <span
          className="plan-calendar-main-month-prev"
          onClick={() => setMonth(month - 1)}
        >
          <IoIosArrowDropleft />
        </span>
        <span className="plan-calendar-main-month-current">{month + 1}월</span>
        <span
          className="plan-calendar-main-month-next"
          onClick={() => setMonth(month + 1)}
        >
          <IoIosArrowDropright />
        </span>
      </section>
      <section
        className="planner-calendar-main"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Calendar year={year} month={month} dates={dates} setDates={setDates} />
      </section>
      <section className="planner-calendar-btns">
        <button
          className="planner-calendar-btns-btn backward"
          onClick={() => navigate("/planner")}
        >
          이전
        </button>
        <button
          className={`planner-calendar-btns-btn${
            dates.length > 1 ? " forward" : ""
          }`}
          onClick={() => navigate("#place")}
        >
          다음
        </button>
      </section>
    </div>
  );
};

export default PlannerCalendar;
