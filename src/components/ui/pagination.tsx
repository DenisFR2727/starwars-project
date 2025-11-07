import styles from "./pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  handleNext,
  handlePrev,
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={styles.pagination__btn}
      >
        ← Back
      </button>

      <span className={styles.pagination__info}>
        Page <span>{currentPage}</span> of <span>{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={styles.pagination__btn}
      >
        Next →
      </button>
    </div>
  );
}
