import "./plannerPc.css";
import { useEffect, useState } from "react";
import { ColumnType } from "types/plan";
import { convertDateTypeToDate2 } from "utilities/date";
import MapClusterPc from "./PlannerMap/MapClusterPc";
import PlannerPcStages from "./PlannerPcStages/PlannerPcStages";
import useFetchInfos from "hooks/useFetchInfos";
import { PlannerMobileProps } from "../PlannerMobile/PlannerPlace/PlannerMobile";
import PlannerPcModal from "../components/PlannerPcModal/PlannerPcModal";
import { ModalMessageType } from "types/modal";

export interface InfoType {
  distance: number | string;
  duration: number | string;
}

const PlannerPc = ({ metroId, dates, setDates }: PlannerMobileProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // 이동거리, 시간 정보
  const [infos, setInfos] = useState<(InfoType | undefined)[]>([]);

  const [columns, setColumns] = useState<{ [key: string]: ColumnType[] }>({});
  const column = columns[convertDateTypeToDate2(selectedDate)] || [];

  const allInfos = useFetchInfos({ columns, dates });

  

  return (
    <div className="planner-pc">
      <PlannerPcStages
        metroId={metroId}
        setSelectedDate={setSelectedDate}
        dates={dates}
        setDates={setDates}
        columns={columns}
        setColumns={setColumns}
        date={selectedDate}
        setDate={setSelectedDate}
        infos={infos}
        allInfos={allInfos}
      />

      <section className="planner-pc-map">
        <MapClusterPc
          key={`mapCluster${selectedDate.toDateString()}`}
          metroId={metroId}
          column={column}
          selectedDate={selectedDate}
          infos={infos}
          setInfos={setInfos}
        />
      </section>
    </div>
  );
};

export default PlannerPc;
