import { useEffect, useRef, useState } from "react";
import "./plannerDateCard.css";
import { PlaceApiType } from "types/place";
import { ColumnType } from "types/plan";
import { metros } from "data/metros";
import { convertDateTypeToDate1, convertDateTypeToDate2 } from "utilities/date";
import {
  LuAlignJustify,
  LuCheck,
  LuChevronDown,
  LuChevronUp,
  LuMoreHorizontal,
  LuMoreVertical,
  LuPlus,
} from "react-icons/lu";
import TimeDropdown from "pages/Planner/components/TimeDropdown";
import { hourArr, minuteArr } from "data/plan";
import Map from "pages/Planner/components/Map/Map";

export interface PlannerDateCardProps {
  date: Date;
  dates: Date[];
  detail: ColumnType;
  metroId: string;
  columns: { [key: string]: ColumnType[] };
  setColumns: (value: { [key: string]: ColumnType[] }) => void;
  order: number;
  column: ColumnType[];
  moveClassGroup: string[];
  setMoveClassGroup: (value: string[]) => void;
  moveOrderGroup: number[];
  setMoveOrderGroup: (value: number[]) => void;
}
const PlannerDateCard = ({
  column,
  date,
  dates,
  detail,
  metroId,
  columns,
  setColumns,
  order,
  moveClassGroup,
  setMoveClassGroup,
  moveOrderGroup,
  setMoveOrderGroup,
}: PlannerDateCardProps) => {
  const dropdownRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // api 로딩 중
  const [loading, setLoading] = useState(false);
  // 추가 정보 열기
  const [openDepict, setOpenDepict] = useState(false);
  // 맵 열기
  const [openMap, setOpenMap] = useState(false);
  // 장소 선택하기
  const [selectedPlace, setSelectedPlace] = useState<PlaceApiType>();
  // 드롭다운 열기
  const [openDropdown, setOpenDropdown] = useState(false);
  // 설명 열기
  const [openOverview, setOpenOverview] = useState(false);

  // 시간 관련 드롭다운 정보
  const startTime = detail.startTime.split(":");
  const endTime = detail.endTime.split(":");
  const [startHour, setStartHour] = useState(startTime[0]);
  const [startMinute, setStartMinute] = useState(startTime[1]);
  const [endHour, setEndHour] = useState(endTime[0]);
  const [endMinute, setEndMinute] = useState(endTime[1]);

  const lastOfColumn = columns[convertDateTypeToDate2(date)].length - 1;

  // 사진이 없는 경우 기본 사진 사용
  const defaultImage = metros.find(
    (metro) => metro.areaCode === metroId
  )?.imgUrl;

  const selectedPlaces = Object.values(columns)
    .flat()
    .map((item) => item.place);

  useEffect(() => {
    // 드롭다운 외부 클릭 시 드롭다운을 닫기 위한 이벤트 핸들러
    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation();
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) // 클릭한 위치가 드롭다운 내부가 아닌 경우
      ) {
        setOpenDropdown(false); // 드롭다운을 닫습니다.
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 문서에 마우스 다운 이벤트 리스너를 추가합니다.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    };
  }, []);

  useEffect(() => {
    if (moveClassGroup[0]) {
      const timer = setTimeout(() => setMoveClassGroup([]), 100); // 애니메이션 길이와 동일하게 설정
      return () => clearTimeout(timer);
    }
  }, [moveClassGroup]);

  // 시간 변경시 자동 업데이트 되게 하기
  useEffect(() => {
    const updatedColumns = { ...columns };

    const columnKey = convertDateTypeToDate2(date);
    const updatedDetail = {
      ...detail,
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`,
    };

    const index = updatedColumns[columnKey].findIndex(
      (item) => item.place.contentid === detail.place.contentid
    );

    if (index !== -1) {
      updatedColumns[columnKey][index] = updatedDetail;
    } else {
      updatedColumns[columnKey].push(updatedDetail);
    }

    setColumns(updatedColumns);
  }, [startHour, startMinute, endHour, endMinute]);

  // 추가 정보 확인하기
  const getPlaceDetail = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    contentId: string
  ) => {
    e.stopPropagation();

    // 설명 파트 여닫기
    setOpenDepict(!openDepict);

    // 설명 부분이 열려 있는 경우 api 요청을 하지 않고 되돌아 감
    if (openDepict) return;

    // 선택한 장소에 대한 정보와 요청 정보가 일치한다면 되돌아 감
    if (selectedPlace && selectedPlace.contentid === contentId) return;

    // 선택한 장소가 선택한 장소들의 목록에 존재하는지 확인
    const isExisted = selectedPlaces.find(
      (selectedPlace) => selectedPlace.contentid === contentId
    );

    // 선택한 장소들에 존재하는 정보인 경우 그 정보를 선택한 장소 정보에 추가
    if (isExisted) {
      setSelectedPlace(isExisted);
      return;
    }
  };

  const handleOpenDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();

    setOpenDropdown(!openDropdown);
  };

  const handleDeselect = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    contentId: string,
    date: Date
  ) => {
    e.stopPropagation();
    const newColumn = columns[convertDateTypeToDate2(date)].filter(
      (item) => item.place.contentid !== contentId
    );

    setColumns({
      ...columns,
      [convertDateTypeToDate2(date)]: newColumn,
    });
  };
  const handleSelect = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    place: PlaceApiType,
    date: Date,
    order: number
  ) => {
    e.stopPropagation();

    const newColumnElem: ColumnType = {
      place,
      scheduleOrder: order,
      startTime: "06:00",
      endTime: "07:00",
    };

    const oldColumn: ColumnType[] = columns[convertDateTypeToDate2(date)];

    setColumns({
      ...columns,
      [convertDateTypeToDate2(date)]: [...oldColumn, newColumnElem],
    });
  };

  // 저장된 장소의 위치 확인
  const WhereCheckedPlace = (contentId: string, index: number) => {
    const sps = Object.values(columns);

    const result = sps
      .find((_, i) => index === i)
      ?.find((item) => item.place.contentid === contentId);

    if (result) {
      return true;
    } else {
      return false;
    }
  };

  // 저장된 장소인지 여부 확인
  const CheckPlace = (contentId: string) => {
    const check = selectedPlaces.find((item) => item.contentid === contentId);

    if (check) {
      return true;
    } else {
      return false;
    }
  };

  const MoveCardUp = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    contentId: string
  ) => {
    e.stopPropagation();

    // 현재 column 상태를 복사하여 cloneColumn 생성
    const cloneColumn = [...columns[convertDateTypeToDate2(date)]];

    // contentId가 일치하는 아이템을 찾기
    const itemIndex = cloneColumn.findIndex(
      (item) => item.place.contentid === contentId
    );

    // 아이템이 존재하지 않거나, 이미 첫 번째 위치에 있는 경우 처리
    if (itemIndex === -1 || itemIndex === 0) return;

    // 아이템을 위로 이동시키기 위해 스왑
    const itemToMove = cloneColumn[itemIndex];
    cloneColumn.splice(itemIndex, 1); // 해당 아이템 제거
    cloneColumn.splice(itemIndex - 1, 0, itemToMove); // 새로운 위치에 아이템 삽입

    // 상태 업데이트
    setColumns({
      ...columns,
      [convertDateTypeToDate2(date)]: cloneColumn,
    });

    setMoveClassGroup(["move-up", "move-down"]);
    setMoveOrderGroup([order, order - 1]);
  };

  const MoveCardDown = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    contentId: string
  ) => {
    e.stopPropagation();
    // 현재 column 상태를 복사하여 cloneColumn 생성
    const cloneColumn = [...columns[convertDateTypeToDate2(date)]];

    // contentId가 일치하는 아이템을 찾기
    const itemIndex = cloneColumn.findIndex(
      (item) => item.place.contentid === contentId
    );

    // 아이템이 존재하지 않거나, 이미 마지막 위치에 있는 경우 처리
    if (itemIndex === -1 || itemIndex === cloneColumn.length - 1) return;

    // 아이템을 아래로 이동시키기 위해 스왑
    const itemToMove = cloneColumn[itemIndex];
    cloneColumn.splice(itemIndex, 1); // 해당 아이템 제거
    cloneColumn.splice(itemIndex + 1, 0, itemToMove); // 새로운 위치에 아이템 삽입

    // 상태 업데이트
    setColumns({
      ...columns,
      [convertDateTypeToDate2(date)]: cloneColumn,
    });

    setMoveClassGroup(["move-down", "move-up"]);
    setMoveOrderGroup([order, order + 1]);
  };

  const handleOverview = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setOpenOverview(!openOverview);
  };

  const handleOpenMap = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenMap(!openMap);
  };
  return (
    <li
      className={`planner-place-card-date ${
        order === moveOrderGroup[0]
          ? moveClassGroup[0]
          : order === moveOrderGroup[1]
          ? moveClassGroup[1]
          : undefined
      }`}
    >
      <div className="planner-place-card-date-main">
        <span
          className={`planner-place-card-date-main-position${
            openDepict ? " open" : ""
          }`}
        >
          <div className="planner-place-card-date-main-position-container">
            <p
              className={`planner-place-card-date-main-position-up${
                order === 0 ? " deactive" : ""
              }`}
              onClick={(e) => MoveCardUp(e, detail.place.contentid)}
            >
              <LuChevronUp />
            </p>
            <p
              className={`planner-place-card-date-main-position-down${
                order === lastOfColumn ? " deactive" : ""
              }`}
              onClick={(e) => MoveCardDown(e, detail.place.contentid)}
            >
              <LuChevronDown />
            </p>
          </div>
        </span>
        <span
          className="planner-place-card-date-main-info"
          onClick={(e) => getPlaceDetail(e, detail.place.contentid)}
        >
          <span className="planner-place-card-date-main-info-photo">
            <img
              src={detail.place.firstimage || defaultImage}
              alt={`${detail.place.title} 이미지`}
              className={openDepict ? "open" : undefined}
            />
          </span>
          <span className="planner-place-card-date-main-info-detail">
            <div className="planner-place-card-date-main-info-detail-title">
              <p className="planner-place-card-date-main-info-detail-title-name">
                {detail.place.title}
              </p>
              <span className="planner-place-card-date-main-info-detail-title-more">
                <LuChevronDown />
              </span>
            </div>
            <div className="planner-place-card-date-main-info-detail-addr">
              {detail.place.addr1}
            </div>
            <div className="planner-place-card-date-main-info-detail-time">
              <TimeDropdown
                value={startHour}
                array={hourArr}
                setFunc={setStartHour}
              />
              :
              <TimeDropdown
                value={startMinute}
                array={minuteArr}
                setFunc={setStartMinute}
              />
              ~
              <TimeDropdown
                value={endHour}
                array={hourArr}
                setFunc={setEndHour}
              />
              :
              <TimeDropdown
                value={endMinute}
                array={minuteArr}
                setFunc={setEndMinute}
              />
            </div>
          </span>
        </span>
        <span
          className={`planner-place-card-date-main-dropdown${
            openDepict ? " open" : ""
          }`}
          ref={dropdownRef}
          onClick={(e) => handleOpenDropdown(e)}
        >
          <p className={`planner-place-card-date-main-dropdown-title`}>
            {openDropdown ? <LuChevronDown /> : <LuAlignJustify />}
          </p>

          <ul
            className={`planner-place-card-date-main-dropdown-container${
              openDropdown ? " active" : ""
            }`}
            ref={listRef}
          >
            <li
              className={`planner-place-card-date-main-dropdown-item`}
              onClick={(e) => handleDeselect(e, detail.place.contentid, date)}
            >
              삭제
            </li>
            {dates.map((day, index) => {
              if (day === date) return;
              return (
                <li
                  key={convertDateTypeToDate2(day)}
                  className={`planner-place-card-date-main-dropdown-item${
                    WhereCheckedPlace(detail.place.contentid, index)
                      ? " selected"
                      : ""
                  }`}
                  onClick={
                    WhereCheckedPlace(detail.place.contentid, index)
                      ? (e) => handleDeselect(e, detail.place.contentid, day)
                      : (e) => handleSelect(e, detail.place, day, index)
                  }
                >
                  {convertDateTypeToDate1(day)}
                </li>
              );
            })}
          </ul>
        </span>
      </div>
      <div
        className={`planner-place-card-date-overview${
          openDepict ? " active" : ""
        }`}
      >
        <div className="planner-place-card-date-overview-depict">
          <p
            className="planner-place-card-date-overview-depict-title"
            onClick={(e) => handleOverview(e)}
          >
            {openOverview ? "설명 닫기" : "설명 보기"}
          </p>
          <p
            className={`planner-place-card-date-overview-depict-detail${
              openOverview ? " open" : ""
            }`}
          >
            {detail.place?.overview || "준비된 설명이 없습니다."}
          </p>
        </div>

        <div className={`planner-place-card-date-overview-map`}>
          <p
            className={`planner-place-card-date-overview-map-title`}
            onClick={(e) => handleOpenMap(e)}
          >
            {openMap ? "지도 닫기" : "지도 보기"}
          </p>
          <p
            className={`planner-place-card-date-overview-map-container${
              openMap ? " open" : ""
            }`}
          >
            {openMap ? (
              <Map
                key={detail.place?.contentid}
                addr={detail.place?.addr1}
                title={detail.place?.title}
              />
            ) : undefined}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PlannerDateCard;
