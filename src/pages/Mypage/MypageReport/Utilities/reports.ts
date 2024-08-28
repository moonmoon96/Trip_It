import { updateReportAPI } from "apis/report";
import { MessageType } from "types/template";

export const handleReport = (
  reportId: string,
  reportFalse: number,
  items: any[],
  setItems: (value: any[]) => void,
  setMessage?: (value: MessageType | undefined) => void
) => {
  if (!window.confirm(`신고를 처리하시겠습니까?`)) {
    return;
  }
  // setMessage(fetchMessage(1, reportMsgs));

  updateReportAPI(reportId, reportFalse)
    .then((res) => {
      if (!res) return;

      const code = res.data.code;
      if (code === "ok") {
        // setMessage(fetchMessage(2, reportMsgs));

        const newItems = items.map((item) => ({
          ...item,
          reportFalse:
            item.reportId !== reportId
              ? item.reportFalse
              : reportFalse === 1
              ? "허위 신고"
              : "처리 완료",
        }));

        setItems(newItems);
      }
    })
    .catch((err) => {
      console.log(err);
      // setMessage(fetchMessage(err.msgId, reportMsgs));
    });
};
