import axios from "axios";
import { getCookie } from "utilities/Cookie";
import { convertStringToJson } from "utilities/place";

const baseURL = process.env.REACT_APP_BASE_URL;

export const fetchPlacesAPI = async (
  metroId: string,
  pageNo: string,
  contentTypeId: string
) => {
  try {
    const url = `${baseURL}/home/apiList/${metroId}/${pageNo}/${contentTypeId}`;
    console.log(url);

    const res = await axios.get(url, 
    //   {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Access: `${localStorage.getItem("access")}`,
    //     Refresh: `${getCookie("refresh")}`,
    //   },
    //   withCredentials: true,
    // }
  );

    const response = res.data;

    if (typeof response === "string") {
      return convertStringToJson(response);
    } else {
      return response;
    }
  } catch (err: any) {
    console.log(err);
    if (err.code === "ERR_NETWORK") {
      throw { code: 0 };
    }
  }
};

export const fetchPlaceAPI = async (contentId: string) => {
  const url = `${baseURL}/home/apiDetail/${contentId}`;
  console.log(url);
  try {
    const place = await axios.get(url, 
    //   {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Access: `${localStorage.getItem("access")}`,
    //     Refresh: `${getCookie("refresh")}`,
    //   },
    //   withCredentials: true,
    // }
  );

    return place;
  } catch (err: any) {
    console.log(err);
    const code = err.response.data.code;
    if (code === 6) {
      throw { code };
    } else if (err.code === "ERR_NETWORK") {
      throw { code: 0 };
    }
    throw { err };
  }
};

export const fetchPlacesByKeywordAPI = async (
  metroId: string,
  pageNo: string,
  contentTypeId: string,
  keyword: string
) => {
  try {
    const url = `${baseURL}/home/apiSearch/${metroId}/${pageNo}/${contentTypeId}/${keyword}`;
    console.log(url);
    const res = await axios.get(url, 
    //   {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Access: `${localStorage.getItem("access")}`,
    //     Refresh: `${getCookie("refresh")}`,
    //   },
    //   withCredentials: true,
    // }
  );

    const response = res.data;

    if (typeof response === "string") {
      return convertStringToJson(response);
    } else {
      return response;
    }
  } catch (err: any) {
    if (err.code === "ERR_NETWORK") {
      throw { code: 0 };
    }
  }
};
