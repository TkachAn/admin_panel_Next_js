//components/forms/AddUser.jsx

"use client";

import React, { useState } from "react";
import styles from "./gem.module.css";
import { EmailModInput, SelectInput, TextModInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";

const AddUserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Значение по умолчанию
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при добавлении пользователя.");
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setSuccessMessage("Пользователь успешно добавлен!");

      // Возможно, здесь потребуется обновить таблицу пользователей
      // Вызовем функцию для повторного получения списка пользователей
      // (ее мы добавим позже в AdminPanelTable)
    } catch (e) {
      setError("Произошла ошибка при отправке данных на сервер.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2></h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <TextModInput
            id="name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя" // Можно добавить плейсхолдер
            label="Имя:" // Лейбл уже есть снаружи
          />
        </div>
        <div className={styles.formGroup}>
          <EmailModInput
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            label="Email:"
          />
        </div>
        <div className={styles.formGroup}>
          <TextModInput // Или создайте PasswordInput, если он у вас есть
            type="password"
            label="пароль:"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>
        <div className={styles.formGroup}>
          <SelectInput
            label="Роль:"
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "user", label: "Пользователь" },
              { value: "admin", label: "Администратор" },
              { value: "inspector", label: "Инспектор" },
              { value: "developer", label: "Разработчик" },
            ]}
          />
        </div>
        <NormButton type="submit" children="Добавить пользователя" />
      </form>
    </div>
  );
};

export default AddUserForm;

/*

'use client';

import React, { useState } from 'react';
import styles from './gem.module.css';

const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Значение по умолчанию
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка при добавлении пользователя.');
        return;
      }

      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setSuccessMessage('Пользователь успешно добавлен!');

      // Возможно, здесь потребуется обновить таблицу пользователей
      // Вызовем функцию для повторного получения списка пользователей
      // (ее мы добавим позже в AdminPanelTable)

    } catch (e) {
      setError('Произошла ошибка при отправке данных на сервер.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Добавить нового пользователя</h2>
      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Имя:</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Пароль:</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="role" className={styles.label}>Роль:</label>
          <select
            id="role"
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
            <option value="inspector">Инспектор</option>
            <option value="developer">Разработчик</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>Добавить пользователя</button>
      </form>
    </div>
  );
};

export default AddUserForm;
*/
