import { fetchPlaceAPI } from "apis/place";
import { saveScheduleAPI } from "apis/schedule";
import { NavigateFunction } from "react-router-dom";
import { ModalMessageExtend, ModalMessageType } from "types/modal";
import { PlaceApiType } from "types/place";
import { ColumnType, ScheduleDetailDtoInputType } from "types/plan";
import { convertDateToYYYYMMDD, convertDateTypeToDate2 } from "utilities/date";

// PlannerPcStages methods
// 앞으로 이동
export const moveForward = (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  hash: string,
  navigate: NavigateFunction
) => {
  e.stopPropagation();
  if (hash === "#calendars") {
    navigate(`/mypage/schedules`);
  } else if (hash === "#places") {
    navigate(`#calendars`);
  } else {
    navigate(`#places`);
  }
};

// 다른 탭으로 이동
export const handleMoveTo = (
  destiny: string,
  dates: Date[],
  columns: { [key: string]: ColumnType[] },
  navigate: NavigateFunction,
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
    navigate(`#places`);
  } else if (destiny === "#register") {
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
      navigate(`#calendars`);
      return;
    }
    if (validPlaces(dates, columns, setOpen, setMessage)) {
      navigate(`#register`);
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

// PlannerPcPlaces methods
// 검색창 열기
export const handleOpenSearch = (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  openSearch: boolean,
  setOpenSearch: (value: boolean) => void
) => {
  e.stopPropagation();

  setOpenSearch(!openSearch);
};

// 드롭 다운 여닫기
export const handleOpenDropdown = (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  openDropdown: boolean,
  setOpenDropdown: (value: boolean) => void
) => {
  e.stopPropagation();

  setOpenDropdown(!openDropdown);
};

// 매일 선택
export const handleSelectAll = (
  columns: { [key: string]: ColumnType[] },
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  dates: Date[],
  place: PlaceApiType
) => {
  let newColumns = { ...columns };
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const column = newColumns[convertDateTypeToDate2(date)] || [];

    const newColumnElem: ColumnType = {
      place,
      scheduleOrder: i,
      startTime: "06:00",
      endTime: "07:00",
    };

    const newColumn = [...column, newColumnElem];
    newColumns = { ...newColumns, [convertDateTypeToDate2(date)]: newColumn };
  }

  setColumns({ ...newColumns });
};

// 저장된 장소인지 여부 확인
export const CheckPlace = (
  selectedPlaces: PlaceApiType[],
  contentId: string
) => {
  return selectedPlaces.some((item) => item.contentid === contentId);
};

// 저장된 장소의 위치 확인
export const WhereCheckedPlace = (
  contentId: string,
  index: number,
  columns: { [key: string]: ColumnType[] }
) => {
  return (
    Object.values(columns)[index]?.some(
      (item) => item.place.contentid === contentId
    ) || false
  );
};

// 장소 추가하기
export const handleSelect = (
  e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  place: PlaceApiType,
  date: Date,
  order: number,
  columns: { [key: string]: ColumnType[] },
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  openDropdown: boolean,
  setOpenDropdown: (value: boolean) => void
) => {
  e.stopPropagation();

  const newColumnElem: ColumnType = {
    place,
    scheduleOrder: order,
    startTime: "06:00",
    endTime: "07:00",
  };

  const oldColumn: ColumnType[] = columns[convertDateTypeToDate2(date)] || [];

  setColumns({
    ...columns,
    [convertDateTypeToDate2(date)]: [...oldColumn, newColumnElem],
  });

  setOpenDropdown(!openDropdown);
};

// 장소 삭제하기
export const handleDeselect = (
  e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  contentId: string,
  date: Date,
  columns: { [key: string]: ColumnType[] },
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  openDropdown: boolean,
  setOpenDropdown: (value: boolean) => void
) => {
  e.stopPropagation();
  const newColumn = columns[convertDateTypeToDate2(date)].filter(
    (item) => item.place.contentid !== contentId
  );

  setColumns({
    ...columns,
    [convertDateTypeToDate2(date)]: newColumn,
  });

  setOpenDropdown(!openDropdown);
};

