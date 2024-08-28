import React from "react";
import { convertDateTypeToDate2 } from "utilities/date";
import { getPureletter } from "utilities/place";
interface PlaceItemProps {
  item: {
    contentId: string;
    contentTypeId: string;
    title: string;
  };
  index: number;
  date: Date;
  droppable: string[];
  dragOver: (e: React.DragEvent<HTMLLIElement>) => void;
  dragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  dragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
  drop: (e: React.DragEvent<HTMLLIElement>) => void;
}
const PlaceItem = ({
  item,
  date,
  index,
  droppable,
  dragOver,
  dragStart,
  dragEnd,
  drop,
}: PlaceItemProps) => {
  return (
    <li
      className={`planner-pc-register-plan-date-places-item${
        item.contentTypeId === "32" ? " accommo" : ""
      }${
        droppable[0] === convertDateTypeToDate2(date) &&
        droppable[1] === index.toString()
          ? " droppable"
          : ""
      }`}
      data-row={convertDateTypeToDate2(date)}
      data-col={index}
      draggable
      onDragOver={(e) => dragOver(e)}
      onDragStart={(e) => dragStart(e)}
      onDragEnd={(e) => dragEnd(e)}
      onDrop={(e) => drop(e)}
    >
      {getPureletter(item.title)}
    </li>
  );
};

export default PlaceItem;
