import { ResultType } from "types/map";
import { PlaceApiType } from "types/place";
import { getPureletter } from "./place";

export const getCarDirection = async (
  startPoint: kakao.maps.LatLng,
  endPoint: kakao.maps.LatLng,
  map: kakao.maps.Map
) => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_KEY;

  const url = "https://apis-navi.kakaomobility.com/v1/directions";

  // 출발지(origin), 목적지(destination)의 좌표를 문자열로 변환합니다.
  const origin = `${startPoint.getLng()},${startPoint.getLat()}`;
  const destination = `${endPoint.getLng()},${endPoint.getLat()}`;

  // 요청 헤더를 추가합니다.
  const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`,
    "Content-Type": "application/json",
  };

  // 표3의 요청 파라미터에 필수값을 적어줍니다.
  const queryParams = new URLSearchParams({
    origin: origin,
    destination: destination,
  });

  const requestUrl = `${url}?${queryParams}`; // 파라미터까지 포함된 전체 URL

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const linePath: kakao.maps.LatLng[] = [];
    const resultCode = data.routes[0].result_code;
    if (resultCode === 102 || resultCode === 103) {
      linePath.push(startPoint, endPoint);
    } else {
      data.routes[0].sections[0].roads.forEach((router: any) => {
        router.vertexes.forEach((vertax: any, index: number) => {
          if (index % 2 === 0) {
            linePath.push(
              new kakao.maps.LatLng(
                router.vertexes[index + 1],
                router.vertexes[index]
              )
            );
          }
        });
      });
    }

    var polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 3,
      strokeColor: "#00ce7c",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    // 이동 거리
    const distance =
      resultCode === 102
        ? "시작 지점 주변의 도로를 탐색할 수 없음"
        : resultCode === 103
        ? "도착 지점 주변의 도로를 탐색할 수 없음"
        : data.routes[0].sections[0].distance;

    // 이동 시간
    const duration =
      resultCode === 102
        ? "시작 지점 주변의 도로를 탐색할 수 없음"
        : resultCode === 103
        ? "도착 지점 주변의 도로를 탐색할 수 없음"
        : data.routes[0].sections[0].duration;

    return {
      distance,
      duration,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

// 정보만 받아오기
export const getInfos = async (
  startPoint: kakao.maps.LatLng,
  endPoint: kakao.maps.LatLng
) => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_KEY;

  const url = "https://apis-navi.kakaomobility.com/v1/directions";

  // 출발지(origin), 목적지(destination)의 좌표를 문자열로 변환합니다.
  const origin = `${startPoint.getLng()},${startPoint.getLat()}`;
  const destination = `${endPoint.getLng()},${endPoint.getLat()}`;

  // 요청 헤더를 추가합니다.
  const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`,
    "Content-Type": "application/json",
  };

  // 표3의 요청 파라미터에 필수값을 적어줍니다.
  const queryParams = new URLSearchParams({
    origin: origin,
    destination: destination,
  });

  const requestUrl = `${url}?${queryParams}`; // 파라미터까지 포함된 전체 URL

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const resultCode = data.routes[0].result_code;

    // 이동 거리
    const distance =
      resultCode === 102
        ? "시작 지점 주변의 도로를 탐색할 수 없음"
        : resultCode === 103
        ? "도착 지점 주변의 도로를 탐색할 수 없음"
        : data.routes[0].sections[0].distance;

    // 이동 시간
    const duration =
      resultCode === 102
        ? "시작 지점 주변의 도로를 탐색할 수 없음"
        : resultCode === 103
        ? "도착 지점 주변의 도로를 탐색할 수 없음"
        : data.routes[0].sections[0].duration;

    return {
      distance,
      duration,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

// 비동기적으로 주소 정보로 위치 정보 받아오기
export const getCoords = (address: string) => {
  return new Promise<kakao.maps.LatLng>((resolve, reject) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(
      address,
      (result: ResultType[], status: kakao.maps.services.Status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(
            Number(result[0].y), // lat
            Number(result[0].x) // lng
          );

          resolve(coords);
        } else {
          reject("에러");
        }
      }
    );
  });
};

// 비동기적으로 받은 위치정보를 배열로 바꾸기
export const getCoordsArray = async (places: PlaceApiType[]) => {
  const promises = places.map((place) => getCoords(place.addr1));

  return Promise.all(promises);
};

// 이름과 좌표 배열
export const getPositions = async (places: PlaceApiType[]) => {
  const positions: { title: string; latlng: kakao.maps.LatLng }[] = [];
  const geocoder = new kakao.maps.services.Geocoder();

  const addressToCoords = (addr: string): Promise<kakao.maps.LatLng | null> => {
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

  const promises = places.map((place, index) =>
    addressToCoords(place.addr1).then((coords) => {
      if (coords) {
        // 인덱스에 맞게 positions 배열에 값을 설정합니다.
        positions[index] = {
          title: getPureletter(place.title),
          latlng: coords,
        };
      }
    })
  );

  await Promise.all(promises);

  return positions.filter((position) => position !== undefined);
};

export const calcMinutes = (duration: number) => {
  return Math.ceil(duration / 60);
};
