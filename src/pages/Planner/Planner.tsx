import { useLocation } from "react-router-dom";
import "./planner.css";
import { metros } from "data/metros";
import { useState } from "react";

import { MessageType } from "types/template";
import PlannerPc from "./PlannerPc/PlannerPc";
import PlannerMobile from "./PlannerMobile/PlannerPlace/PlannerMobile";

const Planner = () => {
  const { hash, pathname } = useLocation();
  const [message, setMessage] = useState<MessageType>();

  // 지역 코드 알아내기
  const encodedMetroName = pathname.split("/")[2];
  const discodedMetroName = decodeURIComponent(encodedMetroName);

  // 지역 코드
  const metroId =
    metros.find((metro) => metro.name === discodedMetroName)?.areaCode || "";

  // 기간 저장하기
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <div className="planner">
      {message ? <div className="planner-modal"></div> : undefined}
      <PlannerMobile metroId={metroId} dates={dates} setDates={setDates} />
      <PlannerPc metroId={metroId} dates={dates} setDates={setDates} />
    </div>
  );
};

export default Planner;
