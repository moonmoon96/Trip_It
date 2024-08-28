import "./adminReport.css";
import { useEffect, useState } from "react";
import AdminSort from "../components/AdminSort";
import AdminSearch from "../components/AdminSearch";
import { ModalMessageType } from "types/modal";
import { fetchReportsAPI } from "apis/report";
import AdminReportCard from "./components/AdminReportCard";
import AdminReportModal from "./components/AdminReportModal";
import { LuLoader2 } from "react-icons/lu";
import MypageSizeController from "pages/Mypage/components/MypageSizeController";

import MypagePagination from "pages/Mypage/components/MypagePagination";

import useProtectAdmin from "hooks/useProtectAdmin";
import { adminReportSnSArray } from "../data/admin";

const AdminReport = () => {
  useProtectAdmin();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<string[]>(["reportDate", "desc"]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "reportDate",
  });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const [message, setMessage] = useState<ModalMessageType>();
  const [reportInfo, setReportInfo] = useState<{
    reportId: string | number;
    reportFalse: number;
  }>();

  useEffect(() => {
    setLoading(true);
    fetchReportsAPI(sort[0], sort[1], page, size, field.name, search)
      .then((res) => {
        setItems(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [sort, page, size, field.name, search]);

  return (
    <>
      <AdminReportModal
        message={message}
        open={open}
        setOpen={setOpen}
        setItems={setItems}
        items={items}
        setMessage={setMessage}
        reportInfo={reportInfo}
        setReportInfo={setReportInfo}
      />
      <div className="admin-report">
        <div className="admin-report-container">
          <section className="admin-report-panels">
            <span className="admin-report-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="admin-report-panels-right">
              <AdminSort
                sort={sort}
                setSort={setSort}
                sortNSearchArray={adminReportSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="admin-report-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <section className="admin-report-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="admin-report-grid">
            {items?.map((item) => (
              <AdminReportCard
                item={item}
                items={items}
                setItems={setItems}
                key={item.reportId}
                setMessage={setMessage}
                setOpen={setOpen}
                setReportInfo={setReportInfo}
              />
            ))}
          </section>
          {items.length === 0 && (
            <section className="admin-report-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="admin-report-search">
            <AdminSearch
              sortNSearchArray={adminReportSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              field={field}
              setField={setField}
            />
          </section>
          <section className="admin-report-pagination">
            <MypagePagination
              page={page}
              setPage={setPage}
              numPages={numPages}
            />
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminReport;
