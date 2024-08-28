import { fetchPlaceAPI } from "apis/place";
import "./plannerAPIPlaceCard.css";
import { metros } from "data/metros";
import { useEffect, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuPhoneCall, LuPlus } from "react-icons/lu";
import { PlaceApiType } from "types/place";
import { convertDateTypeToDate1, convertDateTypeToDate2 } from "utilities/date";
import { ColumnType } from "types/plan";
import Map from "pages/Planner/components/Map/Map";
export interface PlannerAPIPlaceCardProps {
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
const PlannerAPIPlaceCard = ({
  dates,
  place,
  metroId,
  isRequesting,
  setIsRequesting,
  columns,
  setColumns,
}: PlannerAPIPlaceCardProps) => {
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

    setLoading(true);
    if (isRequesting) return;

    setIsRequesting(true);

    fetchPlaceAPI(contentId)
      .then((res) => {
        if (!res) return;
        console.log(res.data);

        setSelectedPlace(res.data[0]);
        setLoading(false);
        setIsRequesting(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 0) {
          console.log("네트워크 오류, 연결 상태 확인 요망");
        }
        setLoading(false);
        setIsRequesting(false);
      });
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

    setOpenDropdown(!openDropdown);
  };

  // 장소 추가하기
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

    const oldColumn: ColumnType[] = columns[convertDateTypeToDate2(date)] || [];

    setColumns({
      ...columns,
      [convertDateTypeToDate2(date)]: [...oldColumn, newColumnElem],
    });

    setOpenDropdown(!openDropdown);
  };

  // 저장된 장소의 위치 확인
  const WhereCheckedPlace = (contentId: string, index: number) => {
    return (
      Object.values(columns)[index]?.some(
        (item) => item.place.contentid === contentId
      ) || false
    );
  };

  // 저장된 장소인지 여부 확인
  const CheckPlace = (contentId: string) => {
    return selectedPlaces.some((item) => item.contentid === contentId);
  };

  //
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
    <li className="planner-place-card-api">
      <div className="planner-place-card-api-main">
        <span
          className="planner-place-card-api-main-info"
          onClick={(e) => getPlaceDetail(e, place.contentid)}
        >
          <span className="planner-place-card-api-main-info-photo">
            <img
              src={place.firstimage || defaultImage}
              alt={`${place.title} 이미지`}
              className={openDepict ? "open" : undefined}
            />
          </span>
          <span className="planner-place-card-api-main-info-detail">
            <div className="planner-place-card-api-main-info-detail-title">
              <p className="planner-place-card-api-main-info-detail-title-name">
                {place.title}
              </p>
              <span className="planner-place-card-api-main-info-detail-title-more">
                <LuChevronDown />
              </span>
            </div>
            <div className="planner-place-card-api-main-info-detail-addr">
              {place.addr1}
            </div>
            <div className="planner-place-card-api-main-info-detail-tel">
              <p className="planner-place-card-api-main-info-detail-tel-icon">
                <LuPhoneCall />
              </p>
              <p className="planner-place-card-api-main-info-detail-tel-text">
                {place.tel || "xxx-xxxx-xxxx"}
              </p>
            </div>
          </span>
        </span>
        <span
          className={`planner-place-card-api-main-dropdown${
            openDepict ? " open" : ""
          }`}
          ref={dropdownRef}
          onClick={(e) => handleOpenDropdown(e)}
        >
          <p className={`planner-place-card-api-main-dropdown-title`}>
            {openDropdown ? (
              <LuChevronDown />
            ) : CheckPlace(place.contentid) ? (
              <LuCheck />
            ) : (
              <LuPlus />
            )}
          </p>

          <ul
            className={`planner-place-card-api-main-dropdown-container${
              openDropdown ? " active" : ""
            }`}
            ref={listRef}
          >
            {dates.map((date, index) => (
              <li
                key={convertDateTypeToDate2(date)}
                className={`planner-place-card-api-main-dropdown-item${
                  WhereCheckedPlace(place.contentid, index) ? " selected" : ""
                }`}
                onClick={
                  WhereCheckedPlace(place.contentid, index)
                    ? (e) => handleDeselect(e, place.contentid, date)
                    : (e) => handleSelect(e, place, date, index)
                }
              >
                {convertDateTypeToDate1(date)}
              </li>
            ))}
          </ul>
        </span>
      </div>
      <div
        className={`planner-place-card-api-overview${
          openDepict ? " active" : ""
        }`}
      >
        <div className="planner-place-card-api-overview-depict">
          <p
            className="planner-place-card-api-overview-depict-title"
            onClick={(e) => handleOverview(e)}
          >
            {openOverview ? "설명 닫기" : "설명 보기"}
          </p>
          <p
            className={`planner-place-card-api-overview-depict-detail${
              openOverview ? " open" : ""
            }`}
          >
            {selectedPlace?.overview || "준비된 설명이 없습니다."}
          </p>
        </div>

        <div className={`planner-place-card-api-overview-map`}>
          <p
            className={`planner-place-card-api-overview-map-title`}
            onClick={(e) => handleOpenMap(e)}
          >
            {openMap ? "지도 닫기" : "지도 보기"}
          </p>
          <p
            className={`planner-place-card-api-overview-map-container${
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

export default PlannerAPIPlaceCard;
