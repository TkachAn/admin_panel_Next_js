// src/elem/buttons/buttons.jsx
'use client';
import React from "react";
import { signOut } from 'next-auth/react';
import styles from "./button.module.css";
import classNames from "classnames";

export const SubmitButton = ({
  onClick,
  children = "Сохранить",
  status = "normal",
  ...props
}) => (
  <button
    onClick={onClick}
    type="submit"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const DeleteButton = ({
  onClick,
  children = "Удалить",
  status = "normal",
  ...props
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const AddButton = ({
  onClick,
  children = "Добавить",
  status = "normal",
  ...props
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const EditButton = ({
  onClick,
  children = "Изменить",
  status = "normal",
  ...props
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);

export const NormButton = ({
  onClick,
  children,
  status = "normal",
  ...props
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`${styles.baseButton} ${styles[status]}`}
    disabled={status === "blocked"}
    {...props}
  >
    {children}
  </button>
);
/*
export const customButton = ({
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
*/
export const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <button className={styles.out} onClick={handleLogout}>
      Выйти
    </button>
  );
};