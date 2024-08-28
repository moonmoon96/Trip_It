import "./schedulePcStages.css";
import { useState } from "react";
import { PlannerPcStagesProps } from "pages/Planner/PlannerPc/PlannerPcStages/PlannerPcStages";
import { useLocation, useNavigate } from "react-router-dom";
import SchedulePcUpdate from "./SchedulePcUpdate/SchedulePcUpdate";
import SchedulePcPlaces from "./SchedulePcPlaces/SchedulePcPlaces";
import SchedulePcCalendars from "./SchedulePcCalendar/SchedulePcCalendars";
import PlannerPcModal from "pages/Planner/components/PlannerPcModal/PlannerPcModal";
import { ScheduleDetailType, ScheduleType } from "types/schedule";
import { ModalMessageExtend } from "types/modal";
import { LuChevronLeft, LuChevronUp, LuX } from "react-icons/lu";
import { handleMoveTo, moveForward } from "pages/Schedule/Utilities/schedule";

export interface SchedulePcStageProps extends PlannerPcStagesProps {
  title: string;
  setTitle: (value: string) => void;
  schedule: ScheduleType;
  scheduleDetails: ScheduleDetailType[];
  requesting: boolean;
}

const SchedulePcStages = ({
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
  title,
  setTitle,
  schedule,
  scheduleDetails,
  requesting,
}: SchedulePcStageProps) => {
  const { hash, state } = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(true);
  const today = new Date();
  const year = today.getFullYear();
  const curMonth = today.getMonth();
  const [month, setMonth] = useState(curMonth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달 관련
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ModalMessageExtend>();
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
          className="schedule-pc-cover"
          onClick={() => setOpenMenu(!openMenu)}
        />
      )}
      <div
        className={`schedule-pc-stages${
          openMenu && hash === "#calendars"
            ? " calendars"
            : openMenu && hash === "#places"
            ? " places"
            : openMenu && (hash === "#update" || !hash)
            ? " update"
            : ""
        }`}
      >
        <div
          className={`schedule-pc-stages-header${openMenu ? "" : " close"}`}
          onClick={() => setOpenMenu(!openMenu)}
        >
          <span
            className="schedule-pc-stages-header-btn"
            onClick={(e) => moveForward(e, hash, navigate, state)}
          >
            {openMenu && (
              <p className="schedule-pc-stages-header-btn-icon">
                <LuChevronLeft />
              </p>
            )}
          </span>
          <span
            className={`schedule-pc-stages-header-title${
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
                  : " (일정 수정 중)"}
              </p>
            )}
          </span>
          <span className="schedule-pc-stages-header-btn">
            <p className="schedule-pc-stages-header-btn-icon">
              {openMenu ? (
                <p
                  title="목록으로"
                  onClick={() => navigate(`/mypage/schedules`)}
                >
                  <LuX />
                </p>
              ) : (
                <LuChevronUp />
              )}
            </p>
          </span>
        </div>
        <div className="schedule-pc-stages-menus">
          <li
            className={`schedule-pc-stages-menus-menu${
              hash === "#calendars" ? " active" : ""
            }`}
            onClick={() => navigate(`#calendars`, { state })}
          >
            날짜
          </li>
          <li
            className={`schedule-pc-stages-menus-menu${
              hash === "#places" ? " active" : ""
            }`}
            onClick={() =>
              handleMoveTo(
                `#places`,
                dates,
                columns,
                navigate,
                state,
                setOpen,
                setMessage
              )
            }
          >
            장소
          </li>
          <li
            className={`schedule-pc-stages-menus-menu${
              hash === "#update" || !hash ? " active" : ""
            } `}
            onClick={() =>
              handleMoveTo(
                `#update`,
                dates,
                columns,
                navigate,
                state,
                setOpen,
                setMessage
              )
            }
          >
            등록
          </li>
        </div>
        <div className="schedule-pc-stages-main">
          {hash === "#calendars" ? (
            <SchedulePcCalendars
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
            <div className="schedule-pc-stages-main-places">
              <SchedulePcPlaces
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
            <SchedulePcUpdate
              key={`update`}
              metroId={metroId}
              columns={columns}
              setColumns={setColumns}
              dates={dates}
              selectedDate={date}
              setDate={setDate}
              setOpenMenu={setOpenMenu}
              allInfos={allInfos}
              title={title}
              setTitle={setTitle}
              schedule={schedule}
              scheduleDetails={scheduleDetails}
              requesting={requesting}
              setOpen={setOpen}
              setMessage={setMessage}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SchedulePcStages;
