import React from "react";
import styles from "./Inputs.module.css";

export const TextInput = ({label, value, onChange, placeholder = "Введите текст", status = "normal" }) => {
  const isBlocked = status === "blocked";

  return (
    <div className={styles.wrapper}>
    <label className={styles.label}>{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
    </div>
)};
