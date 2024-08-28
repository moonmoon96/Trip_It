import { fetchPlaceAPI } from "apis/place";
import "./plannerPcAPIPlaceCard.css";
import { metros } from "data/metros";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuPhoneCall, LuPlus } from "react-icons/lu";
import { PlaceApiType } from "types/place";
import { convertDateTypeToDate1, convertDateTypeToDate2 } from "utilities/date";
import { ColumnType } from "types/plan";
import { getPureletter } from "utilities/place";
import Map from "pages/Planner/PlannerPc/PlannerMap/Map";
import {
  CheckPlace,
  getPlaceDetail,
  handleDeselect,
  handleOpenDropdown,
  handleOpenMap,
  handleOverview,
  handleSelect,
  handleSelectAll,
  WhereCheckedPlace,
} from "pages/Planner/PlannerPc/utilities/plannerPc";

export interface PlannerPcAPIPlaceCardProps {
  dates: Date[];
  place: PlaceApiType;
  metroId: string;
  isRequesting: boolean;
  setIsRequesting: (value: boolean) => void;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
}
const PlannerPcAPIPlaceCard = ({
  dates,
  place,
  metroId,
  isRequesting,
  setIsRequesting,
  columns,
  setColumns,
}: PlannerPcAPIPlaceCardProps) => {
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

  // 사진이 없는 경우 기본 사진 사용
  const defaultImage = metros.find(
    (metro) => metro.areaCode === metroId
  )?.imgUrl;

  const selectedPlaces = Object.values(columns)
    .flat()
    .map((item) => item.place);

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

  // 드롭 다운이 창보다 아래에서 켜지는 경우
  useLayoutEffect(() => {
    if (listRef.current && openDropdown) {
      const checkContentLoad = () => {
        if (!listRef.current) return;
        const rect = listRef.current.getBoundingClientRect();

        const bottomSpace = window.innerHeight - rect.bottom;

        if (bottomSpace < rect.height) {
          listRef.current.style.top = `-${rect.height}px`;
        } else {
          listRef.current.style.top = "48px"; // 기본 위치 유지
        }
      };

      // 예: 콘텐츠가 로드된 후 실행
      setTimeout(checkContentLoad, 300);
    } else {
      if (!listRef.current) return;
      listRef.current.style.top = "48px"; // 기본 위치 유지
    }
  }, [openDropdown]);

  return (
    <li className="planner-pc-place-card-api">
      <div className="planner-pc-place-card-api-main">
        <span
          className="planner-pc-place-card-api-main-info"
          onClick={(e) => getPlaceDetail(e, openDepict, setOpenDepict)}
        >
          <span className="planner-pc-place-card-api-main-info-photo">
            <img
              src={place.firstimage || defaultImage}
              alt={`${place.title} 이미지`}
              className={openDepict ? "open" : undefined}
            />
          </span>
          <span className="planner-pc-place-card-api-main-info-detail">
            <div className="planner-pc-place-card-api-main-info-detail-title">
              <p className="planner-pc-place-card-api-main-info-detail-title-name">
                {getPureletter(place.title)}
              </p>
              <span
                className={`planner-pc-place-card-api-main-info-detail-title-tag${
                  place.contenttypeid === "12"
                    ? " tour"
                    : place.contenttypeid === "14"
                    ? " culture"
                    : place.contenttypeid === "39"
                    ? " food"
                    : " accommo"
                }`}
              >
                {place.contenttypeid === "12"
                  ? "관광"
                  : place.contenttypeid === "14"
                  ? "문화"
                  : place.contenttypeid === "39"
                  ? "음식"
                  : "숙소"}
              </span>
            </div>
            <div className="planner-pc-place-card-api-main-info-detail-addr">
              {place.addr1}
            </div>
            <div className="planner-pc-place-card-api-main-info-detail-tel">
              <p className="planner-pc-place-card-api-main-info-detail-tel-icon">
                <LuPhoneCall />
              </p>
              <p className="planner-pc-place-card-api-main-info-detail-tel-text">
                {place.tel || "xxx-xxxx-xxxx"}
              </p>
            </div>
          </span>
        </span>
        <span
          className={`planner-pc-place-card-api-main-dropdown${
            openDepict ? " open" : ""
          }`}
          ref={dropdownRef}
          onClick={(e) => handleOpenDropdown(e, openDropdown, setOpenDropdown)}
        >
          <p className={`planner-pc-place-card-api-main-dropdown-title`}>
            {openDropdown ? (
              <LuChevronDown />
            ) : CheckPlace(selectedPlaces, place.contentid) ? (
              <LuCheck />
            ) : (
              <LuPlus />
            )}
          </p>

          <ul
            className={`planner-pc-place-card-api-main-dropdown-container${
              openDropdown ? " active" : ""
            }`}
            ref={listRef}
          >
            <li
              className="planner-pc-place-card-api-main-dropdown-item"
              onClick={() => handleSelectAll(columns, setColumns, dates, place)}
            >
              매일
            </li>
            {dates.map((date, index) => (
              <li
                key={convertDateTypeToDate2(date)}
                className={`planner-pc-place-card-api-main-dropdown-item${
                  WhereCheckedPlace(place.contentid, index, columns)
                    ? " selected"
                    : ""
                }`}
                onClick={
                  WhereCheckedPlace(place.contentid, index, columns)
                    ? (e) =>
                        handleDeselect(
                          e,
                          place.contentid,
                          date,
                          columns,
                          setColumns,
                          openDropdown,
                          setOpenDropdown
                        )
                    : (e) =>
                        handleSelect(
                          e,
                          place,
                          date,
                          index,
                          columns,
                          setColumns,
                          openDropdown,
                          setOpenDropdown
                        )
                }
              >
                {convertDateTypeToDate1(date)}
              </li>
            ))}
          </ul>
        </span>
      </div>
      <div
        className={`planner-pc-place-card-api-overview${
          openDepict ? " active" : ""
        }`}
      >
        {/* 설명 보기 */}
        <div className="planner-pc-place-card-api-overview-depict">
          <p
            className="planner-pc-place-card-api-overview-depict-title"
            onClick={(e) =>
              handleOverview(
                e,
                place.contentid,
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
          <div
            className={`planner-pc-place-card-api-overview-depict-detail${
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
          </div>
        </div>
        {/* 지도 보기 */}
        <div className={`planner-pc-place-card-api-overview-map`}>
          <p
            className={`planner-pc-place-card-api-overview-map-title`}
            onClick={(e) => handleOpenMap(e, openMap, setOpenMap)}
          >
            {openMap ? "지도 닫기" : "지도 보기"}
          </p>
          <p
            className={`planner-pc-place-card-api-overview-map-container${
              openMap ? " open" : ""
            }`}
          >
            {openMap ? (
              <Map
                key={selectedPlace?.contentid}
                addr={selectedPlace?.addr1}
                title={selectedPlace?.title}
              />
            ) : undefined}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PlannerPcAPIPlaceCard;
