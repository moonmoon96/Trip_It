import "./mypagePagination.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

interface MypagePaginationProps {
  page: number;
  setPage: (value: number) => void;
  numPages: number;
}

const MypagePagination = ({
  page,
  setPage,
  numPages,
}: MypagePaginationProps) => {
  return (
    <div className="mypage-pagination">
      <nav className="mypage-pagination-container">
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="mypage-pagination-pageController"
        >
          <FiChevronsLeft />
        </button>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="mypage-pagination-pageController"
        >
          <FiChevronLeft />
        </button>
        {numPages
          ? Array(numPages)
              .fill("_")
              .map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={
                    page === i + 1
                      ? "mypage-pagination-pageNum active"
                      : "mypage-pagination-pageNum"
                  }
                >
                  {i + 1}
                </button>
              ))
          : 1}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === numPages || !numPages}
          className="mypage-pagination-pageController"
        >
          <FiChevronRight />
        </button>
        <button
          onClick={() => setPage(numPages)}
          disabled={page === numPages || !numPages}
          className="mypage-pagination-pageController"
        >
          <FiChevronsRight />
        </button>
      </nav>
    </div>
  );
};

export default MypagePagination;
