import React from "react";
import styles from "./CloseButton.module.css";
import { X } from "lucide-react"; // иконка крестика

export const CloseButton = ({ onClick, title = "Закрыть", size = 24 }) => {
  return (
    <button className={styles.closeButton} onClick={onClick} title={title}>
      <X size={size} />
    </button>
  );
};
