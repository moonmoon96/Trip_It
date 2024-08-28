import React, { useCallback, useEffect, useState } from "react";
import "./plannerAPIAccordian.css";
import { IoIosArrowDropup } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import { debounce } from "utilities/debounce";
import PlannerAPIPlaceCard from "../PlannerCards/PlannerAPIPlaceCard";
import { PlaceApiType } from "types/place";
import { ColumnType } from "types/plan";
import { fetchPlacesAPI, fetchPlacesByKeywordAPI } from "apis/place";
import PlannerSearch from "pages/Planner/components/PlannerSearch/PlannerSearch";

export interface PlannerAPIAccordianProps {
  dates: Date[];
  metroId: string;
  openAccordian: string;
  handleOpenAccordian: (accordianName: string, contentTypeId?: string) => void;
  apiInfo: {
    name: string;
    key: string;
    tags: { name: string; contentTypeId: string }[];
  };
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
  contentTypeId: string;
  setContentTypeId: (value: string) => void;
}

const PlannerAPIAccordian = ({
  dates,
  metroId,
  openAccordian,
  handleOpenAccordian,
  apiInfo,
  columns,
  setColumns,
  contentTypeId,
  setContentTypeId,
}: PlannerAPIAccordianProps) => {
  const [loading, setLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState<PlaceApiType[]>([]);
  const [pageNo, setPageNo] = useState("1");

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.touches[0].clientX;
    const touchDiff = touchStartX - touchEndX;

    if (Math.abs(touchDiff) > 100) {
      // 터치 이동 거리가 100픽셀 이상일 때
      if (touchDiff > 0) {
        // 오른쪽에서 왼쪽으로 스크롤 (다음 페이지로 이동)
        setPageNo((Number(pageNo) + 1).toString());
      } else {
        // 현재 페이지가 1인 경우는 스크롤 안됨
        if (pageNo === "1") return;
        // 왼쪽에서 오른쪽으로 스크롤 (이전 페이지로 이동)
        setPageNo((Number(pageNo) - 1).toString());
      }
      setTouchStartX(null); // 터치 시작 위치 리셋
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  useEffect(() => {
    if (contentTypeId.length === 0) return;
    setLoading(true);

    fetchPlacesAPI(metroId, pageNo, contentTypeId)
      .then((res) => {
        if (!res) return;

        if (!res.data) {
          setPlaces(res);
          setLoading(false);
        } else {
          setPlaces(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.code === 0) {
          console.log("네트워크 오류, 연결 상태 확인 요망");
        }
        setLoading(false);
      });
  }, [metroId, contentTypeId, pageNo]);

  // api 이용을 하나만 가능하도록 하기
  const [isRequesting, setIsRequesting] = useState(false);

  // 검색창 열기
  const handleOpenSearch = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();

    setOpenSearch(!openSearch);
  };

  // 검색어 저장
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target?.value.trim() || "";

    setSearch(value);
    debouncedSearch(value);
  };

  const fetchPlacesByKeyword = async (keyword: string) => {
    setLoading(true);
    try {
      let res;

      if (keyword === "") {
        res = await fetchPlacesAPI(metroId, pageNo, contentTypeId);
      } else {
        res = await fetchPlacesByKeywordAPI(
          metroId,
          pageNo,
          contentTypeId,
          keyword
        );
      }

      if (!res.data) {
        setPlaces(res);
        setLoading(false);
      } else {
        setPlaces(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 렌더링을 줄이기 위한 debounce
  const debouncedSearch = useCallback(
    debounce((keyword: string) => fetchPlacesByKeyword(keyword), 500),
    [metroId, pageNo, contentTypeId]
  );

  //
  const hanldeContentTypeId = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    contentTypeId: string
  ) => {
    e.stopPropagation();
    setContentTypeId(contentTypeId);
    setSearch("");
  };

  return (
    <section
      className={`planner-places-accordian-api${
        openAccordian === apiInfo.key ? " active" : ""
      }`}
      onClick={() =>
        handleOpenAccordian(apiInfo.key, apiInfo.key === "places" ? "12" : "32")
      }
    >
      <div className="planner-places-accordian-api-title">
        <p className="planner-places-accordian-api-title-name">
          {apiInfo.name}
        </p>
        <p
          className={`planner-places-accordian-api-title-icon${
            openAccordian === apiInfo.key ? " active" : ""
          }`}
        >
          <IoIosArrowDropup />
        </p>
      </div>
      <ul
        className={`planner-places-accordian-api-container${
          openAccordian === apiInfo.key ? " active" : ""
        }`}
      >
        <ul className="planner-places-accordian-api-tags">
          {apiInfo.tags.map((tag) => (
            <li
              key={tag.contentTypeId}
              className={`planner-places-accordian-api-tags-tag${
                contentTypeId === tag.contentTypeId ? " active" : ""
              }`}
              onClick={(e) => hanldeContentTypeId(e, tag.contentTypeId)}
            >
              {tag.name}
            </li>
          ))}
          <PlannerSearch
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
            search={search}
            onChange={onChange}
          />
        </ul>
        <ul
          className={`planner-places-accordian-api-main${
            loading ? " loading" : ""
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {places.length === 0 ? (
            <li className="planner-places-accordian-api-main-noresult">
              검색 결과가 없습니다.
            </li>
          ) : (
            places.map((place) => (
              <PlannerAPIPlaceCard
                key={place.contentid}
                dates={dates}
                place={place}
                metroId={metroId}
                isRequesting={isRequesting}
                setIsRequesting={setIsRequesting}
                columns={columns}
                setColumns={setColumns}
              />
            ))
          )}
        </ul>
      </ul>
    </section>
  );
};

// openAccordian과 contentTypeId가 업데이트 되는 경우에만 렌더링이 이루어짐
export default React.memo(PlannerAPIAccordian, (prevProps, nextProps) => {
  return (
    prevProps.openAccordian === nextProps.openAccordian &&
    prevProps.contentTypeId === nextProps.contentTypeId &&
    prevProps.columns === nextProps.columns
  );
});
