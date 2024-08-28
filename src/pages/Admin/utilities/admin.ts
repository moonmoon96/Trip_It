// 검색 방법 변경
export const handleSearch = (
  setOpenSelect: (value: boolean) => void,
  select: string,
  setSearch: (value: string) => void
) => {
  setSearch(select);
  setOpenSelect(false);
};
