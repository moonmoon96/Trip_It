import "./plannerDateAccordian.css";
import { IoIosArrowDropup } from "react-icons/io";
import { ColumnType } from "types/plan";
import { convertDateTypeToDate2 } from "utilities/date";
import PlannerDateCard from "../PlannerCards/PlannerDateCard";
import React, { useState } from "react";
import MapCluster from "pages/Planner/components/Map/MapCluster";
import { LuArrowDown } from "react-icons/lu";
export interface PlannerDateAccordianProps {
  metroId: string;
  openAccordian: string;
  handleOpenAccordian: (value: string) => void;
  date: Date;
  columns: { [key: string]: ColumnType[] };
  setColumns: (value: { [key: string]: ColumnType[] }) => void;
  dates: Date[];
}

const PlannerDateAccordian = ({
  metroId,
  openAccordian,
  handleOpenAccordian,
  date,
  dates,
  columns,
  setColumns,
}: PlannerDateAccordianProps) => {
  const column = columns[convertDateTypeToDate2(date)] || [];

  // 이동 효과 관련
  const [moveClassGroup, setMoveClassGroup] = useState<string[]>([]);
  const [moveOrderGroup, setMoveOrderGroup] = useState<number[]>([]);

  // 맵 여닫기
  const [openMap, setOpenMap] = useState(false);

  // 이동거리, 시간 정보
  const [infos, setInfos] = useState<
    ({ distance: number; duration: number } | undefined)[]
  >([]);

  const countOfPlaces = column.filter(
    (item) => item.place.contenttypeid !== "32"
  ).length;
  const countOfAccomm = column.filter(
    (item) => item.place.contenttypeid === "32"
  ).length;

  const handleOpenMap = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenMap(!openMap);
  };

  return (
    <section
      className={`planner-places-accordian-date${
        openAccordian === convertDateTypeToDate2(date)
          ? " active"
          : countOfPlaces > 0 && countOfAccomm > 0
          ? " completed"
          : ""
      }`}
      onClick={
        (column && column.length === 0) || !column
          ? undefined
          : () => handleOpenAccordian(convertDateTypeToDate2(date))
      }
    >
      <div className="planner-places-accordian-date-title">
        <p className="planner-places-accordian-date-title-container">
          <span className="planner-places-accordian-date-title-name">
            {convertDateTypeToDate2(date)}
          </span>
          <span className="planner-places-accordian-date-title-info">
            ( 여행지 :{" "}
            {column.filter((item) => item.place.contenttypeid !== "32").length}{" "}
            숙소 :{" "}
            {column.filter((item) => item.place.contenttypeid === "32").length}{" "}
            )
          </span>
        </p>
        <p
          className={`planner-places-accordian-date-title-icon${
            openAccordian === convertDateTypeToDate2(date) ? " active" : ""
          }`}
        >
          <IoIosArrowDropup />
        </p>
      </div>
      <ul
        className={`planner-places-accordian-date-container${
          openAccordian === convertDateTypeToDate2(date) ? " active" : ""
        }`}
      >
        {column &&
          column.map((item, index) => (
            <React.Fragment key={item.place.contentid}>
              <PlannerDateCard
                key={item.place.contentid}
                column={column}
                order={index}
                date={date}
                dates={dates}
                detail={item}
                metroId={metroId}
                columns={columns}
                setColumns={setColumns}
                moveClassGroup={moveClassGroup}
                setMoveClassGroup={setMoveClassGroup}
                moveOrderGroup={moveOrderGroup}
                setMoveOrderGroup={setMoveOrderGroup}
              />
              {infos[index] && (
                <div className="planner-places-accordian-date-infos">
                  {/* infos[index]가 undefined가 아닐 때만 duration에 접근 */}
                  <p className="planner-places-accordian-date-infos-icon">
                    <LuArrowDown />
                  </p>
                  {infos[index]?.duration !== undefined && (
                    <p className="planner-places-accordian-date-infos-detail">
                      {Math.ceil((infos[index]?.duration ?? 0) / 60)}분
                    </p>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
      </ul>
      <div
        className={`planner-places-accordian-date-map${
          openAccordian === convertDateTypeToDate2(date) ? " active" : ""
        }`}
      >
        <p
          className={`planner-places-accordian-date-map-title`}
          onClick={(e) => handleOpenMap(e)}
        >
          {openMap ? "맵 닫기" : "맵 열기"}
        </p>
        <div
          className={`planner-place-accordian-data-map-container${
            openMap ? " open" : ""
          }`}
        >
          {openMap && (
            <MapCluster
              key={`mapCluster${date.toDateString()}`}
              column={column}
              date={date}
              infos={infos}
              setInfos={setInfos}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PlannerDateAccordian;
