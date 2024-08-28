import { updateScheduleAPI } from "apis/schedule";
import { NavigateFunction } from "react-router-dom";
import { ModalMessageExtend } from "types/modal";
import { ColumnType, ScheduleDetailDtoUpdateType } from "types/plan";
import { ScheduleDetailType, ScheduleType } from "types/schedule";
import { convertDateToYYYYMMDD, convertDateTypeToDate2 } from "utilities/date";

// SchedulePcStages methods
// 앞으로 이동
export const moveForward = (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  hash: string,
  navigate: NavigateFunction,
  state: any
) => {
  e.stopPropagation();
  if (hash === "#calendars") {
    navigate(`/mypage/schedules`, { state });
  } else if (hash === "#places") {
    navigate(`#calendars`, { state });
  } else {
    navigate(`#places`, { state });
  }
};

// 다른 탭으로 이동
export const handleMoveTo = (
  destiny: string,
  dates: Date[],
  columns: { [key: string]: ColumnType[] },
  navigate: NavigateFunction,
  state: any,
  setOpen: (value: boolean) => void,
  setMessage: React.Dispatch<
    React.SetStateAction<ModalMessageExtend | undefined>
  >
) => {
  if (destiny === "#places") {
    if (dates.length < 2) {
      setOpen(true);
      setMessage({
        type: "alert",
        theme: "normal",
        msgs: {
          title: "날짜 선택을 완료해주세요.",
          detail: "",
        },
      });
      return;
    }
    navigate(`#places`, { state });
  } else if (destiny === "#update") {
    if (dates.length < 2) {
      setOpen(true);
      setMessage({
        type: "alert",
        theme: "normal",
        msgs: {
          title: "날짜 선택을 완료해주세요.",
          detail: "",
        },
      });
      navigate(`#calendars`, { state });
      return;
    }
    if (validPlaces(dates, columns, setOpen, setMessage)) {
      navigate(`#update`, { state });
    }
  }
};

// 이동시 유효성 검사
const validPlaces = (
  dates: Date[],
  columns: { [key: string]: ColumnType[] },
  setOpen: (value: boolean) => void,
  setMessage: React.Dispatch<
    React.SetStateAction<ModalMessageExtend | undefined>
  >
) => {
  for (const date of dates) {
    const column = columns[convertDateTypeToDate2(date)];

    const tourPlaces = column.filter(
      (item) => item.place.contenttypeid !== "32"
    );
    const accommos = column.filter((item) => item.place.contenttypeid === "32");

    if (tourPlaces.length < 1) {
      setOpen(true);
      setMessage({
        type: "alert",
        theme: "normal",
        msgs: {
          title: `${convertDateTypeToDate2(date)}의 장소를 선택해주세요.`,
          detail: "",
        },
      });
      return false; // 즉시 함수 종료
    }

    if (accommos.length < 1) {
      setOpen(true);
      setMessage({
        type: "alert",
        theme: "normal",
        msgs: {
          title: `${convertDateTypeToDate2(date)}의 숙소를 선택해주세요.`,
          detail: "",
        },
      });
      return false; // 즉시 함수 종료
    }
  }

  return true; // 모든 날짜에 대해 유효한 경우
};

// 제출하기
export const handleUpdate = (
  title: string,
  dates: Date[],
  setIsSubmitting: (value: boolean) => void,
  columns: { [key: string]: ColumnType[] },
  metroId: string,
  navigate: NavigateFunction,
  schedule: ScheduleType,
  scheduleDetails: ScheduleDetailType[],
  setValid: (value: boolean) => void
) => {
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
          scheduleOrder: i,
          startTime: detail.startTime,
          endTime: detail.endTime,
        };
        newScheduleDetails.push(newDetail);
      } else {
        const scheduleId = scheduleDetails[0].scheduleId;
        const newDetail: ScheduleDetailDtoUpdateType = {
          scheduleId,
          contentId: detail.place.contentid,
          scheduleOrder: i,
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
        setValid(false);
        navigate("/mypage/schedules");
      }
    })
    .catch((err) => {
      console.log(err);
      setIsSubmitting(false);
    });
};

export const handleSelect = (
  e: React.FormEvent<HTMLParagraphElement>,
  id: string | number,
  selections: (string | number)[],
  setSelections: React.Dispatch<React.SetStateAction<(string | number)[]>>
) => {
  e.stopPropagation();

  const selectionSet = new Set(selections);

  if (!selectionSet.has(id)) {
    setSelections((preSelection) => {
      return [...preSelection, id];
    });
  } else {
    setSelections((preSelection) => preSelection.filter((item) => item !== id));
  }
};
