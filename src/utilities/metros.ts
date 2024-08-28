import { metros } from "data/metros";

export const getMetroName = (metroId: string) => {
  const metroName = metros.find((metro) => metro.areaCode === metroId)?.name;

  if (metroName) return metroName;
  else return "알수없음";
};
