import { useEffect, useRef, useState } from "react";
import "./plannerPcDateCard.css";
import { PlaceApiType } from "types/place";
import { ColumnType } from "types/plan";
import { metros } from "data/metros";
import { convertDateTypeToDate1, convertDateTypeToDate2 } from "utilities/date";
import {
  LuAlignJustify,
  LuChevronDown,
  LuChevronUp,
  LuLoader2,
} from "react-icons/lu";
import TimeDropdown from "pages/Planner/components/TimeDropdown";
import { hourArr, minuteArr } from "data/plan";
import { getPureletter } from "utilities/place";
import { fetchPlaceAPI } from "apis/place";
import Map from "pages/Planner/PlannerPc/PlannerMap/Map";
import {
  getPlaceDetail,
  handleDeselect,
  handleOpenDropdown,
  handleOpenMap,
  handleOverview,
  handleSelectAndMove,
  MoveCardDown,
  MoveCardUp,
  WhereCheckedPlace,
} from "pages/Planner/PlannerPc/utilities/plannerPc";

export interface PlannerPcDateCardProps {
  date: Date;
  dates: Date[];
  detail: ColumnType;
  metroId: string;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
  order: number;
  column: ColumnType[];
  moveClassGroup: string[];
  moveOrderGroup: number[];
  setMoveClassGroup: (value: string[]) => void;
  setMoveOrderGroup: (value: number[]) => void;
}
const PlannerPcDateCard = ({
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
}: PlannerPcDateCardProps) => {
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

  const [isRequesting, setIsRequesting] = useState(false);

  const lastOfColumn = columns[convertDateTypeToDate2(date)].length - 1;

  // 사진이 없는 경우 기본 사진 사용
  const defaultImage = metros.find(
    (metro) => metro.areaCode === metroId
  )?.imgUrl;

  // 드롭 다운 닫기
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

  // 위치 이동 관련 
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

  return (
    <li
      className={`planner-pc-place-card-date ${
        order === moveOrderGroup[0]
          ? moveClassGroup[0]
          : order === moveOrderGroup[1]
          ? moveClassGroup[1]
          : undefined
      }`}
    >
      <div className="planner-pc-place-card-date-main">
        <span
          className={`planner-pc-place-card-date-main-position${
            openDepict ? " open" : ""
          }`}
        >
          <div className="planner-pc-place-card-date-main-position-container">
            <p
              className={`planner-pc-place-card-date-main-position-up${
                order === 0 ? " deactive" : ""
              }`}
              onClick={(e) =>
                MoveCardUp(
                  e,
                  detail.place.contentid,
                  columns,
                  setColumns,
                  date,
                  setMoveClassGroup,
                  setMoveOrderGroup,
                  order
                )
              }
            >
              <LuChevronUp />
            </p>
            <p
              className={`planner-pc-place-card-date-main-position-down${
                order === lastOfColumn ? " deactive" : ""
              }`}
              onClick={(e) =>
                MoveCardDown(
                  e,
                  detail.place.contentid,
                  columns,
                  setColumns,
                  date,
                  setMoveClassGroup,
                  setMoveOrderGroup,
                  order
                )
              }
            >
              <LuChevronDown />
            </p>
          </div>
        </span>
        <span
          className="planner-pc-place-card-date-main-info"
          onClick={(e) => getPlaceDetail(e, openDepict, setOpenDepict)}
        >
          <span className="planner-pc-place-card-date-main-info-photo">
            <img
              src={detail.place.firstimage || defaultImage}
              alt={`${getPureletter(detail.place.title)} 이미지`}
              className={openDepict ? "open" : undefined}
            />
          </span>
          <span className="planner-pc-place-card-date-main-info-detail">
            <div className="planner-pc-place-card-date-main-info-detail-title">
              <p className="planner-pc-place-card-date-main-info-detail-title-name">
                {getPureletter(detail.place.title)}
              </p>
              <span
                className={`planner-pc-place-card-date-main-info-detail-title-tag${
                  detail.place.contenttypeid === "12"
                    ? " tour"
                    : detail.place.contenttypeid === "14"
                    ? " culture"
                    : detail.place.contenttypeid === "39"
                    ? " food"
                    : " accommo"
                }`}
              >
                {detail.place.contenttypeid === "12"
                  ? "관광"
                  : detail.place.contenttypeid === "14"
                  ? "문화"
                  : detail.place.contenttypeid === "39"
                  ? "음식"
                  : "숙소"}
              </span>
            </div>
            <div className="planner-pc-place-card-date-main-info-detail-addr">
              {detail.place.addr1}
            </div>
            <div className="planner-pc-place-card-date-main-info-detail-time">
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
          className={`planner-pc-place-card-date-main-dropdown${
            openDepict ? " open" : ""
          }`}
          ref={dropdownRef}
          onClick={(e) => handleOpenDropdown(e, openDropdown, setOpenDropdown)}
        >
          <p className={`planner-pc-place-card-date-main-dropdown-title`}>
            {openDropdown ? <LuChevronDown /> : <LuAlignJustify />}
          </p>

          <ul
            className={`planner-pc-place-card-date-main-dropdown-container${
              openDropdown ? " active" : ""
            }`}
            ref={listRef}
          >
            <li
              className={`planner-pc-place-card-date-main-dropdown-item`}
              onClick={(e) =>
                handleDeselect(
                  e,
                  detail.place.contentid,
                  date,
                  columns,
                  setColumns,
                  openDropdown,
                  setOpenDropdown
                )
              }
            >
              삭제
            </li>
            {dates.map((day, index) => {
              if (convertDateTypeToDate2(day) === convertDateTypeToDate2(date))
                return;

              if (WhereCheckedPlace(detail.place.contentid, index, columns)) {
                return;
              }
              return (
                <li
                  key={convertDateTypeToDate2(day)}
                  className={`planner-pc-place-card-date-main-dropdown-item${
                    WhereCheckedPlace(detail.place.contentid, index, columns)
                      ? " selected"
                      : ""
                  }`}
                  onClick={
                    WhereCheckedPlace(detail.place.contentid, index, columns)
                      ? (e) =>
                          handleDeselect(
                            e,
                            detail.place.contentid,
                            day,
                            columns,
                            setColumns,
                            openDropdown,
                            setOpenDropdown
                          )
                      : (e) =>
                          handleSelectAndMove(
                            e,
                            detail.place,
                            day,
                            index,
                            date,
                            columns,
                            setColumns,
                            openDropdown,
                            setOpenDropdown
                          )
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
        className={`planner-pc-place-card-date-overview${
          openDepict ? " active" : ""
        }`}
      >
        <div className="planner-pc-place-card-date-overview-depict">
          <p
            className="planner-pc-place-card-date-overview-depict-title"
            onClick={(e) =>
              handleOverview(
                e,
                detail.place.contentid,
                openOverview,
                setOpenOverview,
                selectedPlace,
                setSelectedPlace,
                setLoading,
                isRequesting,
                setIsRequesting
              )
            }
          >
            {openOverview ? "설명 닫기" : "설명 보기"}
          </p>
          <p
            className={`planner-pc-place-card-date-overview-depict-detail${
              openOverview ? " open" : ""
            }`}
          >
            {isRequesting ? (
              <span className={`icon ${isRequesting ? " requesting" : ""}`}>
                확인중..
              </span>
            ) : (
              selectedPlace?.overview || "준비된 설명이 없습니다."
            )}
          </p>
        </div>

        <div className={`planner-pc-place-card-date-overview-map`}>
          <p
            className={`planner-pc-place-card-date-overview-map-title`}
            onClick={(e) => handleOpenMap(e, openMap, setOpenMap)}
          >
            {openMap ? "지도 닫기" : "지도 보기"}
          </p>
          <p
            className={`planner-pc-place-card-date-overview-map-container${
              openMap ? " open" : ""
            }`}
          >
            {openMap ? (
              <Map
                key={detail.place?.contentid}
                addr={detail.place?.addr1}
                title={getPureletter(detail.place?.title)}
              />
            ) : undefined}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PlannerPcDateCard;
