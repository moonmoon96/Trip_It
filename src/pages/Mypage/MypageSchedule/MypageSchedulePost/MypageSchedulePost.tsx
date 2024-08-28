import "./mypageSchedulePost.css";
import { useEffect, useState } from "react";
import { fetchScheduleDetails } from "apis/schedule";
import { useLocation, useNavigate } from "react-router-dom";
import { ScheduleDetailType } from "types/schedule";
import {
  convertDateTypeToDate2,
  convertYYYYMMDDToDateType,
  getDateArr,
} from "utilities/date";
import { fetchPlaceAPI } from "apis/place";
import { ColumnType } from "types/plan";
import { MessageType } from "types/template";
import useFetchInfos from "hooks/useFetchInfos";
import SchedulePc from "./Pc/SchedulePc";
import ScheduleMobile from "./Mobile/ScheduleMobile";

const MypageSchedulePost = () => {
  const [message, setMessage] = useState<MessageType>();
  const { state } = useLocation();
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetailType[]>(
    []
  );
  const [columns, setColumns] = useState<{ [key: string]: ColumnType[] }>({});
  const navigate = useNavigate();

  const [requesting, setRequesting] = useState(false);

  const {
    scheduleId,
    scheduleTitle,
    startDate,
    endDate,
    metroId,
    registerDate,
  } = state;

  const [title, setTitle] = useState(scheduleTitle);

  // 시작일과 종료일
  const start = convertYYYYMMDDToDateType(startDate);
  const end = convertYYYYMMDDToDateType(endDate);
  const [dates, setDates] = useState(getDateArr(start, end));

  // 일정 상세 받기
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetchScheduleDetails(scheduleId);
        if (res) {
          setScheduleDetails(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [scheduleId]);

  // 일정 상세를 통해서 공공 데이터에서 장소 정보 받아오기
  useEffect(() => {
    setRequesting(true);

    const fetchPlaces = async () => {
      const newColumns: { [key: string]: ColumnType[] } = {};

      for (const detail of scheduleDetails) {
        const contentId = detail.contentId;
        try {
          const res = await fetchPlaceAPI(contentId);

          const dateKey = convertDateTypeToDate2(dates[detail.scheduleOrder]);

          if (!newColumns[dateKey]) {
            newColumns[dateKey] = [];
          }

          let place;
          if (!res.data[0]) {
            place = res.data;
          } else {
            place = res.data[0];
          }

          newColumns[dateKey].push({
            place,
            scheduleOrder: detail.scheduleOrder,
            startTime: detail.startTime,
            endTime: detail.endTime,
          });
        } catch (err: any) {
          console.error(err);
          if (err.code === 6) {
            alert("데이터 소진");
            navigate(`#calendars`, { state });
            break;
          }
        } finally {
          setRequesting(false);
        }
      }

      setColumns(newColumns);
    };

    if (scheduleDetails.length > 0) {
      fetchPlaces();
    }
  }, [scheduleDetails]);

  const allInfos = useFetchInfos({ columns, dates });

  return (
    <div className="mypage-schedule-post">
      {message ? <div className="planner-modal"></div> : undefined}
      <SchedulePc
        title={title}
        setTitle={setTitle}
        metroId={metroId}
        dates={dates}
        setDates={setDates}
        columns={columns}
        setColumns={setColumns}
        registerDate={registerDate}
        schedule={state}
        scheduleDetails={scheduleDetails}
        allInfos={allInfos}
        requesting={requesting}
      />
      <ScheduleMobile
        title={title}
        setTitle={setTitle}
        metroId={metroId}
        dates={dates}
        setDates={setDates}
        columns={columns}
        setColumns={setColumns}
        registerDate={registerDate}
        schedule={state}
        scheduleDetails={scheduleDetails}
      />
    </div>
  );
};

export default MypageSchedulePost;
