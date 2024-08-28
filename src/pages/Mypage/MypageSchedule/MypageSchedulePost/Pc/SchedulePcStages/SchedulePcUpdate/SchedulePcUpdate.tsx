import "./schedulePcUpdate.css";
import { convertDateToYYYYMMDD, convertDateTypeToDate2 } from "utilities/date";
import { ColumnType } from "types/plan";
import { useCallback, useEffect, useState } from "react";
import { useRenderCount } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import { InfoType } from "pages/Planner/PlannerPc/PlannerPc";
import RegisterDate from "pages/Planner/PlannerPc/PlannerPcStages/PlannerPcRegister/RegisterDate/RegisterDate";
import { ScheduleDetailType, ScheduleType } from "types/schedule";
import {
  deleteAll,
  dragEnd,
  dragStart,
  drop,
  handleDateDragEnd,
  handleDateDragStart,
  handleDateDrop,
  handleTitle,
} from "pages/Planner/PlannerPc/utilities/plannerPc";
import { handleUpdate } from "pages/Schedule/Utilities/schedule";
import { ModalMessageExtend } from "types/modal";
import { LuChevronRight, LuLoader2 } from "react-icons/lu";

interface SchedulePcUpdateProps {
  metroId: string;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
  dates: Date[];
  selectedDate: Date;
  setDate: (value: Date) => void;
  setOpenMenu: (value: boolean) => void;
  allInfos: {
    [key: string]: (InfoType | undefined)[];
  };
  title: string;
  setTitle: (value: string) => void;
  schedule: ScheduleType;
  scheduleDetails: ScheduleDetailType[];
  requesting: boolean;
  setOpen: (value: boolean) => void;
  setMessage: React.Dispatch<
    React.SetStateAction<ModalMessageExtend | undefined>
  >;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const SchedulePcUpdate = ({
  metroId,
  columns,
  setColumns,
  dates,
  selectedDate,
  setDate,
  setOpenMenu,
  allInfos,
  schedule,
  scheduleDetails,
  requesting,
  setOpen,
  setMessage,
  isSubmitting,
  setIsSubmitting,
}: SchedulePcUpdateProps) => {
  const renderCount = useRenderCount();
  const navigate = useNavigate();
  const [valid, setValid] = useState(true);
  const [title, setTitle] = useState(schedule.scheduleTitle);

  const planValidObj: Record<string, boolean> = dates.reduce((acc, date) => {
    const dateString = convertDateTypeToDate2(date);
    acc[dateString] = true; // 문자열을 키로, false를 값으로 설정
    return acc;
  }, {} as Record<string, boolean>);
  const [planValid, setPlanValid] =
    useState<Record<string, boolean>>(planValidObj);

  const [openHeader, setOpenHeader] = useState(true);
  const [openPlan, setOpenPlan] = useState(true);
  const [droppable, setDroppable] = useState<string[]>([]);
  const [changed, setChanged] = useState(false);

  console.log("렌더링 횟수", renderCount);

  // 변경된 것이 있는지 확인
  useEffect(() => {
    const start = convertDateToYYYYMMDD(dates[0]);
    const end = convertDateToYYYYMMDD(dates[dates.length - 1]);

    // 제목 변경 여부 확인
    if (schedule.scheduleTitle !== title) {
      console.log("제목 바뀜");
      setChanged(true);
      return;
    }
    // 날짜 변경 여부 확인
    if (schedule.startDate !== start || schedule.endDate !== end) {
      setChanged(true);
      console.log("날짜 바뀜");
      return;
    }

    // 일정 세부사항이 변경된 경우
    const hasChanges = Object.values(columns)
      .flat()
      .some((item, index) => {
        const detail = scheduleDetails[index];
        return (
          item.scheduleOrder !== detail.scheduleOrder ||
          item.startTime !== detail.startTime ||
          item.endTime !== detail.endTime ||
          item.place.contentid !== detail.contentId
        );
      });

    if (hasChanges) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [columns, dates, title]);

  const countPlaces = (date: Date) => {
    const column = columns[convertDateTypeToDate2(date)];

    const count = column.filter(
      (col) => col.place.contenttypeid !== "32"
    ).length;

    return count;
  };

  const countAccommos = (date: Date) => {
    const column = columns[convertDateTypeToDate2(date)];

    const count = column.filter(
      (col) => col.place.contenttypeid === "32"
    ).length;

    return count;
  };

  const dragOver = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // 기본 동작 방지
    e.stopPropagation();

    // 현재 드래그 대상의 데이터 가져오기
    const newCol = e.currentTarget.dataset.col;
    const newRow = e.currentTarget.dataset.row;

    console.log(newCol, newRow);

    // 데이터가 모두 있는지 확인
    if (!newCol || !newRow) return;

    // 현재 상태와 같은 경우 업데이트를 방지
    setDroppable((prev) => {
      const [prevRow, prevCol] = prev;
      if (prevRow === newRow && prevCol === newCol) return prev;
      return [newRow, newCol];
    });
  }, []);

