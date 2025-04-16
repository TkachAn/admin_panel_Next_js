//src/elem/buttons/exelButton.jsx
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styles from "./button.module.css"

export const DownloadExcelButton = ({ data }) => {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Таблица");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "таблица.xlsx");
  };

  return (
    <button onClick={handleDownload} className={`${styles.baseButton} ${styles[status]}`}>
      Скачать Excel
    </button>
  );
};

