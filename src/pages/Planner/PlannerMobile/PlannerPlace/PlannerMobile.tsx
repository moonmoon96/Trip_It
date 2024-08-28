import { convertDateToYYYYMMDD, convertDateTypeToDate2 } from "utilities/date";
import "./plannerPlaces.css";
import { useEffect, useState } from "react";
import PlannerInfoAccordian from "./PlannerAccordians/PlannerInfoAccordian";
import PlannerAPIAccordian from "./PlannerAccordians/PlannerAPIAccordian";

import PlannerDateAccordian from "./PlannerAccordians/PlannerDateAccordian";
import { ColumnType, ScheduleDetailDtoInputType } from "types/plan";
import { useNavigate } from "react-router-dom";
import { saveScheduleAPI } from "apis/schedule";
import { LuLoader2 } from "react-icons/lu";
import PlannerCalendarAccordian from "./PlannerAccordians/PlannerCalendarAccordian";
import { plannerAPIAccordianArr } from "pages/Planner/data/plannerPlace";
export interface PlannerMobileProps {
  metroId: string;
  dates: Date[];
  setDates: (value: Date[]) => void;
}
const PlannerMobile = ({ metroId, dates, setDates }: PlannerMobileProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAccordian, setOpenAccordian] = useState("");
  const [columns, setColumns] = useState<{ [key: string]: ColumnType[] }>({});
  const [title, setTitle] = useState("");
  const [valid, setValid] = useState(false);
  const [contentTypeId, setContentTypeId] = useState("12");

  useEffect(() => {
    dates.forEach((date) => {
      columns[convertDateTypeToDate2(date)] = [];
    });
  }, [dates]);

  useEffect(() => {
    // 각 컬럼에 적어도 숙소 한 곳, 관광지 한 곳 이상이 있어야 함
    dates.forEach((date) => {
      const column = columns[convertDateTypeToDate2(date)];

      // 관광지 개수
      const countOfPlaces = column.filter(
        (item) => item.place.contenttypeid !== "32"
      ).length;
      // 숙소 개수
      const countOfAccomm = column.filter(
        (item) => item.place.contenttypeid === "32"
      ).length;

      if (countOfPlaces < 1 || countOfAccomm < 1) {
        return setValid(false);
      } else {
        // 모든 컬럼에 결격 사유가 없는 경우
        setValid(true);
      }
    });
  }, [columns]);

  // 아코디언 여닫기 함수
  const handleOpenAccordian = (
    accordianName: string,
    contentTypeId?: string
  ) => {
    if (accordianName === openAccordian) {
      return setOpenAccordian("");
    }

    setOpenAccordian(accordianName);
    if (!contentTypeId) return;
    setContentTypeId(contentTypeId);
  };

  // 제출하기
  const handleSubmit = () => {
    if (!title) return window.alert("일정 제목을 적어주세요");
    const start = convertDateToYYYYMMDD(dates[0]);
    const end = convertDateToYYYYMMDD(dates[dates.length - 1]);

    console.log(start, end);

    setIsSubmitting(true);

    const scheduleDetails: ScheduleDetailDtoInputType[] = [];
    const values = Object.values(columns);

    for (let i = 0; i < values.length; i++) {
      const column = values[i];
      for (const detail of column) {
        const newDetail: ScheduleDetailDtoInputType = {
          contentId: detail.place.contentid,
          scheduleOrder: detail.scheduleOrder,
          startTime: detail.startTime,
          endTime: detail.endTime,
        };
        scheduleDetails.push(newDetail);
      }
    }

    const submitValue = {
      scheduleDto: {
        metroId: metroId,
        startDate: start,
        endDate: end,
        scheduleTitle: title,
      },
      detailScheduleDto: scheduleDetails,
    };

    console.log(submitValue);

    saveScheduleAPI(submitValue)
      .then((res) => {
        console.log(res.data);
        if (!res) return;

        if (res.status === 200) {
          setIsSubmitting(false);
          console.log("등록 성공");
          navigate("/mypage/schedules");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="planner-places">
      <section className="planner-places-title">
        <h3>일정 선택</h3>
      </section>

      <PlannerInfoAccordian
        title={title}
        setTitle={setTitle}
        openAccordian={openAccordian}
        handleOpenAccordian={handleOpenAccordian}
        metroId={metroId}
        dates={dates}
      />

      <PlannerCalendarAccordian
        openAccordian={openAccordian}
        handleOpenAccordian={handleOpenAccordian}
        dates={dates}
        setDates={setDates}
      />

      {dates.map((date) => (
        <PlannerDateAccordian
          metroId={metroId}
          openAccordian={openAccordian}
          handleOpenAccordian={handleOpenAccordian}
          date={date}
          dates={dates}
          key={convertDateTypeToDate2(date)}
          columns={columns}
          setColumns={setColumns}
        />
      ))}

      {dates.length > 1 &&
        plannerAPIAccordianArr.map((apiInfo) => (
          <PlannerAPIAccordian
            key={apiInfo.key}
            dates={dates}
            metroId={metroId}
            openAccordian={openAccordian}
            handleOpenAccordian={handleOpenAccordian}
            apiInfo={apiInfo}
            columns={columns}
            setColumns={setColumns}
            contentTypeId={contentTypeId}
            setContentTypeId={setContentTypeId}
          />
        ))}

      <section className="planner-places-btns">
        <button
          className={`planner-places-btns-btn backward`}
          onClick={() => navigate("#calendar")}
        >
          이전
        </button>
        <button
          className={`planner-places-btns-btn${
            isSubmitting ? " submitting" : title && valid ? " register" : ""
          }`}
          onClick={isSubmitting ? undefined : () => handleSubmit()}
        >
          {isSubmitting ? (
            <p>
              <LuLoader2 />
            </p>
          ) : (
            <p>등록</p>
          )}
        </button>
      </section>
    </div>
  );
};

export default PlannerMobile;
