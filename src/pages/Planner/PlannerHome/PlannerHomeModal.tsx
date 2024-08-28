import { metros } from "data/metros";
import "./plannerHomeModal.css";
import { MessageType } from "types/template";
import { useNavigate } from "react-router-dom";
import { getMetroName } from "utilities/metros";

export interface PlannerHomeModalProps {
  message: MessageType;
  setMessage: (value: MessageType | undefined) => void;
}

const PlannerHomeModal = ({ message, setMessage }: PlannerHomeModalProps) => {
  const navigate = useNavigate();
  // 모달창 열고 닫기
  const handleOpenModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    const classname = e.currentTarget.className;

    if (classname === "planner-home-modal") {
      // message가 undefined이면 모달창이 닫힘
      setMessage(undefined);
    }
  };

  const defaultImage = metros.find(
    (metro) => metro.areaCode === message.params
  )?.imgUrl;

  // esc 키를 누르면 모달창이 닫힘
  window.onkeydown = (e) => {
    if (e.key === "Escape") setMessage(undefined);
  };

  const handleMove = () => {
    setMessage(undefined);
    document.body.style.overflow = "auto";
    navigate(`/planner/${getMetroName(message.params)}`);
  };

  return (
    <div className="planner-home-modal" onClick={(e) => handleOpenModal(e)}>
      <div
        className={`planner-home-modal-container`}
        onClick={(e) => handleOpenModal(e)}
      >
        <div className="planner-home-modal-header">
          <figure className="planner-home-modal-body-img-container">
            <img
              src={defaultImage}
              alt="지역 이미지"
              className="planner-home-modal-body-img-"
            ></img>
          </figure>
        </div>
        <div className="planner-home-modal-body">
          <p className="planner-home-modal-body-title">{message.msgs.header}</p>
          <p className="planner-home-modal-body-expl">{message.msgs.main}</p>
        </div>
        <div className="planner-home-modal-footer">
          <button className="cancel" onClick={() => setMessage(undefined)}>
            취소
          </button>
          <button className="next" onClick={() => handleMove()}>
            일정
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerHomeModal;
