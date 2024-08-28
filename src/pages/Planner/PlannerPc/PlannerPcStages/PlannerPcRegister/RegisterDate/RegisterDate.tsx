import "./registerDate.css";
import { convertDateTypeToDate1, convertDateTypeToDate2 } from "utilities/date";
import PlannerPcRegisterCard from "../components/PlannerPcRegisterCard";
import { ColumnType } from "types/plan";
import React, { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { handleShowMap } from "pages/Planner/PlannerPc/utilities/plannerPc";

export interface PlannerPcRegisterCardProps {
  index: number;
  curDate: Date;
  selectedDate: Date;
  setDate: (value: Date) => void;
  dates: Date[];
  metroId: string;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
  column: ColumnType[];
  dragOver: (e: React.DragEvent<HTMLLIElement>) => void;
  dragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  dragEnd: (
    e: React.DragEvent<HTMLLIElement>,
    setDroppable: (value: string[]) => void
  ) => void;
  drop: (
    e: React.DragEvent<HTMLLIElement>,
    columns: { [key: string]: ColumnType[] },
    setColumns: React.Dispatch<
      React.SetStateAction<{
        [key: string]: ColumnType[];
      }>
    >,
    setDroppable: (value: string[]) => void
  ) => void;
  droppable: string[];
  setDroppable: (value: string[]) => void;
  handleDateDragStart: (
    e: React.DragEvent<HTMLElement>,
    droppable: string[]
  ) => void;
  handleDateDragOver: (e: React.DragEvent<HTMLElement>) => void;
  handleDateDragEnd: (e: React.DragEvent<HTMLElement>) => void;
  handleDateDrop: (
    e: React.DragEvent<HTMLElement>,
    columns: { [key: string]: ColumnType[] },
    setColumns: React.Dispatch<
      React.SetStateAction<{
        [key: string]: ColumnType[];
      }>
    >
  ) => void;
  setOpenMenu: (value: boolean) => void;
  setPlanValid: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  infos: (
    | { distance: number | string; duration: number | string }
    | undefined
  )[];
  requesting?: boolean;
}
const RegisterDate = ({
  index,
  setOpenMenu,
  curDate,
  selectedDate,
  setDate,
  dates,
  metroId,
  column,
  columns,
  setColumns,
  dragStart,
  dragOver,
  dragEnd,
  drop,
  droppable,
  setDroppable,
  handleDateDragStart,
  handleDateDragOver,
  handleDateDragEnd,
  handleDateDrop,
  setPlanValid,
  infos,
  requesting,
}: PlannerPcRegisterCardProps) => {
  // 이동 효과 관련
  const [moveClassGroup, setMoveClassGroup] = useState<string[]>([]);
  const [moveOrderGroup, setMoveOrderGroup] = useState<number[]>([]);
  const [valid, setValid] = useState(true);
  const [warning, setWarning] = useState("");
  const selected =
    convertDateTypeToDate1(selectedDate) === convertDateTypeToDate1(curDate);

  useEffect(() => {
    const countOfTours = column.filter(
      (item) => item.place.contenttypeid !== "32"
    ).length;

    const countOfAccommos = column.filter(
      (item) => item.place.contenttypeid === "32"
    ).length;

    let newValid = countOfTours >= 1 && countOfAccommos >= 1;
    let newWarning = newValid
      ? ""
      : countOfTours < 1
      ? "관광지를 선택해주세요."
      : "숙소를 선택해주세요.";

    if (valid !== newValid || warning !== newWarning) {
      setValid(newValid);
      setWarning(newWarning);
    }
  }, [column, valid, warning]);

  useEffect(() => {
    const dateKey = convertDateTypeToDate2(curDate);
    setPlanValid((prev) => {
      if (prev[dateKey] !== valid) {
        return {
          ...prev,
          [dateKey]: valid,
        };
      }
      return prev;
    });
  }, [curDate, valid]);

  return (
    <section
      className={`planner-pc-register-plan-date-item${
        selected ? " selected" : ""
      }${!requesting ? "" : valid ? "" : " invalid"}`}
      key={convertDateTypeToDate2(curDate)}
    >
      <div
        className="planner-pc-register-plan-date-item-title"
        onClick={() => setDate(curDate)}
        draggable={column.length !== 0}
        data-row={convertDateTypeToDate2(curDate)}
        onDragStart={(e) => handleDateDragStart(e, droppable)}
        onDragEnd={(e) => handleDateDragEnd(e)}
        onDragOver={(e) => handleDateDragOver(e)}
        onDrop={(e) => handleDateDrop(e, columns, setColumns)}
      >
        <p className="planner-pc-register-plan-date-item-title-name">{`Day${
          index + 1
        } : ${convertDateTypeToDate1(curDate)}`}</p>
        <p
          className="planner-pc-register-plan-date-item-title-map"
          onClick={() => handleShowMap(curDate, setDate, setOpenMenu)}
        >
          지도 보기
        </p>
      </div>
      <ul className="planner-pc-register-plan-date-item-container">
        {!requesting && column.length !== 0 && warning && (
          <li className="planner-pc-register-plan-date-item-warning">
            {warning}
          </li>
        )}

        {column.length === 0 || requesting ? (
          <li className="planner-pc-register-plan-date-item-requesting">
            <span className={`icon${requesting ? " requesting" : ""}`}>
              <LuLoader2 />
            </span>
          </li>
        ) : (
          !requesting &&
          column.length === 0 && (
            <li
              className="planner-pc-register-card-cover"
              data-row={convertDateTypeToDate2(curDate)}
              data-col={0}
              onDragOver={(e) => dragOver(e)}
              onDragStart={(e) => dragStart(e)}
              onDragEnd={(e) => dragEnd(e, setDroppable)}
              onDrop={(e) => drop(e, columns, setColumns, setDroppable)}
            >
              <p className="planner-pc-register-card-noplace">
                장소를 선택해주세요
              </p>
            </li>
          )
        )}
        {column.length !== 0 && !requesting && (
          <li
            className={`planner-pc-register-card-indicator${
              droppable[0] === convertDateTypeToDate2(curDate) &&
              droppable[1] === "0"
                ? " droppable"
                : ""
            }`}
            data-row={convertDateTypeToDate2(curDate)}
            data-col={0}
            onDragOver={(e) => dragOver(e)}
            onDragStart={(e) => dragStart(e)}
            onDragEnd={(e) => dragEnd(e, setDroppable)}
            onDrop={(e) => drop(e, columns, setColumns, setDroppable)}
          ></li>
        )}

        {column.map((item, index, arr) => (
          <PlannerPcRegisterCard
            key={`${item.place.contentid}_${index}`}
            column={column}
            order={index}
            curDate={curDate}
            dates={dates}
            detail={item}
            metroId={metroId}
            columns={columns}
            setColumns={setColumns}
            moveClassGroup={moveClassGroup}
            setMoveClassGroup={setMoveClassGroup}
            moveOrderGroup={moveOrderGroup}
            setMoveOrderGroup={setMoveOrderGroup}
            index={index}
            dragStart={dragStart}
            dragOver={dragOver}
            dragEnd={dragEnd}
            drop={drop}
            droppable={droppable}
            setDroppable={setDroppable}
            infos={infos}
          />
        ))}
      </ul>
    </section>
  );
};

export default RegisterDate;
