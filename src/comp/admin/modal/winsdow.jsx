// comp/admin/modal/window.jsx
"use client";
//import React, { useState, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { NormButton } from "@/elem/buttons/buttons";
import {
  NoteInput,
  EmailInput,
  PassInput,
  TextInput,
  SelectInput,
  //EmailModInput,
} from "@/elem/inputs/inputs";
import styles from "./styles.module.css";

export default function AddUser({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) {
  /*
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Состояние валидности телефона

  const handleEmailValidation = (isValid) => {
    setIsEmailValid(isValid);
  };
  const handlePhoneValidation = (isValid) => {
    setIsPhoneValid(isValid);
  };

    const handleSave = () => {
    if (!isEmailValid || !isPhoneValid) {
      alert("Пожалуйста, проверьте корректность email и номера телефона.");
      return;
    }
    onSave();
  };

  if (!isOpen || !editingOwner) {
    return null;
  }
*/

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.centeredWrapper}>
        <Dialog.Panel className={styles.modalPanel}>
          <Dialog.Title className={styles.dialogTitle}>
            Новый пользователь
          </Dialog.Title>

          <form onSubmit={onSubmit} className={styles.form}>
            <TextInput
              className={styles.input}
              placeholder="Фамилия и инициалы"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <EmailInput
              className={styles.input}
              label=""
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <SelectInput
              className={styles.input}
              label=""
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={[
                { value: "admin", label: "Администратор" },
                { value: "user", label: "Пользователь" },
                { value: "inspector", label: "Инспектор" },
                { value: "developer", label: "Разработчик" },
                { value: "root", label: "Суперадмин" },
              ]}
            />
            <NoteInput
              className={styles.textarea}
              label=""
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
            <PassInput
              className={styles.input}
              label=""
              value={formData.pass}
              onChange={(e) =>
                setFormData({ ...formData, pass: e.target.value })
              }
            />
            <div className={styles.buttonGroup}>
              <NormButton type="button" onClick={onClose}>
                Отмена
              </NormButton>
              <NormButton type="submit">Сохранить</NormButton>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
