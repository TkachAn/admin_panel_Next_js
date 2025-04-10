// src/elem/button/iconButtons.jsx
import React from "react";
import styles from "./button.module.css";
import { X, Trash, Pencil, Plus, UserPlus, UserPen } from "lucide-react";

const CloseIconButton = ({ onClick, title = "Закрыть" }) => (
  <button onClick={onClick} className={styles.iconButton} title={title}>
    <X size={24} />
  </button>
);

const DeleteIconButton = ({ onClick, title = "Удалить" }) => (
  <button onClick={onClick} className={styles.iconButton} title={title}>
    <Trash size={24} />
  </button>
);

const EditIconButton = ({ onClick, title = "Редактировать" }) => (
  <button onClick={onClick} className={styles.iconButton} title={title}>
    <Pencil size={24} />
  </button>
);

const AddIconButton = ({ onClick, title = "Добавить" }) => (
  <button onClick={onClick} className={styles.iconButton} title={title}>
    <Plus size={24} />
  </button>
);

const UserAddIconButton = ({ onClick, title = "Добавить пользователя" }) => (
  <button onClick={onClick} className={styles.iconButton} title={title}>
    <UserPlus size={24} />
  </button>
);

const UserEditIconButton = ({
  onClick,
  title = "Редактировать пользователя",
}) => (
  <button onClick={onClick} className={styles.iconButton} title={title}>
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
};
