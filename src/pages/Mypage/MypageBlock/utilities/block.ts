import { unBlockAPI } from "apis/block";
import { ModalMessageType } from "types/modal";

// 차단 해제 버튼 클릭 핸들러 함수
export const handleUnblock = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>, // 버튼 클릭 이벤트 객체
  items: any[],
  setItems: (value: any[]) => void,
  setMessage: (value: ModalMessageType) => void,
  blockId: string | number
) => {
  // 클릭된 버튼의 데이터 속성에서 사용자 닉네임 추출
  const nickname = e.currentTarget.dataset.nickname;

  // 차단 해제 API 호출
  unBlockAPI(blockId)
    .then((res) => {
      // 응답이 없는 경우 함수 종료
      if (!res) return;

      console.log(res.status);

      // 응답 코드가 "ok"인 경우
      if (res.data.code === "ok" || res.status === 200) {
        // 현재 아이템 목록에서 차단 ID가 일치하지 않는 아이템만 필터링
        const newItems = items.filter((item) => item.blockId !== blockId);

        // 필터링된 새 아이템 목록으로 상태 업데이트
        setItems(newItems);

        // 차단 해제 성공 메시지 표시
        // alert(`${nickname}에 대한 차단이 해제 되었습니다.`);
        setMessage({
          type: "alert",
          msgs: {
            title: `${nickname}에 대한 차단이 해제되었습니다.`,
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
          title: `차단 해제 중 오류가 발생했습니다.`,
          detail: "잠시 후 다시 시도해주세요.",
        },
      });
    });
};
