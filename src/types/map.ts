export interface ResultType {
  address_name: string;
  address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR";
  x: string;
  y: string;
  address: kakao.maps.services.Address;
  road_address: kakao.maps.services.RoadAaddress;
}
