// src/app/components/LoadingSpinner.jsx
import React from "react";
import styles from "./loading.module.css"; // Импортируем стили

const LoadingSpinner = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  );
};

export default LoadingSpinner;
