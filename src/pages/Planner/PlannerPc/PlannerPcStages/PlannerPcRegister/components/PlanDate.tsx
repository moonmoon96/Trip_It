import "./planDate.css";
import { LuChevronRight, LuGripVertical } from "react-icons/lu";
import { Link } from "react-router-dom";
import { convertDateTypeToDate1, convertDateTypeToDate2 } from "utilities/date";
import { getPureletter } from "utilities/place";
import { ColumnType } from "types/plan";
import PlaceItem from "./PlaceItem";

interface PlanDateProps {
  date: Date;
  droppable: string[];
  dateDroppable: string;
  columns: { [key: string]: ColumnType[] };
  setDate: (value: Date) => void;
  dragOver: (e: React.DragEvent<HTMLLIElement>) => void;
  dragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  dragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
  drop: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDateDragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDateDragOver: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDateDragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDateDrop: (e: React.DragEvent<HTMLLIElement>) => void;
}

const PlanDate = ({
  date,
  droppable,
  dateDroppable,
  dragOver,
  dragStart,
  dragEnd,
  drop,
  columns,
  setDate,
  handleDateDragStart,
  handleDateDragOver,
  handleDateDragEnd,
  handleDateDrop,
}: PlanDateProps) => {
  const getPlaces = (date: Date) => {
    const column = columns[convertDateTypeToDate2(date)];

    const places = column.map((col) => ({
      title: getPureletter(col.place.title),
      contentTypeId: col.place.contenttypeid,
      contentId: col.place.contentid,
    }));

    return places;
  };

  return (
    <li
      className={`planner-pc-register-plan-date${
        dateDroppable === convertDateTypeToDate2(date) ? " droppable" : ""
      }`}
      draggable
      data-row={convertDateTypeToDate2(date)}
      onDragStart={(e) => handleDateDragStart(e)}
      onDragEnd={(e) => handleDateDragEnd(e)}
      onDragOver={(e) => handleDateDragOver(e)}
      onDrop={(e) => handleDateDrop(e)}
    >
      <span className="planner-pc-register-plan-date-info">
        <Link
          to={`#places`}
          className="planner-pc-register-plan-date-title"
          onClick={() => setDate(date)}
        >
          {convertDateTypeToDate1(date)} :
        </Link>
        <span className="planner-pc-register-plan-date-places">
          <ul className="planner-pc-register-plan-date-places-container">
            {getPlaces(date).map((item, index, array) => (
              <>
                <PlaceItem
                  item={item}
                  date={date}
                  index={index}
                  droppable={droppable}
                  dragOver={dragOver}
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                  drop={drop}
                />
                {index !== array.length - 1 && (
                  <span className="icon">
                    <LuChevronRight />
                  </span>
                )}
              </>
            ))}
            <li
              className={`planner-pc-register-plan-date-places-item${
                droppable[0] === convertDateTypeToDate2(date) &&
                droppable[1] === getPlaces(date).length.toString()
                  ? " droppable"
                  : ""
              }${" emptyback"}`}
              data-row={convertDateTypeToDate2(date)}
              data-col={getPlaces(date).length}
              onDragOver={(e) => dragOver(e)}
              onDragEnd={(e) => dragEnd(e)}
              onDrop={(e) => drop(e)}
              style={{ width: "100%" }}
            >
              g
            </li>
            {getPlaces(date).length === 0 && (
              <li
                className={`planner-pc-register-plan-date-places-item${
                  droppable[0] === convertDateTypeToDate2(date) &&
                  droppable[1] === "0"
                    ? " droppable"
                    : ""
                }`}
                data-row={convertDateTypeToDate2(date)}
                data-col={0}
                onDragOver={(e) => dragOver(e)}
                onDragEnd={(e) => dragEnd(e)}
                onDrop={(e) => drop(e)}
                style={{ width: "100%" }}
              >
                드래그
              </li>
            )}
          </ul>
        </span>
      </span>

      <span className="planner-pc-register-plan-date-drag icon">
        <LuGripVertical />
      </span>
    </li>
  );
};

export default PlanDate;
