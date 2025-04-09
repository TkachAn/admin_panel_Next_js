import React from "react";
import styles from "./elem.module.css";
import classNames from "classnames";
//import { X } from "lucide-react"; // иконка крестика className={styles.closeButton}

export const NormButton = ({
  children,
  onClick,
  type = "button",
  status = "default", // accent, danger, success, warning
  size = "medium", // small, medium, large
  disabled = false,
  iconLeft = null,
  iconRight = null,
}) => {
  const btnClass = classNames(
    styles.button,
    styles[status],
    styles[size],
    disabled && styles.disabled
  );

  return (
    <button className={btnClass} onClick={onClick} type={type} disabled={disabled}>
      {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  );
};
