import "./mypageChipHeader.css";
import { NavLink, useLocation } from "react-router-dom";

export interface MypageChipHeaderProps {
  list: { title: string; link: string }[];
}

const MypageChipHeader = ({ list }: MypageChipHeaderProps) => {
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

export default MypageChipHeader;
