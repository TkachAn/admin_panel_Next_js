// comp/admin/panel.jsx
"use client";
import { useEffect, useState } from "react";
import { NormButton } from "@/elem/button";
import styles from "./panel.module.css";
import AddUser from "./modal/winsdow";
import ConfirmModal from "./modal/confirm";
import { AddUserButton } from "@/elem/Buttuns";
import{EditIconButton, DeleteIconButton} from '@/elem/buttons/IconButtons'
import ErrorModal from "./modal/errorDel";


export default function AdminAddUserPanel() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // Состояние для сообщения об ошибке
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    role: "",
    note: "",
    createAt: "",
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? "PATCH" : "POST";
    const url = formData.id ? `/api/users/${formData.id}` : "/api/users";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    /*
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
*/

    setIsOpen(false);
    setFormData({
      name: "",
      email: "",
      pass: "",
      role: "",
      note: "",
      createAt: "",
    });
    const updated = await fetch("/api/users").then((res) => res.json());
    setUsers(updated);
  };

  const handleDeleteUser = (userId) => {
    console.log(`handleDeleteUser userId: ${userId}`);
    setUserToDelete(userId);
    setConfirmOpen(true); // Открываем модалку подтверждения
  };

  const handleConfirmDelete = async () => {
    if (userToDelete !== null) {
      console.log('Отправляю DELETE запрос для ID:', userToDelete); 
      try {
        const response = await fetch(`/api/users/${userToDelete}`, { method: "DELETE" });
        if (response.ok) {
          const updatedUsers = await fetch("/api/users").then((res) => res.json());
          setUsers(updatedUsers);
        } else if (response.status === 403) {
          // Обрабатываем ошибку "нельзя удалить самого себя"
          const errorData = await response.json();
          setErrorMessage(errorData.error);
        } else {
          console.error("Ошибка при удалении пользователя:", response.status);
          // Обработка других ошибок
        }
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        setErrorMessage("Произошла ошибка при удалении пользователя.");
      } finally {
        setConfirmOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };
  const handleEditUser = (user) => {
    console.log('EditButton');
    console.log(`user.name: ${user.name}`);
    setUserToEdit(user.id)
    setFormData({
      id: user.id, // пригодится для PATCH
      name: user.name,
      email: user.email,
      role: user.role,
      note: user.note,
      pass: "", // сбрасываем пароль, можно предусмотреть отдельную логику
    });
    setIsOpen(true);
  };
  const closeErrorModal = () => {
    setErrorMessage(null);
  };
  return (
    <div className={styles.panelContainer}>
      <div className={styles.tableTitle}>
        <h2 className={styles.panelTitle}>Пользователи</h2>{" "}
        <AddUserButton onClick={() => setIsOpen(true)} />
        <NormButton onClick={() => setIsOpen(true)}>
          Добавить пользователя
        </NormButton>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderCell}>ID</th>
            <th className={styles.tableHeaderCell}>Имя</th>
            <th className={styles.tableHeaderCell}>Email</th>
            <th className={styles.tableHeaderCell}>Role</th>
            <th className={styles.tableHeaderCell}>Note</th>
            <th className={styles.tableHeaderCell}>Create</th>
            <th className={styles.tableHeaderCell}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{user.id}</td>
              <td className={styles.tableCell}>{user.name}</td>
              <td className={styles.tableCell}>{user.email}</td>
              <td className={styles.tableCell}>{user.role}</td>
              <td className={styles.tableCell}>{user.note}</td>
              <td className={styles.tableCell}>{user.createAt}</td>
              <td className={styles.tableCell}>
                <div className={styles.icons}>
                  <EditIconButton onClick={() => handleEditUser(user)} />
                  <DeleteIconButton onClick={() => handleDeleteUser(user.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddUser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        
      />
      {/* Отображение карточек для мобильных устройств */}
      <div className={styles.cardList}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.cardItem}>
              <span className={styles.cardLabel}>ID:</span> {user.id}
            </div>
            <div className={styles.cardItem}>
              <span className={styles.cardLabel}>Имя:</span> {user.name}
            </div>
            <div className={styles.cardItem}>
              <span className={styles.cardLabel}>Email:</span> {user.email}
            </div>
            <div className={styles.cardItem}>
              <span className={styles.cardLabel}>Role:</span> {user.role}
            </div>
            <div className={styles.cardItem}>
              <span className={styles.cardLabel}>Note:</span> {user.note}
            </div>
            <div className={styles.cardItem}>
              <span className={styles.cardLabel}>Create:</span> {user.createAt}
            </div>
            <NormButton
              onClick={() => handleDeleteUser(user.id)}
              className={styles.deleteButtonCard}
            >
              Удалить
            </NormButton>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Вы уверены, что хотите удалить пользователя с ID: ${userToDelete}?`}
      />
      {errorMessage &&(<ErrorModal message={errorMessage} onClose={closeErrorModal}/>)}
    </div>
  );
}


{/*isEditing={editingUser !== null}*/}
