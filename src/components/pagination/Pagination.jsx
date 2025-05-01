// src/app/components/Pagination.jsx
// src/app/components/Pagination.jsx
import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = [];
  const pageSizes = [10, 15, 20, 25, 30]; // Возможные варианты размера страницы

  // Логика для отображения ограниченного количества страниц
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Корректировка startPage, если endPage приблизился к концу
  if (endPage - startPage + 1 < maxPagesToShow && endPage === totalPages) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.pageSizeSelector}>
        <label>Строк на странице:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.pageNumbers}>
        {/* Кнопка "Первая страница" */}
        {startPage > 1 && (
          <button onClick={() => onPageChange(1)}>{"<<"}</button>
        )}

        {/* Кнопка "Предыдущая страница" */}
        {currentPage > 1 && (
          <button onClick={() => onPageChange(currentPage - 1)}>{"<"}</button>
        )}

        {/* Отображение номеров страниц */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? styles.active : ""}
          >
            {page}
          </button>
        ))}

        {/* Кнопка "Следующая страница" */}
        {currentPage < totalPages && (
          <button onClick={() => onPageChange(currentPage + 1)}>{">"}</button>
        )}

        {/* Кнопка "Последняя страница" */}
        {endPage < totalPages && (
          <button onClick={() => onPageChange(totalPages)}>{">>"}</button>
        )}
      </div>
    </div>
  );
};

export default Pagination;