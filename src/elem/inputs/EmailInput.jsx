//src/elem/inputs/EmailInput.jsx
import React from "react";
import styles from "./Inputs.module.css";

const EmailInput = ({ value, onChange, placeholder = "Введите e-mail", status = "normal" }) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="email"
      value={value} // Просто используем переданное значение
      onChange={onChange} // Передаем функцию onChange
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};

export default EmailInput;
