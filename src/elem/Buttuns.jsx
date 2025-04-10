import {
  X,
  Pencil,
  Plus,
  Trash,
  Delete,
  ShieldUser,
  SquareX,
  x,
  UserPlus,
  UserPen,
  SquarePlus,
} from "lucide-react";
import React from "react";
/*
const CloseButton = () => (
  <button
    aria-label="Close page"
    style={{
      background: "transparent",
      border: "none",
      padding: 0, // Убираем внутренние отступы
      cursor: "pointer", // Для интерактивности
    }}
  >
    <X color="grey" />
  </button>
);
*/

const AddButton = () => (
  <button
    aria-label="Add"
    style={{
      background: "transparent",
      border: "none",
      padding: 0, // Убираем внутренние отступы
      cursor: "pointer", // Для интерактивности
    }}
  >
    <Plus color="green" />
  </button>
);

const AddUserButton = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="AddUser"
    style={{
      //background: 'transparent',
      backgroundColor: "lightgray",
      borderRadius: "50%",
      border: "none",
      padding: 10, // Убираем внутренние отступы

      cursor: "pointer", // Для интерактивности
    }}
  >
    <UserPlus color="green" />
  </button>
);

export {
  CloseButton,
  EditButton,
  AddButton,
  DeleteButton,
  Plus1,
  AddUserButton,
};
