import { debounce } from "utilities/debounce";

// 정렬
export const controlSort = (
  e: React.MouseEvent<HTMLTableHeaderCellElement | HTMLLIElement, MouseEvent>, // 이벤트 객체
  items: any[], // 정렬할 아이템 목록
  setItems: (value: any[]) => void, // 정렬된 아이템을 설정할 함수
  setSort: (value: string[]) => void, // 현재 정렬 상태를 설정할 함수
  open: boolean,
  setOpen: (value: boolean) => void
) => {
  handleSort(e, items, setItems, setSort);
  setOpen(false);
};

// 정렬 함수
const handleSort = (
  e: React.MouseEvent<HTMLTableHeaderCellElement | HTMLLIElement, MouseEvent>, // 이벤트 객체
  items: any[], // 정렬할 아이템 목록
  setItems: (value: any[]) => void, // 정렬된 아이템을 설정할 함수
  setSort: (value: string[]) => void // 현재 정렬 상태를 설정할 함수
) => {
  // 데이터 키와 값을 가져옴
  const sortKey = e.currentTarget.dataset.key;
  const sortValue = e.currentTarget.dataset.value;

  // 키와 값이 없으면 함수 종료
  if (!sortKey || !sortValue) return;

  // 현재 아이템 목록 복사
  const currentItems = [...items];

  // 아이템 목록을 정렬
  const sortedItems = currentItems.sort((item1, item2) => {
    // 아이템이 없으면 0 반환
    if (!item1 || !item2) return 0;

    // 첫 번째 값과 두 번째 값을 비교
    const value1 = item1[sortKey];
    const value2 = item2[sortKey];

    // 값이 문자열인 경우 localeCompare를 사용해 비교
    if (typeof value1 === "string" && typeof value2 === "string") {
      return sortValue === "desc"
        ? value2.localeCompare(value1)
        : value1.localeCompare(value2);
    }
    // 값이 숫자인 경우
    else if (typeof value1 === "number" && typeof value2 === "number") {
      return sortValue === "desc" ? value2 - value1 : value1 - value2;
    }

    // 비교할 수 없는 타입인 경우 0 반환
    return 0;
  });

  // 다음 정렬 방향을 설정
  e.currentTarget.dataset.value = sortValue === "desc" ? "asc" : "desc";

  // 정렬된 아이템 목록을 상태로 설정
  setItems(sortedItems);

  // 정렬 상태를 업데이트
  setSort([sortKey, sortValue]);
};

// 검색
// 검색 입력 변경 핸들러 함수
const handleSearchChange = (
  e: React.ChangeEvent<HTMLInputElement>, // 입력 필드의 변경 이벤트 객체
  setSearch: (value: string) => void, // 검색 상태를 설정하는 함수
  setPage: (value: number) => void, // 페이지 상태를 설정하는 함수
  items: any[], // 검색할 아이템 목록
  field: { name: string; nested?: string[] }, // 검색할 항목의 필드 이름
  setTotal: (value: number) => void // 검색 결과의 총 개수를 설정하는 함수
) => {
  const value = e.target.value; // 입력 필드의 현재 값 (검색어)

  // 검색어를 포함하는 항목의 개수를 계산
  const total = items.filter((item) => {
    return field.nested
      ? item[field.name][`${field.nested?.[1]}`]?.includes(value)
      : item[field.name].includes(value);
  }).length;

  // 검색어를 상태로 설정
  setSearch(value);

  // 검색어 변경 시 페이지를 1로 리셋
  setPage(1);

  // 검색 결과의 총 개수를 상태로 설정
  setTotal(total);
};

// 디바운스된 검색 입력 변경 핸들러 함수
export const debouncedHandleSearchChange = (
  setSearch: (value: string) => void, // 검색 상태를 설정하는 함수
  setPage: (value: number) => void, // 페이지 상태를 설정하는 함수
  items: any[], // 검색할 아이템 목록
  field: { name: string; nested?: string[] }, // 검색할 항목의 필드 이름
  setTotal: (value: number) => void // 검색 결과의 총 개수를 설정하는 함수
) => {
  // 디바운스를 적용하여 검색 입력 변경 핸들러 함수 반환
  return debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    // 디바운스된 함수에서 검색 입력 변경 핸들러 호출
    handleSearchChange(e, setSearch, setPage, items, field, setTotal);
  }, 500); // 500밀리초 지연
};

// field 변경
export const handleField = (
  field: any,
  setField: (value: { name: string; nested?: string[] }) => void,
  setSearch: (value: string) => void,
  setOpen: (value: boolean) => void
) => {
  setField(field);
  setSearch("");
  setOpen(false);
};

// 검색 방법 변경
export const handleSearch = (
  search: string,
  select: string,
  setSearch: (value: string) => void
) => {
  setSearch(select);
};
