import { ModalMessageExtend, ModalMessageType } from "types/modal";
import "./plannerPcModal.css";
import { useRef } from "react";
import useModalOutsideClick from "hooks/useModalOutsideClick";
import { handleSubmit } from "pages/Planner/PlannerPc/utilities/plannerPc";
import { useNavigate } from "react-router-dom";
import { ColumnType } from "types/plan";

interface PlannerPcModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  message: ModalMessageExtend | undefined;
  setMessage: (value: ModalMessageExtend) => void;
  title: string;
  dates: Date[];
  setIsSubmitting: (value: boolean) => void;
  columns: { [key: string]: ColumnType[] };
  metroId: string;
}
const PlannerPcModal = ({
  open,
  setOpen,
  message,
  setMessage,
  title,
  dates,
  setIsSubmitting,
  columns,
  metroId,
}: PlannerPcModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useModalOutsideClick(modalRef, () => setOpen(false), open);
  const handleConfirm = () => {
    if (!message) return;
    if (message?.theme === "submit") {
      handleSubmit(title, dates, setIsSubmitting, columns, metroId, navigate);
    }
  };

  const handleAlert = () => {};
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className={`planner-pc-modal${open ? " open" : ""}`}>
      <div className="planner-pc-modal-container" ref={modalRef}>
        <div className="planner-pc-modal-wrapper">
          <p className="planner-pc-modal-title">{message?.msgs.title}</p>
          <p className="planner-pc-modal-detail">{message?.msgs.detail}</p>
          <div
            className={`planner-pc-modal-btns${
              message?.type === "confirm" ? " confirm" : ""
            }`}
          >
            {message?.type === "confirm" && (
              <button
                className="planner-pc-modal-btns-cancel"
                onClick={() => handleCancel()}
              >
                취소
              </button>
            )}
            {message?.type === "confirm" ? (
              <button
                className="planner-pc-modal-btns-confirm"
                onClick={() => handleConfirm()}
              >
                확인
              </button>
            ) : message?.theme === "login" ? (
              <button
                className="planner-pc-modal-btns-alert"
                onClick={() => navigate("/login")}
              >
                로그인 하러가기
              </button>
            ) : (
              <button
                className="planner-pc-modal-btns-alert"
                onClick={() => handleCancel()}
              >
                확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerPcModal;
