import {
  convertDateToYYYYMMDD,
  convertDateTypeToDate1,
  convertDateTypeToDate2,
} from "utilities/date";
import "./plannerPcRegister.css";
import { LuChevronRight, LuLoader2 } from "react-icons/lu";
import { ColumnType, ScheduleDetailDtoInputType } from "types/plan";
import { useCallback, useEffect, useState } from "react";
import { useRenderCount } from "@uidotdev/usehooks";
import RegisterDate from "./RegisterDate/RegisterDate";
import { saveScheduleAPI } from "apis/schedule";
import { useNavigate } from "react-router-dom";
import { InfoType } from "../../PlannerPc";
import {
  deleteAll,
  dragEnd,
  dragStart,
  drop,
  handleDateDragEnd,
  handleDateDragStart,
  handleDateDrop,
  handleSubmit,
  handleTitle,
} from "../../utilities/plannerPc";
import { ModalMessageExtend, ModalMessageType } from "types/modal";

interface PlannerPcRegisterProps {
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
  setOpen: (value: boolean) => void;
  setMessage: React.Dispatch<
    React.SetStateAction<ModalMessageExtend | undefined>
  >;
  title: string;
  setTitle: (value: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const PlannerPcRegister = ({
  metroId,
  columns,
  setColumns,
  dates,
  selectedDate,
  setDate,
  setOpenMenu,
  allInfos,
  setOpen,
  setMessage,
  title,
  setTitle,
  isSubmitting,
  setIsSubmitting,
}: PlannerPcRegisterProps) => {
  const renderCount = useRenderCount();
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);

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

  console.log("렌더링 횟수", renderCount);

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

  // 카드 dragOver
  const dragOver = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // 기본 동작 방지
    e.stopPropagation();

    // 현재 드래그 대상의 데이터 가져오기
    const newCol = e.currentTarget.dataset.col;
    const newRow = e.currentTarget.dataset.row;

    // 데이터가 모두 있는지 확인
    if (!newCol || !newRow) return;

    // 현재 상태와 같은 경우 업데이트를 방지
    setDroppable((prev) => {
      const [prevRow, prevCol] = prev;
      if (prevRow === newRow && prevCol === newCol) return prev;
      return [newRow, newCol];
    });
  }, []);

  // 날짜 dragOver
  const handleDateDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (droppable.length !== 0) return;

    const newRow = e.currentTarget.dataset.row;

    if (!newRow) return;
  }, []);

  const askSubmit = (
    setOpen: (value: boolean) => void,
    setMessage: React.Dispatch<
      React.SetStateAction<ModalMessageExtend | undefined>
    >
  ) => {
    if (localStorage.key(0) === null) {
      setOpen(true);
      setMessage({
        type: "alert",
        theme: "login",
        msgs: {
          title: "일정을 등록하려면 로그인이 필요합니다.",
          detail: "",
        },
      });
      return;
    }

    if (
      (localStorage.key(0) !== null &&
        localStorage.getItem("role") === "ROLE_A") ||
      localStorage.getItem("role") === "ROLE_B" ||
      localStorage.getItem("role") === "ROLE_C"
    ) {
      setOpen(true);
      setMessage({
        type: "alert",
        theme: "prohibit",
        msgs: {
          title: "일정 등록이 금지되어있는 회원입니다.",
          detail: "활동 금지 종료 후 이용해주세요.",
        },
      });
      return;
    }
    setOpen(true);
    setMessage({
      type: "confirm",
      theme: "submit",
      msgs: {
        title: `일정을 등록하시겠습니까?`,
        detail: "",
      },
    });
  };
  return (
    <div className="planner-pc-register">
      <div className="planner-pc-register-content">
        <div className="planner-pc-register-header">
          <div
            className="planner-pc-register-header-title"
            onClick={() => setOpenHeader(!openHeader)}
          >
            <span className="planner-pc-register-header-title-name">
              <span
                className={`planner-pc-register-header-title-icon${
                  openHeader ? " open" : ""
                }`}
              >
                <LuChevronRight />
              </span>
              제목<span style={{ color: "red" }}>*</span>
            </span>
          </div>
          <div
            className={`planner-pc-register-header-container${
              openHeader ? " open" : ""
            }`}
          >
            <div className="planner-pc-register-header-example">
              <p className="example"> ex. 인천 일정 </p>
              <p className="validation"> 최소 2개 이상 50 이내</p>
            </div>
            <div className="planner-pc-register-header-text">
              <input
                type="text"
                className="planner-pc-register-header-textbox"
                value={title}
                onChange={(e) =>
                  handleTitle(e, setValid, setTitle, setOpen, setMessage)
                }
              />
              <span className="planner-pc-register-header-title-detail">
                {title.length}/50
              </span>
            </div>
          </div>
        </div>

        <div className="planner-pc-register-plan">
          <div
            className="planner-pc-register-plan-title"
            onClick={() => setOpenPlan(!openPlan)}
          >
            <span className="planner-pc-register-plan-title-left">
              <span
                className={`planner-pc-register-plan-title-icon${
                  openPlan ? " open" : ""
                }`}
              >
                <LuChevronRight />
              </span>
              <span className="planner-pc-register-plan-title-name">일정</span>
            </span>

            {openPlan && (
              <span className="planner-pc-register-plan-title-right">
                <p
                  className="planner-pc-register-plan-title-delete"
                  onClick={() => deleteAll(dates, setColumns, navigate)}
                >
                  모든 일정 삭제하기
                </p>
              </span>
            )}
          </div>

          <div
            className={`planner-pc-register-plan-container${
              openPlan ? " open" : ""
            }`}
          >
            <div className="planner-pc-register-plan-date-container">
              {dates.map((item, index) => {
                const column = columns[convertDateTypeToDate2(item)];
                const infos = allInfos[convertDateTypeToDate2(item)];
                return column.length === 0 ? (
                  <li key={"empty"}></li>
                ) : (
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
                    setDroppable={setDroppable}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="planner-pc-register-btn">
          <button
            className={`register-btn${
              valid && Object.values(planValid).every(Boolean) ? "-valid" : ""
            }${isSubmitting ? " submitting" : ""}`}
            onClick={
              valid && Object.values(planValid).every(Boolean)
                ? () => askSubmit(setOpen, setMessage)
                : undefined
            }
          >
            <span>
              {isSubmitting ? (
                <span className="icon submitting">
                  <LuLoader2 />
                </span>
              ) : (
                "일정 등록 하기"
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerPcRegister;
