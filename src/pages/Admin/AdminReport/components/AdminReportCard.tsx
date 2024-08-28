import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import "./adminReportCard.css";
import { useState } from "react";
import { convertYYYYMMDDToDate1 } from "utilities/date";

import { updateReportAPI } from "apis/report";
import { ModalMessageType } from "types/modal";
import { Link } from "react-router-dom";

interface mypageReportCardProps {
  item: any;
  items: any[];
  setItems: (value: any[]) => void;
  setOpen: (value: boolean) => void;
  setMessage: (value: ModalMessageType | undefined) => void;
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
const AdminReportCard = ({
  item,
  setOpen,
  items,
  setItems,
  setMessage,
  setReportInfo,
}: mypageReportCardProps) => {
  const [detail, setDetail] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const askHandleReport = (reportFalse: number) => {
    setMessage({
      type: "confirm",
      msgs: {
        title: "해당 신고를 처리하시겠습니까?",
        detail: "",
      },
    });
    setOpen(true);
    setOpenDropdown(false);
    setReportInfo({ reportId: item.reportId, reportFalse });
  };

  const handleReport = (
    reportId: string,
    reportFalse: number,
    items: any[],
    setItems: (value: any[]) => void,
    setMessage: (value: ModalMessageType | undefined) => void
  ) => {
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
        }
      })
      .catch((err) => {
        console.log(err);
        // setMessage(fetchMessage(err.msgId, reportMsgs));
      })
      .finally(() => setOpenDropdown(false));
  };

  console.log(item.reportFalse);

  return (
    <li className="admin-report-card">
      <div className="admin-report-card-container">
        <div className="admin-report-card-item">
          <span className="admin-report-card-item-name">신고한 사람</span>
          <span className="admin-report-card-item-detail">
            {item.blockUserNickname}
          </span>
        </div>
        <div className="admin-report-card-item">
          <span className="admin-report-card-item-name">신고 당한 사람</span>
          <span className="admin-report-card-item-detail">
            {item.blockedUserNickname}
          </span>
        </div>
        <div className="admin-report-card-item">
          <span className="admin-report-card-item-name">차단 날짜</span>
          <span className="admin-report-card-item-detail">
            {convertYYYYMMDDToDate1(item.reportDate)}
          </span>
        </div>
        <div className="admin-report-card-item">
          <span className="admin-report-card-item-name">신고글</span>
          <span className="admin-report-card-item-detail">
            <Link to={`/detail?post=${item.postId}&user=${item.blockedUserId}`}>
              {item.postTitle}
            </Link>
          </span>
        </div>
        <div className="admin-report-card-item">
          <span className="admin-report-card-item-name">신고 내용</span>
          <span className="admin-report-card-item-detail">
            <button
              className={`admin-report-card-info-reportType-button ${
                item.reportType === "R1"
                  ? "lewd"
                  : item.reportType === "R2"
                  ? "violence"
                  : item.reportType === "R3"
                  ? "abuse"
                  : "etc"
              }`}
            >
              {item.reportType === "R1"
                ? "음란"
                : item.reportType === "R2"
                ? "폭력"
                : item.reportType === "R3"
                ? "욕설"
                : "기타"}
            </button>
            {item.reportDetail && (
              <span
                className={`admin-report-card-info-reportType-dropdown${
                  detail ? " active" : ""
                }`}
                onClick={() => setDetail(!detail)}
              >
                <IoIosArrowDropup />
              </span>
            )}
          </span>
        </div>

        <div className="admin-report-card-btn">
          <button onClick={() => setOpenDropdown(!openDropdown)}>
            {item.reportFalse === 1
              ? "신고 처리"
              : item.reportFalse === 2
              ? "허위 신고"
              : "처리중"}
          </button>
          <ul
            className={`admin-report-card-btn-container${
              openDropdown ? " open" : ""
            }`}
          >
            <li
              className="admin-report-card-btn-item"
              onClick={() => askHandleReport(1)}
            >
              신고 처리
            </li>
            <li
              className="admin-report-card-btn-item"
              onClick={() => askHandleReport(2)}
            >
              허위 신고
            </li>
          </ul>
        </div>
        <div className={`admin-report-card-lower${detail ? " active" : ""}`}>
          <div className="admin-report-card-lower-container">
            <p className="admin-report-card-lower-title">신고내용</p>
            <p className="admin-report-card-lower-detail">
              {item.reportDetail}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default AdminReportCard;
