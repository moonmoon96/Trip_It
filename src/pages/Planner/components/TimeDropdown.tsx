import { useEffect, useRef, useState } from "react";
import "./timeDropdown.css";

// TimeDropdownProps 인터페이스: 컴포넌트에 전달될 props의 타입을 정의합니다.
interface TimeDropdownProps {
  value: string; // 현재 선택된 값
  array: string[]; // 드롭다운에 표시될 문자열 배열
  setFunc: (value: string) => void; // 선택된 값을 업데이트하는 함수
}

const TimeDropdown = ({ value, array, setFunc }: TimeDropdownProps) => {
  const [open, setOpen] = useState(false); // 드롭다운의 열림/닫힘 상태를 관리합니다.
  const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 전체에 대한 참조를 유지합니다.
  const listRef = useRef<HTMLUListElement>(null); // 드롭다운 목록에 대한 참조를 유지합니다.

  useEffect(() => {
    // 드롭다운 외부 클릭 시 드롭다운을 닫기 위한 이벤트 핸들러
    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation();
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) // 클릭한 위치가 드롭다운 내부가 아닌 경우
      ) {
        setOpen(false); // 드롭다운을 닫습니다.
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 문서에 마우스 다운 이벤트 리스너를 추가합니다.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    };
  }, []);

  useEffect(() => {
    // 드롭다운이 열릴 때, 현재 선택된 항목을 보이도록 스크롤 조정
    if (open && value !== null && listRef.current) {
      const list = listRef.current;
      const itemHeight = list.children[0].clientHeight; // 첫 번째 항목의 높이를 가져옵니다.
      const middleIndex = 2; // 가운데 인덱스
      const scrollTop = itemHeight * (Number(value) - middleIndex); // 스크롤 위치를 계산합니다.
      list.scrollTo({ top: scrollTop, behavior: "smooth" }); // 부드럽게 스크롤합니다.
    }
  }, [open, value]);

  // 드롭다운 열기/닫기 토글 함수
  const handleOpen = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpen(!open); // 드롭다운의 열림/닫힘 상태를 토글합니다.
  };

  // 드롭다운 항목 선택 함수
  const handleSelect = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    e.stopPropagation();
    setFunc(array[index]); // 선택한 값을 부모 컴포넌트에 전달합니다.
    setOpen(false); // 드롭다운을 닫습니다.
  };

  return (
    <div className="time-dropdown" ref={dropdownRef}>
      {/* 드롭다운 제목, 클릭 시 드롭다운을 열거나 닫습니다. */}
      <p className="time-dropdown-title" onClick={(e) => handleOpen(e)}>
        {value}
      </p>
      {open && (
        <ul className={`time-dropdown-container active`} ref={listRef}>
          {/* 배열의 각 항목을 리스트 항목으로 표시합니다. */}
          {array.map((item, index) => (
            <li
              key={index}
              className={`time-dropdown-item ${
                index === Number(value) ? "selected" : "" // 현재 선택된 항목에 'selected' 클래스를 추가합니다.
              }`}
              onClick={(e) => handleSelect(e, index)} // 항목 클릭 시 선택 처리
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeDropdown;
