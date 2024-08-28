import "./scheduleMobile.css";
import { useEffect, useState } from "react";
import { convertDateToYYYYMMDD, convertDateTypeToDate2 } from "utilities/date";
import { ColumnType, ScheduleDetailDtoUpdateType } from "types/plan";
import { plannerAPIAccordianArr } from "pages/Planner/data/plannerPlace";
import { useNavigate } from "react-router-dom";
import { LuLoader2 } from "react-icons/lu";
import { ScheduleDetailType, ScheduleType } from "types/schedule";
import { updateScheduleAPI } from "apis/schedule";
import PlannerInfoAccordian from "pages/Planner/PlannerMobile/PlannerPlace/PlannerAccordians/PlannerInfoAccordian";
import PlannerCalendarAccordian from "pages/Planner/PlannerMobile/PlannerPlace/PlannerAccordians/PlannerCalendarAccordian";
import PlannerAPIAccordian from "pages/Planner/PlannerMobile/PlannerPlace/PlannerAccordians/PlannerAPIAccordian";
import PlannerDateAccordian from "pages/Planner/PlannerMobile/PlannerPlace/PlannerAccordians/PlannerDateAccordian";

export interface ScheduleMobileProps {
  title: string;
  setTitle: (value: string) => void;
  metroId: string;
  dates: Date[];
  setDates: (value: Date[]) => void;
  columns: { [key: string]: ColumnType[] };
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >;
  registerDate: string;
  schedule: ScheduleType;
  scheduleDetails: ScheduleDetailType[];
}
const ScheduleMobile = ({
  title,
  setTitle,
  metroId,
  dates,
  setDates,
  columns,
  setColumns,
  registerDate,
  schedule,
  scheduleDetails,
}: ScheduleMobileProps) => {
  const navigate = useNavigate();
  const [openAccordian, setOpenAccordian] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valid, setValid] = useState(false);
  const [contentTypeId, setContentTypeId] = useState("");

  // 유효성 검사 로직을 함수로 분리
  const checkColumnValidity = (
    columns: { [key: string]: ColumnType[] },
    dates: Date[]
  ) => {
    for (const date of dates) {
      const column = columns[convertDateTypeToDate2(date)] || [];

      const countOfPlaces = column.filter(
        (item) => item.place.contenttypeid !== "32"
      ).length;
      const countOfAccomm = column.filter(
        (item) => item.place.contenttypeid === "32"
      ).length;

      if (countOfPlaces < 1 || countOfAccomm < 1) {
        return false;
      }
    }
    return true;
  };

  // useEffect 훅 개선
  useEffect(() => {
    const start = convertDateToYYYYMMDD(dates[0]);
    const end = convertDateToYYYYMMDD(dates[dates.length - 1]);

    // 제목 변경 여부 확인
    if (schedule.scheduleTitle !== title) {
      setValid(true);
      console.log("제목 바뀜");

      return;
    }

    // 날짜 변경 여부 확인
    if (schedule.startDate !== start || schedule.endDate !== end) {
      console.log("받아온거", schedule.startDate);
      console.log(start);

      setValid(checkColumnValidity(columns, dates));
      console.log("날짜 바뀜");
      return;
    }

    // 일정 세부사항 변경 여부 확인
    if (scheduleDetails.length !== Object.values(columns).flat().length) {
      setValid(checkColumnValidity(columns, dates));
      return;
    }

    // 일정 세부사항이 변경된 경우
    const hasChanges = Object.values(columns)
      .flat()
      .some((item, index) => {
        const detail = scheduleDetails[index];
        return (
          item.scheduleOrder !== detail.scheduleOrder ||
          item.startTime !== detail.startTime ||
          item.endTime !== detail.endTime ||
          item.place.contentid !== detail.contentId
        );
      });

    if (hasChanges) {
      setValid(checkColumnValidity(columns, dates));
    } else {
      setValid(false);
    }
  }, [columns, dates, title]);

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
  const handleUpdate = () => {
    if (!title) return window.alert("일정 제목을 적어주세요");
    const start = convertDateToYYYYMMDD(dates[0]);
    const end = convertDateToYYYYMMDD(dates[dates.length - 1]);

    setIsSubmitting(true);

    const values = Object.values(columns);

    const newScheduleDetails: ScheduleDetailDtoUpdateType[] = [];
    for (let i = 0; i < values.length; i++) {
      const column = values[i];

      for (const detail of column) {
        const oldDetail = scheduleDetails.find(
          (d) =>
            d.contentId === detail.place.contentid &&
            d.scheduleOrder === detail.scheduleOrder &&
            d.startTime === detail.startTime &&
            d.endTime === detail.endTime
        );

        if (oldDetail) {
          const newDetail: ScheduleDetailDtoUpdateType = {
            scheduleDetailId: oldDetail?.scheduleDetailId,
            scheduleId: oldDetail.scheduleId,
            contentId: detail.place.contentid,
            scheduleOrder: detail.scheduleOrder,
            startTime: detail.startTime,
            endTime: detail.endTime,
          };
          newScheduleDetails.push(newDetail);
        } else {
          const scheduleId = scheduleDetails[0].scheduleId;
          const newDetail: ScheduleDetailDtoUpdateType = {
            scheduleId,
            contentId: detail.place.contentid,
            scheduleOrder: detail.scheduleOrder,
            startTime: detail.startTime,
            endTime: detail.endTime,
          };
          newScheduleDetails.push(newDetail);
        }
      }
    }

    const submitValue = {
      scheduleDto: {
        scheduleId: schedule.scheduleId,
        metroId: metroId,
        startDate: start,
        endDate: end,
        scheduleTitle: title,
      },

      detailScheduleDto: newScheduleDetails,
    };

    console.log(submitValue);

    // 수정 api 필요
    updateScheduleAPI(submitValue)
      .then((res) => {
        console.log(res.data);
        if (!res) return;

        if (res.status === 200) {
          setIsSubmitting(false);
          console.log("수정 성공");
          setValid(false);
          // navigate("/mypage/schedules");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="schedule-mobile">
      <section className="schedule-mobile-title">
        <h3>일정</h3>
      </section>
      <PlannerInfoAccordian
        title={title}
        setTitle={setTitle}
        openAccordian={openAccordian}
        handleOpenAccordian={handleOpenAccordian}
        metroId={metroId}
        dates={dates}
        registerDate={registerDate}
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
      {plannerAPIAccordianArr.map((apiInfo) => (
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
      <section className="schedule-mobile-btns">
        <button
          className={`schedule-mobile-btns-btn${
            isSubmitting ? " submitting" : valid ? " update" : ""
          }`}
          onClick={isSubmitting ? undefined : () => handleUpdate()}
        >
          {isSubmitting ? (
            <p>
              <LuLoader2 />
            </p>
          ) : (
            <p>수정</p>
          )}
        </button>
      </section>
    </div>
  );
};

export default ScheduleMobile;
