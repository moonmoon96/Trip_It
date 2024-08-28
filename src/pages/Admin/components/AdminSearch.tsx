import "./adminSearch.css";

import React, { useEffect, useRef, useState } from "react";
import { TemplateArrayType } from "types/template";
import { debounce } from "utilities/debounce";
import { handleSearch } from "../utilities/admin";

interface AdminSearchProps {
  sortNSearchArray: TemplateArrayType[];
  search: string;
  setSearch: (value: string) => void; // 검색 상태를 설정하는 함수
  setPage: (value: number) => void; // 페이지 상태를 설정하는 함수
  field: { name: string; nested?: string[] }; // 검색할 항목의 필드 이름
  setField: (value: { name: string; nested?: string[] }) => void;
}

const AdminSearch = ({
  sortNSearchArray,
  search,
  setSearch,
  setPage,
  field,
  setField,
}: AdminSearchProps) => {
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);

  const type = sortNSearchArray.find((item) => item.field.name === field.name)
    ?.search?.type;
  // tempArray에서 field.name과 일치하는 항목을 찾고, 해당 항목의 search.enum을 가져옵니다.
  const option = sortNSearchArray.find((item) => item.field.name === field.name)
    ?.search.enum;

  let options;
  // option이 undefined가 아닐 경우에만 Object.entries를 사용합니다.
  if (option) {
    options = Object.entries(option);
  }

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".admin-search-field") &&
        !target.closest(".admin-search-keyword")
      ) {
        setOpen(false);
        setOpenSelect(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleAll = () => {
    setSearch("");
    setOpenSelect(false);
  };

  const OnChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const debouncedOnChange = debounce(OnChange, 300);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    debouncedOnChange(value);
  };

  const handleField = (fieldName: string) => {
    const newField = { name: fieldName };
    setField(newField);
    setSearch("");
    setOpen(false);
  };

  const handleFieldOpen = () => {
    setOpen(!open);
    setOpenSelect(false);
  };
  const handleSearchOpen = () => {
    setOpen(false);
    setOpenSelect(!openSelect);
  };

  return (
    <div className="admin-search">
      <span className="admin-search-field">
        <div
          className={`admin-search-field-title${open ? " open" : ""}`}
          onClick={() => handleFieldOpen()}
        >
          {
            sortNSearchArray.find((item) => item.field.name === field.name)
              ?.title
          }
        </div>
        <ul className={`admin-search-field-container${open ? " open" : ""}`}>
          {sortNSearchArray
            .filter((item) => item.search.able === true)
            .map((item, i) => (
              <li
                className={`admin-search-field-item${
                  field === item.field ? " active" : ""
                }`}
                key={i}
                value={item.field.name}
                onClick={() => handleField(item.field.name)}
              >
                {item.title}
              </li>
            ))}
        </ul>
      </span>
      <span className="admin-search-keyword">
        {type === "normal" && (
          <input
            type="text"
            onChange={handleOnChange}
            onFocus={() => setOpen(false)}
            className="admin-search-keyword-box"
          />
        )}
        {type === "select" && (
          <>
            <p
              className={`admin-search-keyword-title${
                openSelect ? " open" : ""
              }`}
              onClick={() => handleSearchOpen()}
            >
              {search.length === 0 ? "선택해주세요" : search}
            </p>
            <ul
              className={`admin-search-keyword-container${
                openSelect ? " open" : ""
              }`}
            >
              <li
                className="admin-search-keyword-item"
                onClick={() => handleAll()}
              >
                전체
              </li>
              {options?.map((option) => (
                <li
                  className="admin-search-keyword-item"
                  key={option[0]}
                  onClick={() =>
                    handleSearch(setOpenSelect, option[1], setSearch)
                  }
                >
                  {option[1]}
                </li>
              ))}
            </ul>
          </>
        )}
      </span>
    </div>
  );
};

export default AdminSearch;
