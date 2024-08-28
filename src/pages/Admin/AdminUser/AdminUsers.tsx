import "./adminUsers.css";
import { useEffect, useState } from "react";
import { fetchUsersAPI } from "apis/users";
import { UserType } from "types/users";
import AdminSort from "../components/AdminSort";
import AdminSearch from "../components/AdminSearch";
import AdminUsersCard from "./components/AdminUsersCard";
import { LuLoader2 } from "react-icons/lu";
import { usersSnSArray } from "../data/admin";
import MypageSizeController from "pages/Mypage/components/MypageSizeController";
import MypagePagination from "pages/Mypage/components/MypagePagination";
import useProtectAdmin from "hooks/useProtectAdmin";

const AdminUsers = () => {
  useProtectAdmin();
  const [users, setUsers] = useState<UserType[]>([]);
  const [sort, setSort] = useState<string[]>(["regdate", "desc"]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [field, setField] = useState<{ name: string; nested?: string[] }>({
    name: "regdate",
  });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(1);
  const numPages = Math.ceil(total / size); // 총 페이지 개수
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUsersAPI(sort[0], sort[1], page, size, field.name, search)
      .then((res) => {
        setUsers(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [sort, page, size, field.name, search]);

  return (
    <>
      <div className="admin-users-modal"></div>
      <div className="admin-users">
        <div className="admin-users-container">
          <section className="admin-users-panels">
            <span className="admin-users-panels-left">
              <MypageSizeController size={size} setSize={setSize} />
            </span>
            <span className="admin-users-panels-right">
              <AdminSort
                sort={sort}
                setSort={setSort}
                sortNSearchArray={usersSnSArray}
              />
            </span>
          </section>
          {loading && (
            <section className="admin-users-grid-loading">
              <LuLoader2 />
            </section>
          )}
          {!loading && users.length === 0 && (
            <section className="admin-users-grid-empty">
              검색 결과가 없습니다.
            </section>
          )}
          <section className="admin-users-grid">
            {users?.map((user) => (
              <AdminUsersCard user={user} key={user.userId} />
            ))}
          </section>
          <section className="admin-users-search">
            <AdminSearch
              sortNSearchArray={usersSnSArray}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              field={field}
              setField={setField}
            />
          </section>
          {users.length !== 0 && (
            <section className="admin-users-pagination">
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

export default AdminUsers;
