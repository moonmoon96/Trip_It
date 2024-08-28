import "./adminPost.css";
import { useEffect, useState } from "react";
import { fetchPostsAAPI } from "apis/post";
import { LuLoader2 } from "react-icons/lu";
import { adminPostSnSArray } from "../data/admin";
import AdminSort from "../components/AdminSort";
import AdminSearch from "../components/AdminSearch";
import MypageSizeController from "pages/Mypage/components/MypageSizeController";
import MypagePostCard from "pages/Mypage/MypagePost/components/MypagePostCard";
import MypagePagination from "pages/Mypage/components/MypagePagination";

import useProtectAdmin from "hooks/useProtectAdmin";

const AdminPost = () => {
  useProtectAdmin();
  const [items, setItems] = useState<any[]>([]);
  const [selections, setSelections] = useState<(number | string)[]>([]);
  const [sort, setSort] = useState<string[]>(["postDate", "desc"]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "postTitle",
  });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchPostsAAPI(sort[0], sort[1], page, size, field.name, search)
      .then((res) => {
        setItems(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [sort, page, size, field.name, search]);

  return (
    <>
      <div className="admin-post-modal"></div>
      <div className="admin-post">
        <div className="admin-post-container">
          <section className="admin-post-panels">
            <span className="admin-post-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="admin-post-panels-right">
              <AdminSort
                sort={sort}
                setSort={setSort}
                sortNSearchArray={adminPostSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="admin-post-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && items.length === 0 && (
            <li className="admin-post-grid-empty">검색 결과가 없습니다.</li>
          )}
          <section className="admin-post-grid">
            {items?.map((item) => (
              <MypagePostCard key={item.postId} post={item} />
            ))}
          </section>
          <section className="admin-post-search">
            <AdminSearch
              sortNSearchArray={adminPostSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              field={field}
              setField={setField}
            />
          </section>
          {items.length !== 0 && (
            <section className="admin-post-pagination">
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

export default AdminPost;
