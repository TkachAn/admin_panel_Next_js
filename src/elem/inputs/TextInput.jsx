import React from "react";
import styles from "./Inputs.module.css";

export const TextInput = ({ value, onChange, placeholder = "Введите текст", status = "normal" }) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
