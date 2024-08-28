import { IoIosArrowDropup } from "react-icons/io";
import "./mypageReportCard.css";
import { useState } from "react";
import { convertYYYYMMDDToDate1 } from "utilities/date";
import { Link } from "react-router-dom";

interface mypageReportCardProps {
  item: any;
  items: any[];
  setItems: (value: any[]) => void;
}
const MypageReportCard = ({ item, items, setItems }: mypageReportCardProps) => {
  const [detail, setDetail] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <li className="mypage-report-card">
      <div className="mypage-report-card-container">
        <div className="mypage-report-card-item">
          <span className="mypage-report-card-item-name">신고한 사람</span>
          <span className="mypage-report-card-item-detail">
            {item.blockUserNickname}
          </span>
        </div>
        <div className="mypage-report-card-item">
          <span className="mypage-report-card-item-name">신고 당한 사람</span>
          <span className="mypage-report-card-item-detail">
            {item.blockedUserNickname}
          </span>
        </div>
        <div className="mypage-report-card-item">
          <span className="mypage-report-card-item-name">차단 날짜</span>
          <span className="mypage-report-card-item-detail">
            {convertYYYYMMDDToDate1(item.reportDate)}
          </span>
        </div>
        <div className="mypage-report-card-item">
          <span className="mypage-report-card-item-name">신고글</span>
          <span className="mypage-report-card-item-detail">
            <Link to={`/detail?post=${item.postId}&user=${item.blockedUserId}`}>
              {item.postTitle}
            </Link>
          </span>
        </div>
        <div className="mypage-report-card-item">
          <span className="mypage-report-card-item-name">신고 내용</span>
          <span className="mypage-report-card-item-detail">
            <button
              className={`mypage-report-card-info-reportType-button ${
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
                className={`mypage-report-card-info-reportType-dropdown${
                  detail ? " active" : ""
                }`}
                onClick={() => setDetail(!detail)}
              >
                <IoIosArrowDropup />
              </span>
            )}
          </span>
        </div>

        <div className="mypage-report-card-btn">
          <button>
            {item.reportFalse === 1
              ? "처리 완료"
              : item.reportFalse === 2
              ? "허위 신고"
              : "처리중"}
          </button>
        </div>
        <div className={`mypage-report-card-lower${detail ? " active" : ""}`}>
          <div className="mypage-report-card-lower-container">
            <p className="mypage-report-card-lower-title">신고내용</p>
            <p className="mypage-report-card-lower-detail">
              {item.reportDetail}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MypageReportCard;
