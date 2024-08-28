import { ModalMessageType } from "types/modal";
import "./adminReportModal.css";
import { useRef } from "react";
import { unBlockAPI } from "apis/block";
import { updateReportAPI } from "apis/report";
interface AdminReportModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  message: ModalMessageType | undefined;
  items: any[];
  setMessage: (value: ModalMessageType) => void;
  setItems: (value: any[]) => void;
  reportInfo:
    | {
        reportId: string | number;
        reportFalse: number;
      }
    | undefined;
  setReportInfo: React.Dispatch<
    React.SetStateAction<
      | {
          reportId: string | number;
          reportFalse: number;
        }
      | undefined
    >
  >;
}
const AdminReportModal = ({
  open,
  setOpen,
  message,
  setMessage,
  items,
  setItems,
  reportInfo,
  setReportInfo,
}: AdminReportModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    if (!reportInfo) return;
    const reportId = reportInfo.reportId;
    const reportFalse = reportInfo.reportFalse;
    updateReportAPI(reportId, reportFalse)
      .then((res) => {
        if (!res) return;

        const code = res.data.code;
        if (code === "ok" || res.status === 200) {
          // setMessage(fetchMessage(2, reportMsgs));

          const newItems = items.map((item) => ({
            ...item,
            reportFalse:
              item.reportId === reportId ? reportFalse : item.reportFalse,
          }));

          setItems(newItems);

          setMessage({
            type: "alert",
            msgs: {
              title: "신고 처리가 완료되었습니다.",
              detail: "",
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage({
          type: "alert",
          msgs: {
            title: "신고를 처리하는 데 실패했습니다.",
            detail: "잠시 후에 다시 시도해주세요.",
          },
        });
      });
  };
  const handleAlert = () => {};
  const handleCancel = () => {
    setOpen(false);
    setReportInfo({ reportId: "", reportFalse: 0 });
  };

  return (
    <div className={`mypage-schedule-modal${open ? " open" : ""}`}>
      <div className="mypage-schedule-modal-container" ref={modalRef}>
        <div className="mypage-schedule-modal-wrapper">
          <p className="mypage-schedule-modal-title">{message?.msgs.title}</p>
          <p className="mypage-schedule-modal-detail">{message?.msgs.detail}</p>
          <div
            className={`mypage-schedule-modal-btns${
              message?.type === "confirm" ? " confirm" : ""
            }`}
          >
            {message?.type === "confirm" && (
              <button
                className="mypage-schedule-modal-btns-cancel"
                onClick={() => handleCancel()}
              >
                취소
              </button>
            )}
            {message?.type === "confirm" ? (
              <button
                className="mypage-schedule-modal-btns-confirm"
                onClick={() => handleConfirm()}
              >
                확인
              </button>
            ) : (
              <button
                className="mypage-schedule-modal-btns-alert"
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

export default AdminReportModal;
