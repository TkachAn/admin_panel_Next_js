import React from "react";
import styles from "./Textarea.module.css";

export const Textarea = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Введите текст...",
  rows = 4,
  state = "normal", // normal | accent | blocked
  disabled = false,
}) => {
  return (
    <div className={`${styles.wrapper} ${styles[state]}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={styles.textarea}
        disabled={disabled || state === "blocked"}
      />
    </div>
  );
};
