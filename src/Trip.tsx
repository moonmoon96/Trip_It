import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "layouts/RootLayout";
import Login from "./pages/Auth/Login";
import Normal from "./pages/Auth/Normal";
import Join from "./pages/Auth/Join";
import Community from "./pages/Community/Community";
import Details from "./pages/Community/Detail";
import Chat from "./pages/Chat/Chat";
import refreshAPI from "./utilities/TokenRefresher";
import PlannerHome from "pages/Planner/PlannerHome/PlannerHome";
import Planner from "pages/Planner/Planner";
import Mypage from "pages/Mypage/Mypage";
import MypageProfile from "pages/Mypage/MypageProfile/MypageProfile";
import MypageBlock from "pages/Mypage/MypageBlock/MypageBlock";
import MypageReport from "pages/Mypage/MypageReport/MypageReport";
import MypagePost from "pages/Mypage/MypagePost/MyPagePost";
import MypageSchedule from "pages/Mypage/MypageSchedule/MyPageSchedule";
import MypageSchedulePost from "pages/Mypage/MypageSchedule/MypageSchedulePost/MypageSchedulePost";
import Admin from "pages/Admin/Admin";
import AdminUsers from "pages/Admin/AdminUser/AdminUsers";
import AdminUser from "pages/Admin/AdminUser/AdminUser";
import AdminBlock from "pages/Admin/AdminBlock/AdminBlock";
import AdminReport from "pages/Admin/AdminReport/AdminReport";
import AdminPost from "pages/Admin/AdminPost/AdminPost";
import AdminSchedule from "pages/Admin/AdminSchedule/AdminSchedule";

function Trip() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await refreshAPI.get("");
      } catch (err) {
        // console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Chat />
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<Community></Community>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/login/normal" element={<Normal></Normal>}></Route>
          <Route path="/join" element={<Join></Join>}></Route>
          <Route path="/detail" Component={Details}></Route>
          <Route path="/planner/:metroName" element={<Planner />} />
          <Route path="/mypage" element={<Mypage />}>
            <Route path="/mypage" element={<MypageProfile />} />
            <Route path="/mypage/profile" element={<MypageProfile />} />
            <Route path="/mypage/blocks" element={<MypageBlock />} />
            <Route path="/mypage/reports" element={<MypageReport />} />
            <Route path="/mypage/posts" element={<MypagePost />} />
            <Route path="/mypage/schedules" element={<MypageSchedule />} />
            <Route
              path="/mypage/schedules/:scheduleId"
              element={<MypageSchedulePost />}
            />
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route path="/admin" element={<AdminUsers />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:userId" element={<AdminUser />} />
            <Route path="/admin/blocks" element={<AdminBlock />} />
            <Route path="/admin/reports" element={<AdminReport />} />
            <Route path="/admin/posts" element={<AdminPost />} />
            <Route path="/admin/schedules" element={<AdminSchedule />} />
          </Route>
          <Route path="/planner" element={<PlannerHome />} />
        </Route>
      </Routes>
    </>
  );
}

export default Trip;
