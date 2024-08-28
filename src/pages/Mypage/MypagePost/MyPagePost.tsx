import "./mypagePost.css";
import { useEffect, useState } from "react";
import { fetchPostsMAPI } from "apis/post";
import MypageSizeController from "../components/MypageSizeController";
import MypageSort from "../components/MypageSort";
import MypageSearch from "../components/MypageSearch";
import MypagePostCard from "./components/MypagePostCard";
import { ModalMessageType } from "types/modal";
import { LuLoader2 } from "react-icons/lu";
import MypageScheduleModal from "../MypageSchedule/components/MypageScheduleModal";
import { mypagePostSnsArry } from "../data/mypage";
import MypagePagination from "../components/MypagePagination";
import useProtectMypage from "hooks/useProtectMypage";

const MypagePost = () => {
  useProtectMypage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(1);
  const [size, setSize] = useState(12);
  const [sort, setSort] = useState<string[]>(["postDate", "desc"]);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "postDate",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const offset = (page - 1) * size;
  const [selections, setSelections] = useState<(string | number)[]>([]);
  const [message, setMessage] = useState<ModalMessageType>();

  useEffect(() => {
    setTotal(items.length);
  }, [items]);

  useEffect(() => {
    setLoading(true);
    fetchPostsMAPI()
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

  const handleDelete = () => {
    setOpen(!open);
    setMessage({
      type: "confirm",
      msgs: {
        title: "선택한 일정(들)을 삭제하시겠습니까?",
        detail: "일정을 삭제하면 일정을 사용하는 모든 글들도 같이 삭제됩니다.",
      },
    });
  };

  const handleSelectAll = () => {
    if (selections.length >= 0 && selections.length < size) {
      const selectedItems = items
        .filter((item) => {
          return item[field.name].includes(search);
        })
        .slice(offset, offset + size)
        .map((item) => item.scheduleId);

      setSelections(selectedItems);
    } else {
      setSelections([]);
    }
  };
  return (
    <>
      <MypageScheduleModal
        open={open}
        setOpen={setOpen}
        selections={selections}
        setSelections={setSelections}
        items={items}
        setItems={setItems}
        message={message}
        setMessage={setMessage}
      />
      <div className="mypage-post">
        <div className="mypage-post-container">
          <section className="mypage-post-panels">
            <span className="mypage-post-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="mypage-post-panels-right">
              <MypageSort
                sort={sort}
                setSort={setSort}
                items={items}
                setItems={setItems}
                sortNSearchArray={mypagePostSnsArry}
              />
            </span>
          </section>
          <section
            className={`mypage-post-delete${
              selections.length > 0 ? " open" : ""
            }`}
          >
            <p
              className="mypage-post-delete-selecteall"
              onClick={() => handleSelectAll()}
            >
              일괄 선택
            </p>
            <p
              className="mypage-post-delete-title"
              onClick={() => handleDelete()}
            >
              삭제
            </p>
          </section>
          {loading && (
            <section className="mypage-post-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <section className="mypage-post-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="mypage-post-grid">
            {items
              .filter((item) => {
                return item[field.name].includes(search);
              })
              .slice(offset, offset + size)
              .map((item) => (
                <MypagePostCard key={item.scheduleId} post={item} />
              ))}
          </section>
          <section className="mypage-post-search">
            <MypageSearch
              sortNSearchArray={mypagePostSnsArry}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              items={items}
              field={field}
              setField={setField}
              setTotal={setTotal}
            />
          </section>
          {items.length !== 0 && (
            <section className="mypage-post-pagination">
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

export default MypagePost;
