import React from "react";
import styles from "./Inputs.module.css";
import clsx from "clsx";

export const Select = ({
  id,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Выберите...",
  state = "normal", // normal, accent, blocked
  disabled = false,
}) => {
  return (
    <div className={clsx(styles.wrapper, styles[state])}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(styles.select)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
