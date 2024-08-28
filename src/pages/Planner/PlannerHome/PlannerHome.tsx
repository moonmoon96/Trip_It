import "./plannerHome.css";
import React, { useCallback, useState } from "react";
import { MessageType } from "types/template";
import PlannerHomeModal from "./PlannerHomeModal";
import { metros } from "data/metros";
import { LuSearch } from "react-icons/lu";
import { debounce } from "utilities/debounce";
import { includeByChoJungJong } from "./Utilities/hangul";

const PlannerHome = () => {
  const [message, setMessage] = useState<MessageType>();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;

    setSearch(search);
  };

  const showDetail = (areaCode: string) => {
    const metro = metros.find((item) => item.areaCode === areaCode);

    if (!metro) return;
    setMessage({
      msgId: 3,
      type: "move",
      msgs: {
        header: metro.name,
        main: metro.description,
      },
      params: areaCode,
    });
  };

  // 모달창이 열리면 스크롤이 안되게 조정
  if (message) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return (
    <div className="planner-home">
      {message && (
        <PlannerHomeModal message={message} setMessage={setMessage} />
      )}
      <section className="planner-home-title">
        <h3>어디로 여행을 떠나시나요?</h3>
      </section>
      <section className="planner-home-search">
        <div className="planner-home-search-container">
          <input
            type="text"
            className="planner-home-search-box"
            onChange={(e) => handleSearch(e)}
            placeholder="지역명을 검색해보세요."
          />
          <div className="planner-home-search-icon">
            <LuSearch />
          </div>
        </div>
      </section>
      <section className="planner-home-grid">
        {metros.filter((item) => includeByChoJungJong(search, item.name))
          .length === 0 && (
          <React.Fragment>
            <li className="planner-home-grid-item-empty">
              검색 결과가 없습니다.
            </li>
          </React.Fragment>
        )}
        <ul className="planner-home-grid-container">
          {metros
            .filter((item) => includeByChoJungJong(search, item.name))
            .map((metro) => (
              <li
                key={metro.areaCode}
                className="planner-home-grid-item"
                onClick={() => showDetail(metro.areaCode)}
              >
                <img
                  src={metro.imgUrl}
                  alt="지역 사진"
                  className="planner-home-grid-item-image"
                />
                <p className="planner-home-grid-item-title">{metro.name}</p>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default PlannerHome;
