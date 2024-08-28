import { NavLink } from "react-router-dom";
import "./footer.css";
import Write from "../pages/Community/Write";
import {
  LuHome,
  LuClipboardSignature,
  LuUser2,
  LuLogOut,
} from "react-icons/lu";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useState } from "react";

const Footer = () => {

  const [write, setWrite] = useState(0);
  const [clicked, setClicked] = useState(3);

  return (
    <footer className="footer">
      <ul className="footer-container">
        <NavLink
          to={`/`}
          className={({ isActive }) =>
            isActive ? "footer-item active" : "footer-item"
          }
          title="홈"
        >
          <LuHome />
        </NavLink>
        <NavLink
          to={`/planner`}
          className={({ isActive }) =>
            isActive ? "footer-item active" : "footer-item"
          }
          title="플레너"
        >
          <LuClipboardSignature />
        </NavLink>
        <NavLink
          to={`/mypage`}
          className={({ isActive }) =>
            isActive ? "footer-item active" : "footer-item"
          }
          title="마이페이지"
        >
          <LuUser2 />
        </NavLink>
        
        <button className={"footer-item"} onClick={()=>{setWrite(1)}}>
          <IoChatbubbleEllipsesOutline />
        </button>
        <NavLink
          to={`/login/normal`}
          className={({ isActive }) =>
            isActive ? "footer-item active" : "footer-item"
          }
          title="로그인"
        >
          {/* <LuLogIn />  */}
          <LuLogOut />
        </NavLink>
      </ul>

      {write == 1 ? (
            <Write
              write={write}
              setWrite={setWrite}
              Nav={clicked}
              setNav={setClicked}
            ></Write>
          ) : null}
    </footer>
    
  );
};

export default Footer;
