import "./mypageSort.css";
import React, { useState } from "react";
import {
  LuChevronDown,
  LuChevronUp,
  LuSlidersHorizontal,
} from "react-icons/lu";
import { SortandSearchType } from "../types/mypage";
import { controlSort } from "../Utilites/mypage";

interface MypageSortProps {
  sort: string[];
  setSort: React.Dispatch<React.SetStateAction<string[]>>;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  sortNSearchArray: SortandSearchType[];
}

const MypageSort = ({
  sort,
  setSort,
  items,
  setItems,
  sortNSearchArray,
}: MypageSortProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mypage-sort">
      <div className="mypage-sort-title" onClick={() => setOpen(!open)}>
        <LuSlidersHorizontal />
      </div>
      <ul className={`mypage-sort-container${open ? " open" : ""}`}>
        {sortNSearchArray
          .filter((item) => item.sort.key !== "")
          .map((i) => (
            <li
              key={i.field.name}
              className={`mypage-sort-item${
                sort[0] === i.sort.key ? " active" : ""
              }`}
              data-key={i.sort.key}
              data-value={i.sort.value}
              onClick={(e) =>
                controlSort(e, items, setItems, setSort, open, setOpen)
              }
            >
              <span className="mypage-sort-item-name">{i.title}</span>
              <span className="mypage-sort-item-icon">
                {sort[0] === i.sort.key && sort[1] === "desc" ? (
                  <LuChevronDown />
                ) : sort[0] === i.sort.key && sort[1] === "asc" ? (
                  <LuChevronUp />
                ) : (
                  ""
                )}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MypageSort;
