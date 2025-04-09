import React from "react";
import styles from "./Inputs.module.css";

export const NumberInput = ({ value, onChange, placeholder = "Введите число", status = "normal" }) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
