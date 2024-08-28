import Calendar from "pages/Planner/components/Calendar/Calendar";
import "./plannerPcCalender.css";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ColumnType } from "types/plan";

interface PlannerPcCalendarProps {
  year: number;
  month: number;
  setMonth: (value: number) => void;
  dates: Date[];
  setDates: (value: Date[]) => void;
  setSelectedDate: (value: Date) => void;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
}

const PlannerPcCalendar = ({
  year,
  month,
  setMonth,
  dates,
  setDates,
  setSelectedDate,
  columns,
  setColumns,
}: PlannerPcCalendarProps) => {
  return (
    <div className="planner-pc-calendars">
      <div className="planner-pc-calendars-month">
        <span className="month-before" />
        <span className="month-title">
          <span className="title-single">{`${month + 1}월`}</span>
          <span className="title-double">{`${month + 2}월`}</span>
        </span>
        <span className="month-after" />
      </div>
      <div className="planner-pc-calendars-container">
        <span className="calendar-backward" onClick={() => setMonth(month - 1)}>
          <LuChevronLeft />
        </span>
        <span className="calendar-pc-container">
          <span className="calendar-pc-container-single">
            <Calendar
              year={year}
              month={month}
              dates={dates}
              setDates={setDates}
              setSelectedDate={setSelectedDate}
              setColumns={setColumns}
            />
          </span>
          <span className="calendar-pc-container-double">
            <Calendar
              year={year}
              month={month + 1}
              dates={dates}
              setDates={setDates}
              setSelectedDate={setSelectedDate}
              columns={columns}
              setColumns={setColumns}
            />
          </span>
        </span>
        <span className="calendar-forward" onClick={() => setMonth(month + 1)}>
          <LuChevronRight />
        </span>
      </div>
    </div>
  );
};

export default PlannerPcCalendar;
