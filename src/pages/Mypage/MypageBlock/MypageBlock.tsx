import "./mypageBlock.css";
import { useEffect, useState } from "react";
import { fetchBlockAPI } from "apis/block";
import MypageBlockModal from "./components/MypageBlockModal";
import MypageBlockCard from "./components/MypageBlockCard";
import { ModalMessageType } from "types/modal";
import { LuLoader2 } from "react-icons/lu";
import MypageSizeController from "../components/MypageSizeController";
import MypageSort from "../components/MypageSort";
import { mypageBlockSnSArray } from "../data/mypage";
import MypageSearch from "../components/MypageSearch";
import MypagePagination from "../components/MypagePagination";
import useProtectMypage from "hooks/useProtectMypage";

const MypageBlock = () => {
  useProtectMypage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(1);
  const [size, setSize] = useState(12);
  const [sort, setSort] = useState<string[]>(["blockDate", "desc"]);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "blockDate",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const offset = (page - 1) * size;
  const [message, setMessage] = useState<ModalMessageType>();
  const [unblock, setUnblock] = useState<{
    nickname: string;
    blockId: string | number;
  }>({ nickname: "", blockId: "" });

  useEffect(() => {
    setTotal(items.length);
  }, [items]);

  useEffect(() => {
    setLoading(true);
    fetchBlockAPI()
      .then((res) => {
        if (!res) {
          setLoading(false);
          return;
        }
        console.log(res.data);
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
      <MypageBlockModal
        message={message}
        open={open}
        setOpen={setOpen}
        setItems={setItems}
        items={items}
        setMessage={setMessage}
        unblock={unblock}
        setUnblock={setUnblock}
      />
      <div className="mypage-block">
        <div className="mypage-block-container">
          <section className="mypage-block-panels">
            <span className="mypage-block-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="mypage-block-panels-right">
              <MypageSort
                sort={sort}
                setSort={setSort}
                items={items}
                setItems={setItems}
                sortNSearchArray={mypageBlockSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="mypage-block-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <section className="mypage-block-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="mypage-block-grid">
            {items
              .filter((item) => {
                console.log(field.name);

                return item[field.name].includes(search);
              })
              .slice(offset, offset + size)
              .map((item) => (
                <MypageBlockCard
                  key={item.blockId}
                  item={item}
                  setMessage={setMessage}
                  setOpen={setOpen}
                  setUnblock={setUnblock}
                />
              ))}
          </section>
          <section className="mypage-block-search">
            <MypageSearch
              sortNSearchArray={mypageBlockSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              items={items}
              field={field}
              setField={setField}
              setTotal={setTotal}
            />
          </section>
          <section className="mypage-block-pagination">
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

export default MypageBlock;
