import "./mypageBlockModal.css";
import { useRef } from "react";
import { unBlockAPI } from "apis/block";
import { ModalMessageType } from "types/modal";

interface MypageBlockModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  message: ModalMessageType | undefined;
  items: any[];
  setMessage: (value: ModalMessageType) => void;
  setItems: (value: any[]) => void;
  unblock: {
    nickname: string;
    blockId: string | number;
  };
  setUnblock: React.Dispatch<
    React.SetStateAction<{
      nickname: string;
      blockId: string | number;
    }>
  >;
}

const MypageBlockModal = ({
  open,
  setOpen,
  message,
  setMessage,
  items,
  setItems,
  unblock,
  setUnblock,
}: MypageBlockModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleConfirm = (
    items: any[],
    setMessage: (value: ModalMessageType) => void,
    setItems: (value: any[]) => void,
    unblock: { nickname: string; blockId: string | number }
  ) => {
    // 차단 해제 API 호출
    unBlockAPI(unblock.blockId)
      .then((res) => {
        // 응답이 없는 경우 함수 종료
        if (!res) return;

        console.log(res.status);

        // 응답 코드가 "ok"인 경우
        if (res.data.code === "ok" || res.status === 200) {
          // 현재 아이템 목록에서 차단 ID가 일치하지 않는 아이템만 필터링
          const newItems = items.filter(
            (item) => item.blockId !== unblock.blockId
          );

          // 필터링된 새 아이템 목록으로 상태 업데이트
          setItems(newItems);

          // 차단 해제 성공 메시지 표시
          // alert(`${nickname}에 대한 차단이 해제 되었습니다.`);
          setMessage({
            type: "alert",
            msgs: {
              title: `${unblock.nickname}님에 대한 차단이 해제되었습니다.`,
              detail: "",
            },
          });
        }
      })
      .catch((error) => {
        // 오류 발생 시, 오류를 콘솔에 출력 (옵션)
        console.log(error);
        // 사용자에게 오류 메시지 표시 (옵션, 필요 시 추가)
        // alert("차단 해제 중 오류가 발생했습니다.");
        setMessage({
          type: "alert",
          msgs: {
            title: `알수 없는 이유로 해제가 되지 않았습니다.`,
            detail: "잠시 후 다시 시도해주세요.",
          },
        });
      });
  };
  const handleAlert = () => {};
  const handleCancel = () => {
    setOpen(false);
    setUnblock({ blockId: "", nickname: "" });
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
                onClick={() =>
                  handleConfirm(items, setMessage, setItems, unblock)
                }
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

export default MypageBlockModal;
