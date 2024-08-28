import { useEffect, useState } from "react";
import "./plannerPcStages.css";
import { LuChevronLeft, LuChevronUp, LuX } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { ColumnType } from "types/plan";
import PlannerPcPlaces from "./PlannerPcPlaces/PlannerPcPlaces";
import { convertDateTypeToDate2 } from "utilities/date";
import PlannerPcCalendar from "./PlannerPcCalender/PlannerPcCalendar";
import PlannerPcRegister from "./PlannerPcRegister/PlannerPcRegister";
import { InfoType } from "../PlannerPc";
import { handleMoveTo, moveForward } from "../utilities/plannerPc";
import PlannerPcModal from "pages/Planner/components/PlannerPcModal/PlannerPcModal";
import { ModalMessageExtend, ModalMessageType } from "types/modal";

export interface PlannerPcStagesProps {
  metroId: string;
  setSelectedDate: (value: Date) => void;
  dates: Date[];
  setDates: (value: Date[]) => void;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
  date: Date;
  setDate: (value: Date) => void;
  infos: (
    | { distance: number | string; duration: number | string }
    | undefined
  )[];
  allInfos: {
    [key: string]: (InfoType | undefined)[];
  };
}

const PlannerPcStages = ({
  metroId,
  setSelectedDate,
  dates,
  setDates,
  columns,
  setColumns,
  date,
  setDate,
  infos,
  allInfos,
}: PlannerPcStagesProps) => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(true);
  const today = new Date();
  const year = today.getFullYear();
  const curMonth = today.getMonth();
  const [month, setMonth] = useState(curMonth);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달 관련
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ModalMessageExtend>();

  useEffect(() => {
    dates.forEach((date) => {
      columns[convertDateTypeToDate2(date)] = [];
    });
  }, [dates]);

  return (
    <>
      <PlannerPcModal
        open={open}
        setOpen={setOpen}
        message={message}
        setMessage={setMessage}
        title={title}
        dates={dates}
        setIsSubmitting={setIsSubmitting}
        columns={columns}
        metroId={metroId}
      />
      {openMenu && (
        <div
          className="planner-pc-cover"
          onClick={() => setOpenMenu(!openMenu)}
        />
      )}
      <div
        className={`planner-pc-stages${
          openMenu && (hash === "#calendars" || !hash)
            ? " calendars"
            : openMenu && hash === "#places"
            ? " places"
            : openMenu && hash === "#register"
            ? " register"
            : ""
        }`}
      >
        <div
          className={`planner-pc-stages-header${openMenu ? "" : " close"}`}
          onClick={() => setOpenMenu(!openMenu)}
        >
          <span
            className="planner-pc-stages-header-btn"
            onClick={(e) => moveForward(e, hash, navigate)}
          >
            {openMenu && (
              <p className="planner-pc-stages-header-btn-icon">
                <LuChevronLeft />
              </p>
            )}
          </span>
          <span
            className={`planner-pc-stages-header-title${
              openMenu ? "" : " close"
            }`}
          >
            <p>일정</p>
            {!openMenu && (
              <p>
                {hash === "#calendars"
                  ? " (날짜 선택 중)"
                  : hash === "#places"
                  ? " (장소 선택 중)"
                  : " (일정 등록 중)"}
                {" - " + convertDateTypeToDate2(date)}
              </p>
            )}
          </span>
          <span className="planner-pc-stages-header-btn">
            <p className="planner-pc-stages-header-btn-icon">
              {openMenu ? <LuX /> : <LuChevronUp />}
            </p>
          </span>
        </div>
        <div className="planner-pc-stages-menus">
          <li
            className={`planner-pc-stages-menus-menu${
              hash === "#calendars" || !hash ? " active" : ""
            }`}
            onClick={() => navigate(`#calendars`)}
          >
            날짜
          </li>
          <li
            className={`planner-pc-stages-menus-menu${
              hash === "#places" ? " active" : ""
            }`}
            onClick={() =>
              handleMoveTo(
                `#places`,
                dates,
                columns,
                navigate,
                setOpen,
                setMessage
              )
            }
          >
            장소
          </li>
          <li
            className={`planner-pc-stages-menus-menu${
              hash === "#register" ? " active" : ""
            } `}
            onClick={() =>
              handleMoveTo(
                `#register`,
                dates,
                columns,
                navigate,
                setOpen,
                setMessage
              )
            }
          >
            등록
          </li>
        </div>
        <div className="planner-pc-stages-main">
          {!hash || hash === "#calendars" ? (
            <PlannerPcCalendar
              key={`calenders`}
              year={year}
              month={month}
              setMonth={setMonth}
              dates={dates}
              setDates={setDates}
              setSelectedDate={setSelectedDate}
              columns={columns}
              setColumns={setColumns}
            />
          ) : hash === "#places" ? (
            <div className="planner-pc-stages-main-places">
              <PlannerPcPlaces
                key={`places`}
                metroId={metroId}
                date={date}
                setDate={setDate}
                dates={dates}
                columns={columns}
                setColumns={setColumns}
                infos={infos}
              />
            </div>
          ) : (
            <PlannerPcRegister
              key={`register`}
              metroId={metroId}
              columns={columns}
              setColumns={setColumns}
              dates={dates}
              selectedDate={date}
              setDate={setDate}
              setOpenMenu={setOpenMenu}
              allInfos={allInfos}
              setOpen={setOpen}
              setMessage={setMessage}
              title={title}
              setTitle={setTitle}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PlannerPcStages;
