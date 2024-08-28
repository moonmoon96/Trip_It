import "./adminBlockCard.css";
import { useLocation } from "react-router-dom";
import { convertYYYYMMDDToDate1 } from "utilities/date";
import { ModalMessageType } from "types/modal";
interface AdminBlockCardProps {
  item: any;
  setMessage: (value: ModalMessageType) => void;
  setOpen: (value: boolean) => void;
  setUnblock: React.Dispatch<
    React.SetStateAction<{
      nickname: string;
      blockId: string | number;
    }>
  >;
}
const AdminBlockCard = ({
  item,
  setMessage,
  setOpen,
  setUnblock,
}: AdminBlockCardProps) => {
  const { pathname } = useLocation();
  const handleUnblock = (nickname: string, blockId: string | number) => {
    setOpen(true);
    setMessage({
      type: "confirm",
      msgs: {
        title: "해당 유저를 차단 해제하시겠습니까?",
        detail: "",
      },
    });
    setUnblock({ nickname, blockId });
  };
  return (
    <li className="admin-block-card">
      <div className="admin-block-card-container">
        <div className="admin-block-card-info-nickname">
          <span className="admin-block-card-info-nickname-name">
            차단한 유저
          </span>
          <span className="admin-block-card-info-nickname-detail">
            {item.blockUserNickname}
          </span>
        </div>
        <div className="admin-block-card-info-nickname">
          <span className="admin-block-card-info-nickname-name">
            차단 당한 유저
          </span>
          <span className="admin-block-card-info-nickname-detail">
            {item.blockedUserNickname}
          </span>
        </div>
        <div className="admin-block-card-info-date">
          <span>차단 날짜 </span>
          <span>{convertYYYYMMDDToDate1(item.blockDate)}</span>
        </div>
        <div className="admin-block-card-btn">
          <button
            onClick={
              pathname.includes("/mypage")
                ? () => handleUnblock(item.nickname, item.blockId)
                : undefined
            }
          >
            차단해제
          </button>
        </div>
      </div>
    </li>
  );
};

export default AdminBlockCard;
