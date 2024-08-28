import {
  LuChevronDown,
  LuChevronUp,
  LuSlidersHorizontal,
} from "react-icons/lu";
import "./adminSort.css";

import { useEffect, useRef, useState } from "react";
import { SortandSearchType } from "pages/Mypage/types/mypage";
interface AdminSortProps {
  sort: string[];
  setSort: React.Dispatch<React.SetStateAction<string[]>>;
  sortNSearchArray: SortandSearchType[];
}
const AdminSort = ({ sort, setSort, sortNSearchArray }: AdminSortProps) => {
  const [open, setOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAdminSort = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    setSort: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const { key, value } = e.currentTarget.dataset;

    // 다음 정렬 방향을 설정
    e.currentTarget.dataset.value = value === "desc" ? "asc" : "desc";

    if (!key || !value) return;

    setSort([key, value]);
  };

  return (
    <div className="admin-sort" ref={sortRef}>
      <div className="admin-sort-title" onClick={() => setOpen(!open)}>
        <LuSlidersHorizontal />
      </div>
      <ul className={`admin-sort-container${open ? " open" : ""}`}>
        {sortNSearchArray
          .filter((item) => item.sort.key !== "")
          .map((i) => (
            <li
              key={i.field.name}
              className={`admin-sort-item${
                sort[0] === i.sort.key ? " active" : ""
              }`}
              data-key={i.sort.key}
              data-value={i.sort.value}
              onClick={(e) => {
                handleAdminSort(e, setSort);
              }}
            >
              <span className="admin-sort-item-name">{i.title}</span>
              <span className="admin-sort-item-icon">
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

export default AdminSort;
