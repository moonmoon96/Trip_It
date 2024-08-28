import "./adminChipHeader.css";
import { NavLink, useLocation } from "react-router-dom";

export interface AdminChipHeaderProps {
  list: { title: string; link: string }[];
}

const AdminChipHeader = ({ list }: AdminChipHeaderProps) => {
  const { pathname } = useLocation();
  return (
    <header
      className={`mypage-header-chip${
        pathname.includes("mypage/schedules/") ? " close" : ""
      }`}
    >
      <ul className="mypage-header-chip-container">
        {list.map((item) => (
          <NavLink
            to={item.link}
            className={({ isActive }) =>
              isActive
                ? "mypage-header-chip-item active"
                : "mypage-header-chip-item"
            }
            key={item.title}
          >
            {item.title}
          </NavLink>
        ))}
      </ul>
    </header>
  );
};

export default AdminChipHeader;
