import "./adminBlock.css";
import { useEffect, useState } from "react";
import AdminSort from "../components/AdminSort";
import AdminSearch from "../components/AdminSearch";
import { fetchBlocksAPI } from "apis/block";
import { ModalMessageType } from "types/modal";
import { LuLoader2 } from "react-icons/lu";
import MypageSizeController from "pages/Mypage/components/MypageSizeController";

import MypageBlockCard from "pages/Mypage/MypageBlock/components/MypageBlockCard";
import MypagePagination from "pages/Mypage/components/MypagePagination";

import useProtectAdmin from "hooks/useProtectAdmin";
import AdminBlockCard from "./components/AdminBlockCard";
import { adminBlockSnSArray } from "../data/admin";

const AdminBlock = () => {
  const protectAdmin = useProtectAdmin();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<string[]>(["blockDate", "desc"]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "blockDate",
  });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const [message, setMessage] = useState<ModalMessageType>();
  const [unblock, setUnblock] = useState<{
    nickname: string;
    blockId: string | number;
  }>({ nickname: "", blockId: "" });

  useEffect(() => {
    setLoading(true);

    fetchBlocksAPI(sort[0], sort[1], page, size, field.name, search)
      .then((res) => {
        console.log(res.data.content);

        setItems(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [sort, page, size, field.name, search]);

  return (
    <>
      <div className="admin-block-modal"></div>
      <div className="admin-block">
        <div className="admin-block-container">
          <section className="admin-block-panels">
            <span className="admin-block-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="admin-block-panels-right">
              <AdminSort
                sort={sort}
                setSort={setSort}
                sortNSearchArray={adminBlockSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="admin-block-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <section className="admin-block-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="admin-block-grid">
            {items?.map((item) => (
              <AdminBlockCard
                item={item}
                key={item.blockId}
                setMessage={setMessage}
                setOpen={setOpen}
                setUnblock={setUnblock}
              />
            ))}
          </section>
          <section className="admin-block-search">
            <AdminSearch
              sortNSearchArray={adminBlockSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              field={field}
              setField={setField}
            />
          </section>
          <section className="admin-block-pagination">
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

export default AdminBlock;