// 장소 선택해서 이동하기
export const handleSelectAndMove = (
  e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  place: PlaceApiType,
  newDate: Date,
  order: number,
  date: Date,
  columns: { [key: string]: ColumnType[] },
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  openDropdown: boolean,
  setOpenDropdown: (value: boolean) => void
) => {
  e.stopPropagation();

  const newColumnElem: ColumnType = {
    place,
    scheduleOrder: order,
    startTime: "06:00",
    endTime: "07:00",
  };

  const curColumns = columns[convertDateTypeToDate2(date)].filter(
    (item) => item.place.contentid !== place.contentid
  );

  const oldColumn: ColumnType[] = columns[convertDateTypeToDate2(newDate)];

  const newColumns = {
    ...columns,
    [convertDateTypeToDate2(date)]: [...curColumns],
    [convertDateTypeToDate2(newDate)]: [...oldColumn, newColumnElem],
  };

  setColumns(newColumns);

  setOpenDropdown(!openDropdown);
};

// 추가 정보 확인하기
export const getPlaceDetail = (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  openDepict: boolean,
  setOpenDepict: (value: boolean) => void
) => {
  e.stopPropagation();

  // 설명 파트 여닫기
  setOpenDepict(!openDepict);
};

// 설명 보기
export const handleOverview = (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  contentId: string,
  openOverview: boolean,
  setOpenOverview: (value: boolean) => void,
  selectedPlace: PlaceApiType | undefined,
  setSelectedPlace: React.Dispatch<
    React.SetStateAction<PlaceApiType | undefined>
  >,
  setLoading: (value: boolean) => void,
  isRequesting: boolean,
  setIsRequesting: (value: boolean) => void
) => {
  e.stopPropagation();
  setOpenOverview(!openOverview);

  if (selectedPlace && selectedPlace.overview) return;

  if (!openOverview) {
    getOverview(
      contentId,
      selectedPlace,
      setSelectedPlace,
      setLoading,
      isRequesting,
      setIsRequesting
    );
  }
};

// 설명 받기
const getOverview = (
  contentId: string,
  selectedPlace: PlaceApiType | undefined,
  setSelectedPlace: React.Dispatch<
    React.SetStateAction<PlaceApiType | undefined>
  >,
  setLoading: (value: boolean) => void,
  isRequesting: boolean,
  setIsRequesting: (value: boolean) => void
) => {
  setLoading(true);
  if (isRequesting) return;

  setIsRequesting(true);

  fetchPlaceAPI(contentId)
    .then((res) => {
      if (!res) return;
      console.log(res.data);

      setSelectedPlace(res.data[0]);
      setLoading(false);
      setIsRequesting(false);
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 0) {
        console.log("네트워크 오류, 연결 상태 확인 요망");
      }
      setLoading(false);
      setIsRequesting(false);
    });
};

// 지도 보기
export const handleOpenMap = (
  e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
  openMap: boolean,
  setOpenMap: (value: boolean) => void
) => {
  e.stopPropagation();
  setOpenMap(!openMap);
};

// 위로 올리기
export const MoveCardUp = (
  e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
  contentId: string,
  columns: { [key: string]: ColumnType[] },
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  date: Date,
  setMoveClassGroup: (value: string[]) => void,
  setMoveOrderGroup: (value: number[]) => void,
  order: number
) => {
  e.stopPropagation();

  // 현재 column 상태를 복사하여 cloneColumn 생성
  const cloneColumn = [...columns[convertDateTypeToDate2(date)]];

  // contentId가 일치하는 아이템을 찾기
  const itemIndex = cloneColumn.findIndex(
    (item) => item.place.contentid === contentId
  );

  // 아이템이 존재하지 않거나, 이미 첫 번째 위치에 있는 경우 처리
  if (itemIndex === -1 || itemIndex === 0) return;

  // 아이템을 위로 이동시키기 위해 스왑
  const itemToMove = cloneColumn[itemIndex];
  cloneColumn.splice(itemIndex, 1); // 해당 아이템 제거
  cloneColumn.splice(itemIndex - 1, 0, itemToMove); // 새로운 위치에 아이템 삽입

  // 상태 업데이트
  setColumns({
    ...columns,
    [convertDateTypeToDate2(date)]: cloneColumn,
  });

  setMoveClassGroup(["move-up", "move-down"]);
  setMoveOrderGroup([order, order - 1]);
};

