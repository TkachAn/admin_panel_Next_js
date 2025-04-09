import React from "react";
import styles from "./Inputs.module.css";

const PassInput = ({ value, onChange, placeholder = "Введите пароль", status = "normal" }) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="password"
      autoComplete="new-password"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
export default PassInput;