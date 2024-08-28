import "./adminSchedule.css";
import { useEffect, useState } from "react";
import AdminSort from "../components/AdminSort";
import AdminSearch from "../components/AdminSearch";
import { fetchSchedulesAAPI } from "apis/schedule";
import { LuLoader2 } from "react-icons/lu";
import MypageSizeController from "pages/Mypage/components/MypageSizeController";
import MypagePagination from "pages/Mypage/components/MypagePagination";
import MypageScheduleCard from "pages/Mypage/MypageSchedule/components/MypageScheduleCard";

import useProtectAdmin from "hooks/useProtectAdmin";
import { adminScheduleSnSArray } from "../data/admin";

const AdminSchedule = () => {
  useProtectAdmin();
  const [items, setItems] = useState<any[]>([]);
  const [selections, setSelections] = useState<(number | string)[]>([]);
  const [sort, setSort] = useState<string[]>(["registerDate", "desc"]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "scheduleTitle",
  });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchSchedulesAAPI(sort[0], sort[1], page, size, field.name, search)
      .then((res) => {
        setItems(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [sort, page, size, field.name, search]);

  return (
    <>
      <div className="admin-schedule-modal"></div>
      <div className="admin-schedule">
        <div className="admin-schedule-container">
          <section className="admin-schedule-panels">
            <span className="admin-schedule-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="admin-schedule-panels-right">
              <AdminSort
                sort={sort}
                setSort={setSort}
                sortNSearchArray={adminScheduleSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="admin-schedule-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <section className="admin-schedule-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="admin-schedule-grid">
            {items?.map((item) => (
              <MypageScheduleCard
                key={item.scheduleId}
                item={item}
                selections={selections}
                setSelections={setSelections}
              />
            ))}
          </section>
          <section className="admin-schedule-search">
            <AdminSearch
              sortNSearchArray={adminScheduleSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              field={field}
              setField={setField}
            />
          </section>
          {items.length !== 0 && (
            <section className="admin-schedule-pagination">
              <MypagePagination
                page={page}
                setPage={setPage}
                numPages={numPages}
              />
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSchedule;
