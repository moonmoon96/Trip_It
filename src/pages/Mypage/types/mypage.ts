export interface SortandSearchType {
  field: { name: string; nested?: string[] };
  type: string;
  title: string; // header 제목
  sort: {
    key: string; // 정렬 key 정렬을 하지 않는 경우에는 빈문자열
    value: string; // 정렬 value 정렬을 하지 않는 경우에는 빈문자열 ㄴ
  };
  search: { able: boolean; type?: string; enum?: { [key: string]: string } };
}
