import "./admin.css";
import AdminChipHeader from "./components/AdminChipHeader";

import { adminList } from "./data/admin";
import { Outlet, useNavigate } from "react-router-dom";

const Admin = () => {
 
  
  return (
    <div className="admin">
      <AdminChipHeader list={adminList} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
