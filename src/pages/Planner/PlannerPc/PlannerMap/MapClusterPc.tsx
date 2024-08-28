import { ColumnType } from "types/plan";
import "./mapClusterPc.css";
import { useEffect, useState } from "react";
import { PlaceApiType } from "types/place";
import { getCarDirection, getPositions } from "utilities/map";
import { metros } from "data/metros";
import { useRenderCount } from "@uidotdev/usehooks";

export interface MapClusterPcProps {
  metroId: string;
  column: ColumnType[];
  selectedDate: Date;
  infos: (
    | { distance: number | string; duration: number | string }
    | undefined
  )[];
  setInfos: (
    value: ({ distance: number; duration: number } | undefined)[]
  ) => void;
}
const MapClusterPc = ({
  metroId,
  column,
  selectedDate,
  setInfos,
}: MapClusterPcProps) => {
  const renderCount = useRenderCount();

  const defaultPlace: PlaceApiType = {
    addr1: metros.find((metro) => metro.areaCode === metroId)?.name || "",
    addr2: "",
    areacode: "",
    booktour: "",
    cat1: "",
    cat2: "",
    cat3: "",
    contentid: "",
    contenttypeid: "",
    cpyrhtDivCd: "",
    createdtime: "",
    firstimage: "",
    firstimage2: "",
    mapx: "",
    mapy: "",
    mlevel: "",
    modifiedtime: "",
    showflag: "",
    sigungucode: "",
    tel: "",
    title: metros.find((metro) => metro.areaCode === metroId)?.name || "",
    zipcode: "",
    overview: "",
    telname: "",
    homepage: "",
  };

  const [places, setPlaces] = useState<PlaceApiType[]>([defaultPlace]);

  console.log("렌더링", renderCount);

  useEffect(() => {
    const places = column.map((item) => item.place);
    setPlaces(places);
  }, [column]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return; // 이전 요청이 완료될 때까지 대기

      setLoading(true);

      try {
        kakao.maps.load(async () => {
          if (!places || places.length === 0) {
            console.log("데이터 없음 에러");

            return;
          }

          const mapContainer = document.getElementById(
            `map-cluster-${selectedDate.toDateString()}`
          );
          if (!mapContainer) {
            setLoading(true);
            console.log("map 에러");

            return;
          }

          const mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 6,
          };

          const positions = await getPositions(places);

          const map = new kakao.maps.Map(mapContainer, mapOption);

          // 최저 레벨 설정하기
          map.setMinLevel(7);

          var bounds = new kakao.maps.LatLngBounds();

          positions.forEach((position, index) => {
            const marker = new kakao.maps.Marker({
              map: map,
              position: position.latlng,
              title: position.title,
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:5px">${index + 1}. ${
                position.title
              }</div>`,
            });
            infowindow.open(map, marker);
            bounds.extend(position.latlng);
          });

          const newInfos = [];
          for (let i = 0; i < positions.length - 1; i++) {
            const start = i;
            const end = i + 1;

            const info = await getCarDirection(
              positions[start].latlng,
              positions[end].latlng,
              map
            );

            newInfos.push(info);
          }

          setInfos(newInfos);

          map.setBounds(bounds);
        });
      } catch (error) {
        console.log("에러");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [places, selectedDate]);

  return (
    <div
      className="map-cluster"
      id={`map-cluster-${selectedDate.toDateString()}`}
    ></div>
  );
};

export default MapClusterPc;