  const handleDateDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (droppable.length !== 0) return;

    const newRow = e.currentTarget.dataset.row;

    if (!newRow) return;
  }, []);

  return (
    <div className="schedule-pc-update">
      <div className="schedule-pc-update-content">
        <div className="schedule-pc-update-header">
          <div
            className="schedule-pc-update-header-title"
            onClick={() => setOpenHeader(!openHeader)}
          >
            <span className="schedule-pc-update-header-title-name">
              <span
                className={`schedule-pc-update-header-title-icon${
                  openHeader ? " open" : ""
                }`}
              >
                <LuChevronRight />
              </span>
              제목<span style={{ color: "red" }}>*</span>
            </span>
          </div>
          <div
            className={`schedule-pc-update-header-container${
              openHeader ? " open" : ""
            }`}
          >
            <div className="schedule-pc-update-header-example">
              <p className="example"> ex. 인천 일정 </p>
              <p className="validation"> 최소 2개 이상 50 이내</p>
            </div>
            <div className="schedule-pc-update-header-text">
              <input
                type="text"
                className="schedule-pc-update-header-textbox"
                defaultValue={title}
                onChange={(e) =>
                  handleTitle(e, setValid, setTitle, setOpen, setMessage)
                }
              />
              <span className="schedule-pc-update-header-title-detail">
                {title.length}/50
              </span>
            </div>
          </div>
        </div>

        <div className="schedule-pc-update-plan">
          <div
            className="schedule-pc-update-plan-title"
            onClick={() => setOpenPlan(!openPlan)}
          >
            <span className="schedule-pc-update-plan-title-left">
              <span
                className={`schedule-pc-update-plan-title-icon${
                  openPlan ? " open" : ""
                }`}
              >
                <LuChevronRight />
              </span>
              <span className="schedule-pc-update-plan-title-name">일정</span>
            </span>

            {openPlan && (
              <span className="schedule-pc-update-plan-title-right">
                <p
                  className="schedule-pc-update-plan-title-delete"
                  onClick={() => deleteAll(dates, setColumns, navigate)}
                >
                  모든 일정 삭제하기
                </p>
              </span>
            )}
          </div>

          <div
            className={`schedule-pc-update-plan-container${
              openPlan ? " open" : ""
            }`}
          >
            <div className="schedule-pc-update-plan-date-container">
              {dates.map((item, index) => {
                const column = columns[convertDateTypeToDate2(item)] || [];
                const infos = allInfos[convertDateTypeToDate2(item)] || [];

                return (
                  <RegisterDate
                    key={convertDateTypeToDate2(item)}
                    setOpenMenu={setOpenMenu}
                    index={index}
                    curDate={item}
                    selectedDate={selectedDate}
                    setDate={setDate}
                    dates={dates}
                    metroId={metroId}
                    column={column}
                    columns={columns}
                    setColumns={setColumns}
                    dragStart={dragStart}
                    dragOver={dragOver}
                    dragEnd={dragEnd}
                    drop={drop}
                    droppable={droppable}
                    handleDateDragStart={handleDateDragStart}
                    handleDateDragOver={handleDateDragOver}
                    handleDateDragEnd={handleDateDragEnd}
                    handleDateDrop={handleDateDrop}
                    setPlanValid={setPlanValid}
                    infos={infos}
                    requesting={requesting}
                    setDroppable={setDroppable}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="schedule-pc-update-btn">
          <button
            className={`register-btn${
              valid && Object.values(planValid).every(Boolean) && changed
                ? "-valid"
                : ""
            }${isSubmitting ? " submitting" : ""}`}
            onClick={
              valid && Object.values(planValid).every(Boolean) && changed
                ? () =>
                    handleUpdate(
                      title,
                      dates,
                      setIsSubmitting,
                      columns,
                      metroId,
                      navigate,
                      schedule,
                      scheduleDetails,
                      setValid
                    )
                : undefined
            }
          >
            <span>
              {isSubmitting ? (
                <span className="icon submitting">
                  <LuLoader2 />
                </span>
              ) : (
                "일정 수정 하기"
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePcUpdate;
