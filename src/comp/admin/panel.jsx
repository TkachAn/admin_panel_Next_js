// comp/admin/panel.jsx
"use client";
import { useEffect, useState } from "react";
import { NormButton } from "@/elem/button";
import styles from "./panel.module.css";
import AddUser from "./modal/winsdow";
import ConfirmModal from "./modal/confirm";

export default function AdminAddUserPanel() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
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
    setUserToDelete(userId);
    setConfirmOpen(true); // Открываем модалку подтверждения
  };

  const handleConfirmDelete = async () => {
    if (userToDelete !== null) {
      try {
        await fetch(`/api/users/${userToDelete}`, { method: "DELETE" });
        const updatedUsers = await fetch("/api/users").then((res) => res.json());
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        // Можно добавить обработку ошибок (например, отображение уведомления)
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

  return (
    <div className={styles.panelContainer}>
      <div className={styles.tableTitle}>
        <h2 className={styles.panelTitle}>Пользователи</h2>
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
                <NormButton onClick={() => handleDeleteUser(user.id)} className={styles.deleteButton}> 
                  Удалить
                </NormButton>
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
    </div>
  );
}


/*// comp/admin/panel.jsx
"use client";
import { useEffect, useState } from "react";
import { NormButton } from "@/elem/button";
import styles from "./panel.module.css";
import AddUser from "./modal/winsdow";
import ConfirmModal from "./modal/confirm";

export default function AdminAddUserPanel() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // <--- Вот объявление confirmOpen
  const [userToDelete, setUserToDelete] = useState(null);
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
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
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
  
  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
      // После успешного удаления обновите список пользователей
      const updatedUsers = await fetch("/api/users").then((res) => res.json());
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      // Можно добавить обработку ошибок (например, отображение уведомления)
    }
  };

  const handleConfirmDelete = async () => {  };
  const handleCancelDelete = () => { };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.tableTitle}>
        <h2 className={styles.panelTitle}>Пользователи</h2>
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
                <NormButton onClick={() => handleDeleteUser(user.id)} className={styles.deleteButton}>
                  Удалить
                </NormButton>
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

      <AddUser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Вы уверены, что хотите удалить пользователя с ID: ${userToDelete}?`}
      />


    </div>
  );
}
*/