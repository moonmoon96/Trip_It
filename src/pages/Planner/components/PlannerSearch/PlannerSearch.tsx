import { handleOpenSearch } from "pages/Planner/PlannerPc/utilities/plannerPc";
import "./plannerSearch.css";
import React from "react";
import { LuSearch } from "react-icons/lu";
export interface PlannerSearchProps {
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
  search: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const PlannerSearch = ({
  openSearch,
  setOpenSearch,
  search,
  onChange,
}: PlannerSearchProps) => {
  return (
    <span
      className={`planner-search${openSearch ? " active" : ""}`}
      onClick={(e) => handleOpenSearch(e, openSearch, setOpenSearch)}
    >
      <input
        type="text"
        className={`planner-search-box${openSearch ? " active" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onChange={onChange}
        value={search}
        placeholder="검색어를 입력하세요."
      />
      <span className="planner-search-icon">
        <LuSearch />
      </span>
    </span>
  );
};

export default PlannerSearch;
