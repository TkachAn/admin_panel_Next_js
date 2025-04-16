// src/elem/button/iconButtons.jsx
'use client';
import React from "react";
import { signOut } from 'next-auth/react';
import styles from "./button.module.css";
import { X, Trash, Pencil, Plus, UserPlus, UserPen,LogOut } from "lucide-react";


const CloseIconButton = ({ onClick, title = "Закрыть" }) => (
  <button onClick={onClick} type="button" className={styles.iconButton} title={title}>
    <X size={24} />
  </button>
);

const DeleteIconButton = ({ onClick, title = "Удалить" }) => (
  <button onClick={onClick}  type="button" className={styles.iconButton} title={title}>
    <Trash size={24} />
  </button>
);

const EditIconButton = ({ onClick, title = "Редактировать" }) => (
  <button onClick={onClick}  type="button" className={styles.iconButton} title={title}>
    <Pencil size={24} />
  </button>
);
const LogOutIconButton = ({ title = "Выход" }) => (
  <button onClick={async () => {
    await signOut({ callbackUrl: '/auth' });
  }}  type="button" className={styles.iconButton} title={title}>
    <LogOut  size={24} />
  </button>
);
const AddIconButton = ({ onClick, title = "Добавить" }) => (
  <button onClick={onClick}  type="button" className={styles.iconButton} title={title}>
    <Plus size={24} />
  </button>
);

const UserAddIconButton = ({ onClick, title = "Добавить пользователя" }) => (
  <button onClick={onClick}  type="button" className={styles.iconButton} title={title}>
    <UserPlus size={24} />
  </button>
);

const UserEditIconButton = ({
  onClick,
  title = "Редактировать пользователя",}) => (
  <button onClick={onClick}  type="button" className={styles.iconButton} title={title}>
    <UserPen size={24} />
  </button>
);

export {
  CloseIconButton,
  DeleteIconButton,
  EditIconButton,
  AddIconButton,
  UserAddIconButton,
  UserEditIconButton,
  LogOutIconButton ,
};
//stroke={'blue'}