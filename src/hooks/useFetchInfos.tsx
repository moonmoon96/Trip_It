import { InfoType } from "pages/Planner/PlannerPc/PlannerPc";
import React, { useEffect, useState } from "react";
import { PlaceApiType } from "types/place";
import { ColumnType } from "types/plan";
import { convertDateTypeToDate2 } from "utilities/date";
import { getInfos, getPositions } from "utilities/map";
export interface useFetchInfosProps {
  columns: { [key: string]: ColumnType[] };
  dates: Date[];
}

const useFetchInfos = ({ columns, dates }: useFetchInfosProps) => {
  const allInfosObj: Record<string, any> = dates.reduce((acc, date) => {
    const dateString = convertDateTypeToDate2(date);
    acc[dateString] = []; //
    return acc;
  }, {} as Record<string, any>);

  const [allInfos, setAllInfos] = useState<{
    [key: string]: (InfoType | undefined)[];
  }>(allInfosObj);

  useEffect(() => {
    const fetchData = async () => {
      try {
        kakao.maps.load(async () => {
          const columnArr = Object.values(columns);
          const columnKeys = Object.keys(columns);

          let newAllInfos = { ...allInfos };

          for (let j = 0; j < columnArr.length; j++) {
            const key = columnKeys[j];
            const places: PlaceApiType[] = columnArr[j].map(
              (item) => item.place
            );
            const positions = await getPositions(places);

            const newInfos: (InfoType | undefined)[] = [];
            for (let k = 0; k < positions.length - 1; k++) {
              const start = k;
              const end = k + 1;

              const info: InfoType | undefined = await getInfos(
                positions[start].latlng,
                positions[end].latlng
              );

              newInfos.push(info);
            }

            newAllInfos[key] = newInfos;
          }

          if (JSON.stringify(newAllInfos) !== JSON.stringify(allInfos)) {
            setAllInfos(newAllInfos);
          }
        });
      } catch (error) {
        console.log("에러", error);
      }
    };

    fetchData();
  }, [columns]);

  return allInfos;
};

export default useFetchInfos;
