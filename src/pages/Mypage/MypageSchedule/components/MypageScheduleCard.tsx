import "./mypageScheduleCard.css";
import { metros } from "data/metros";
import React from "react";
import { LuCalendarDays, LuPen } from "react-icons/lu";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { convertYYYYMMDDToDate2 } from "utilities/date";
import { getMetroName } from "utilities/metros";
import { convertDataToDate } from "utilities/profile";
import { handleSelect } from "../Utilities/schedule";
import { Link, useLocation } from "react-router-dom";

interface MypageScheduleCardProps {
  selections: (string | number)[];
  setSelections: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  item: any;
}
const MypageScheduleCard = ({
  selections,
  setSelections,
  item,
}: MypageScheduleCardProps) => {
  const defaultImage = metros.find(
    (metro) => metro.areaCode === item.metroId
  )?.imgUrl;

  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <li className="mypage-schedule-card">
      <div className="mypage-schedule-card-select">
        <p
          onClick={(e) =>
            handleSelect(e, item.scheduleId, selections, setSelections)
          }
        >
          {new Set(selections).has(item.scheduleId) ? (
            <MdOutlineCheckBox />
          ) : (
            <MdOutlineCheckBoxOutlineBlank />
          )}
        </p>
      </div>
      <Link
        to={`/mypage/schedules/${item.scheduleId}`}
        state={item}
        className="mypage-schedule-card-link"
      >
        <div className="mypage-schedule-card-photoarea">
          <img src={defaultImage} alt="지역사진" />
        </div>
        <div className="mypage-schedule-card-textarea">
          <div className="mypage-schedule-card-textarea-title">
            <span className="mypage-schedule-card-textarea-title-name">
              {item.scheduleTitle}
            </span>
            {pathname.includes("admin") && (
              <span className="mypage-schedule-card-textarea-title-user">
                {item.userId.nickname}
              </span>
            )}
          </div>
          <div
            className="mypage-schedule-card-textarea-duration"
            title={`${convertDataToDate(item.startDate)}~${convertDataToDate(
              item.endDate
            )}`}
          >
            <span className="mypage-schedule-card-textarea-duration-icon">
              <LuCalendarDays />
            </span>
            <span className="mypage-schedule-card-textarea-duration-text">
              {`${convertYYYYMMDDToDate2(
                item.startDate
              )}~${convertYYYYMMDDToDate2(item.endDate)}`}
            </span>
          </div>
          <div className="mypage-schedule-card-textarea-bottom">
            <div
              className="mypage-schedule-card-textarea-regdate"
              title={convertDataToDate(item.registerDate)}
            >
              <span className="mypage-schedule-card-textarea-regdate-icon">
                <LuPen />
              </span>
              <span className="mypage-schedule-card-textarea-regdate-text">
                {convertYYYYMMDDToDate2(item.registerDate)}
              </span>
            </div>
            <p className="mypage-schedule-card-textarea-local">
              {getMetroName(item.metroId)}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default MypageScheduleCard;
