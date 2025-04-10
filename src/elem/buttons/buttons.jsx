// src/elem/button/buttons.jsx
import React from "react";
import styles from "./button.module.css";

export const SubmitButton = ({ children = "Сохранить", status = "normal", ...props }) => (
  <button
    type="submit"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const DeleteButton = ({ children = "Удалить", status = "normal", ...props }) => (
  <button
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const AddButton = ({ children = "Добавить", status = "normal", ...props }) => (
  <button
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const EditButton = ({ children = "Изменить", status = "normal", ...props }) => (
  <button
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);
