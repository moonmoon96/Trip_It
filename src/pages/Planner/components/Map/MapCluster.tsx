import { ColumnType } from "types/plan";
import "./mapCluster.css";
import { useEffect, useState } from "react";
import { PlaceApiType } from "types/place";
import { getCarDirection } from "utilities/map";
export interface MapClusterProps {
  column: ColumnType[];
  date: Date;
  infos: ({ distance: number; duration: number } | undefined)[];
  setInfos: (
    value: ({ distance: number; duration: number } | undefined)[]
  ) => void;
}
const MapCluster = ({ column, date, infos, setInfos }: MapClusterProps) => {
  const [places, setPlaces] = useState<PlaceApiType[]>([]);

  useEffect(() => {
    const places = column.map((item) => item.place);
    setPlaces(places);
  }, [column]);
  // 장소 정보만 추출하기

  useEffect(() => {
    kakao.maps.load(async () => {
      if (!places) return;

      const mapContainer = document.getElementById(
        `map-cluster-${date.toDateString()}`
      );
      if (!mapContainer) return;

      const mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const positions = await getPositions(places);
      const map = new kakao.maps.Map(mapContainer, mapOption);

      // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
      var bounds = new kakao.maps.LatLngBounds();

      // 마커와 인포윈도우 생성
      positions.forEach((position) => {
        const marker = new kakao.maps.Marker({
          map: map,
          position: position.latlng,
          title: position.title,
        });

        // const infowindow = new kakao.maps.InfoWindow({
        //   content: `<div style="width:150px;text-align:center;padding:6px 0;">${position.title}</div>`,
        // });
        // infowindow.open(map, marker);

        // LatLngBounds 객체에 좌표를 추가합니다
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
  }, [places]);

  const getPositions = async (places: PlaceApiType[]) => {
    const positions: { title: string; latlng: kakao.maps.LatLng }[] = [];
    const geocoder = new kakao.maps.services.Geocoder();

    const addressToCoords = (
      addr: string
    ): Promise<kakao.maps.LatLng | null> => {
      return new Promise((resolve, reject) => {
        geocoder.addressSearch(addr, function (result, status) {
          if (status === kakao.maps.services.Status.OK && result[0]) {
            const coords = new kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );
            resolve(coords);
          } else {
            resolve(null);
          }
        });
      });
    };

    const promises = places.map((place) =>
      addressToCoords(place.addr1).then((coords) => {
        if (coords) {
          positions.push({
            title: place.title,
            latlng: coords,
          });
        }
      })
    );

    await Promise.all(promises);
    return positions;
  };

  return (
    <div
      className="map-cluster"
      id={`map-cluster-${date.toDateString()}`}
    ></div>
  );
};

export default MapCluster;
