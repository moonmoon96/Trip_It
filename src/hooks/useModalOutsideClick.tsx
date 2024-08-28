import { useEffect } from "react";

function useModalOutsideClick(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  isActive: boolean
) {
  useEffect(() => {
    // 모달 외부 클릭 감지 함수
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Cleanup 이벤트 리스너
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isActive, ref, callback]);
}

export default useModalOutsideClick;