export const MoveCardDown = (
  e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
  contentId: string,
  columns: { [key: string]: ColumnType[] },
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  date: Date,
  setMoveClassGroup: (value: string[]) => void,
  setMoveOrderGroup: (value: number[]) => void,
  order: number
) => {
  e.stopPropagation();
  // 현재 column 상태를 복사하여 cloneColumn 생성
  const cloneColumn = [...columns[convertDateTypeToDate2(date)]];

  // contentId가 일치하는 아이템을 찾기
  const itemIndex = cloneColumn.findIndex(
    (item) => item.place.contentid === contentId
  );

  // 아이템이 존재하지 않거나, 이미 마지막 위치에 있는 경우 처리
  if (itemIndex === -1 || itemIndex === cloneColumn.length - 1) return;

  // 아이템을 아래로 이동시키기 위해 스왑
  const itemToMove = cloneColumn[itemIndex];
  cloneColumn.splice(itemIndex, 1); // 해당 아이템 제거
  cloneColumn.splice(itemIndex + 1, 0, itemToMove); // 새로운 위치에 아이템 삽입

  // 상태 업데이트
  setColumns({
    ...columns,
    [convertDateTypeToDate2(date)]: cloneColumn,
  });

  setMoveClassGroup(["move-down", "move-up"]);
  setMoveOrderGroup([order, order + 1]);
};

// PlannerPcRegister methods
// 일정 제목
export const handleTitle = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValid: (value: boolean) => void,
  setTitle: (value: string) => void,
  setOpen: (value: boolean) => void,
  setMessage: React.Dispatch<
    React.SetStateAction<ModalMessageExtend | undefined>
  >
) => {
  e.stopPropagation();
  const value = e.target.value;

  if (value.length > 1 && value.length < 50) {
    setValid(true);
    setTitle(value);
    return;
  }
  if (value.length > 50) {
    setOpen(true);
    setMessage({
      type: "alert",
      theme: "normal",
      msgs: {
        title: `제목은 50자 이내로 작성해주세요`,
        detail: "",
      },
    });

    setValid(false);
    return;
  } else {
    setTitle(value);
    setValid(false);
    return;
  }
};

// 일정 등록하기
export const handleSubmit = (
  title: string,
  dates: Date[],
  setIsSubmitting: (value: boolean) => void,
  columns: { [key: string]: ColumnType[] },
  metroId: string,
  navigate: NavigateFunction
) => {
  const start = convertDateToYYYYMMDD(dates[0]);
  const end = convertDateToYYYYMMDD(dates[dates.length - 1]);

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
        navigate("/mypage/schedules");
      }
    })
    .catch((err) => {
      console.log(err);
      setIsSubmitting(false);
    });
};

// 카드 dragStart
export const dragStart = (e: React.DragEvent<HTMLLIElement>) => {
  e.stopPropagation();
  const curCol = e.currentTarget.dataset.col;
  const curRow = e.currentTarget.dataset.row;

  if (!curCol || !curRow) return;

  e.dataTransfer.setData("curCol", curCol);
  e.dataTransfer.setData("curRow", curRow);
};

// 카드 dragEnd
export const dragEnd = (
  e: React.DragEvent<HTMLLIElement>,
  setDroppable: (value: string[]) => void
) => {
  e.preventDefault(); // 기본 동작 방지
  e.stopPropagation();

  setDroppable([]);
};

