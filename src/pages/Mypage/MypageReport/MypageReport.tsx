import "./mypageReport.css";
import { useEffect, useState } from "react";
import { fetchReportAPI } from "apis/report";
import MypageReportModal from "./components/MypageReportModal";
import MypageReportCard from "./components/MypageReportCard";
import { LuLoader2 } from "react-icons/lu";
import MypageSizeController from "../components/MypageSizeController";
import MypageSort from "../components/MypageSort";
import { mypageReportSnSArray } from "../data/mypage";
import MypageSearch from "../components/MypageSearch";
import MypagePagination from "../components/MypagePagination";
import useProtectMypage from "hooks/useProtectMypage";

const MypageReport = () => {
  useProtectMypage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(1);
  const [size, setSize] = useState(12);
  const [sort, setSort] = useState<string[]>(["reportDate", "desc"]);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "reportDate",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const offset = (page - 1) * size;
  const [message, setMessage] = useState<{
    type: string;
    msgs: { title: string; detail: string };
  }>();

  useEffect(() => {
    setTotal(items.length);
  }, [items]);
  useEffect(() => {
    setLoading(true);
    fetchReportAPI()
      .then((res) => {
        if (!res) {
          setLoading(false);
          return;
        }
        const receivedItems = res.data;
        setItems(receivedItems);
        setTotal(receivedItems.length);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <MypageReportModal />
      <div className="mypage-report">
        <div className="mypage-report-container">
          <section className="mypage-report-panels">
            <span className="mypage-report-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="mypage-report-panels-right">
              <MypageSort
                sort={sort}
                setSort={setSort}
                items={items}
                setItems={setItems}
                sortNSearchArray={mypageReportSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="mypage-report-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <section className="mypage-report-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="mypage-report-grid">
            {items
              .filter((item) => {
                console.log(field.name);

                return item[field.name].includes(search);
              })
              .slice(offset, offset + size)
              .map((item) => (
                <MypageReportCard
                  key={item.reportId}
                  item={item}
                  items={items}
                  setItems={setItems}
                />
              ))}
          </section>
          <section className="mypage-report-search">
            <MypageSearch
              sortNSearchArray={mypageReportSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              items={items}
              field={field}
              setField={setField}
              setTotal={setTotal}
            />
          </section>
          <section className="mypage-report-pagination">
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

export default MypageReport;
