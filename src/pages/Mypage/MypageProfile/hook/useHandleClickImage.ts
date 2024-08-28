import { ForwardedRef, useCallback } from "react";

const useHandleClickImage = (ref: ForwardedRef<HTMLInputElement>) => {
  return useCallback(() => {
    if (ref && typeof ref === "object" && ref.current) {
      ref.current.click();
    }
  }, [ref]);
};

export default useHandleClickImage;