// 카드 drop
export const drop = (
  e: React.DragEvent<HTMLLIElement>,
  columns: { [key: string]: ColumnType[] },
  setColumns: (value: { [key: string]: ColumnType[] }) => void,
  setDroppable: (value: string[]) => void
) => {
  e.preventDefault(); // 기본 동작 방지 필수
  e.stopPropagation();
  const curCol = e.dataTransfer.getData("curCol"); // index
  const curRow = e.dataTransfer.getData("curRow"); // date
  const newCol = e.currentTarget.dataset.col; // index
  const newRow = e.currentTarget.dataset.row; // date

  if (!newCol || !newRow || !curCol || !curRow) return;

  const curColIndex = Number(curCol);
  const newColIndex = Number(newCol);

  if (curRow === newRow && curColIndex === newColIndex) return;

  // 상태 복사 : 불변성 유지를 위해서
  const updatedColumns = { ...columns };

  // 현재 날짜 컬럼
  const curColumn = [...(updatedColumns[curRow] || [])];
  // 대상 날짜 컬럼
  const targetColumn = [...(updatedColumns[newRow] || [])];

  // 같은 날짜 안에서 이동하는  경우: 순서만 바꿔주면 됨
  if (curRow === newRow) {
    // 기존 데이터 삭제
    const [movedItem] = curColumn.splice(curColIndex, 1);

    curColumn.splice(newColIndex, 0, movedItem);

    // 변경된 현재 날짜 컬럼 업데이트
    updatedColumns[curRow] = curColumn;

    // 다른 날짜로 이동하는 경우
  } else {
    const [movedItem] = curColumn.splice(curColIndex, 1);
    targetColumn.splice(newColIndex, 0, movedItem);

    updatedColumns[curRow] = curColumn;
    updatedColumns[newRow] = targetColumn;
  }

  setColumns(updatedColumns);

  setDroppable([]);
};

// 날짜 dragStart
export const handleDateDragStart = (
  e: React.DragEvent<HTMLElement>,
  droppable: string[]
) => {
  e.stopPropagation();
  if (droppable.length !== 0) return;
  const curRow = e.currentTarget.dataset.row;

  if (!curRow) return;
  e.dataTransfer.setData("curRow", curRow);
};

// 날짜 dragEnd
export const handleDateDragEnd = (e: React.DragEvent<HTMLElement>) => {
  e.preventDefault();
  e.stopPropagation();
};

// 날짜 drop
export const handleDateDrop = (
  e: React.DragEvent<HTMLElement>,
  columns: { [key: string]: ColumnType[] },
  setColumns: (value: { [key: string]: ColumnType[] }) => void
) => {
  e.preventDefault();
  e.stopPropagation();
  const newRow = e.currentTarget.dataset.row;
  const curRow = e.dataTransfer.getData("curRow");

  if (curRow === newRow || !newRow) return;

  const updatedColumns = { ...columns };

  // 현재 날짜 컬럼
  const curColumn = [...(updatedColumns[curRow] || [])];
  // 대상 날짜 컬럼
  const targetColumn = [...(updatedColumns[newRow] || [])];

  updatedColumns[newRow] = curColumn;
  updatedColumns[curRow] = targetColumn;

  setColumns(updatedColumns);
};

// 모든 일정 삭제하기
export const deleteAll = (
  dates: Date[],
  setColumns: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ColumnType[];
    }>
  >,
  navigate: NavigateFunction
) => {
  if (!window.confirm(`일정을 삭제하시겠습니까?`)) {
    return;
  }
  const newColumns = dates?.reduce((acc, date) => {
    // 현재 날짜를 기반으로 빈 배열을 할당
    acc[convertDateTypeToDate2(date)] = [];
    return acc;
  }, {} as Record<string, any>); // 새로운 객체를 생성

  setColumns(newColumns);

  navigate(`/planner`);
};

// RegisterDate methods
// 맵열기
export const handleShowMap = (
  date: Date,
  setDate: (value: Date) => void,
  setOpenMenu: (value: boolean) => void
) => {
  setDate(date);
  setOpenMenu(false);
};
