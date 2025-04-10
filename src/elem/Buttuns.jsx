import { X, Pencil, Plus, Trash, Delete, ShieldUser, SquareX, x, UserPlus, UserPen,SquarePlus } from 'lucide-react';
import React from 'react';

const CloseButton = () => (
  <button aria-label="Close page"  style={{
    background: 'transparent',
    border: 'none',
    padding: 0, // Убираем внутренние отступы
    cursor: 'pointer', // Для интерактивности
  }}>
    <X color="grey" />
  </button>
);

const EditButton = ({onClick}) => (
  
  <button onClick={onClick} type = "button" aria-label="Edit" style={{
    background: 'transparent',
    border: 'none',
    padding: 0, // Убираем внутренние отступы
    cursor: 'pointer', // Для интерактивности
    
  }}>
    <Pencil />
  </button>
);

const AddButton = () => (
  <button aria-label="Add"  style={{
    background: 'transparent',
    border: 'none',
    padding: 0, // Убираем внутренние отступы
    cursor: 'pointer', // Для интерактивности
  }}>
    <Plus color="green" />
  </button>
);
<SquareX />
const DeleteButton = ({onClick}) => (
  <button onClick={onClick} aria-label="Delete" type = "button" style={{
    background: 'transparent',
    border: 'none',
    padding: 0, // Убираем внутренние отступы
    cursor: 'pointer', // Для интерактивности
  }}>
    <Trash color="red" />
  </button>
);


  const AddUserButton = ({onClick}) => (
    <button onClick={onClick} aria-label="AddUser"  style={{
      //background: 'transparent',
      backgroundColor: 'lightgray',
      borderRadius: '50%',
      border: 'none',
      padding: 10, // Убираем внутренние отступы

      cursor: 'pointer', // Для интерактивности
    }}>
      <UserPlus color="green" />
    </button>
  );

export { CloseButton, EditButton, AddButton, DeleteButton, Plus1, AddUserButton };



