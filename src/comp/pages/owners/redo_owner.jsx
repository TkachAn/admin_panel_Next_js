"use client";

// src/comp/pages/EditOwnerDialog.jsx
import React, { useState, useCallback } from "react";
import { TextInput, EmailModInput, PhoneInput, NoteInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./Owners.module.css"; // Assuming styles are in Owners.module.css

const EditOwnerDialog = ({
  isOpen,
  onClose,
  onSave,
  editingOwner,
  editFormData,
  onInputChange,
}) => {
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

  return (
    <div className={styles.editDialogOverlay}>
      <div className={styles.editDialog}>
        <h2>Редактировать владельца</h2>
        <p>Имя: {editingOwner.owner_name}</p>

        <PhoneInput
          className={styles.searchInput}
          label="Телефон: "
          placeholder="введите номер"
          name="phone_number"
          value={editFormData.phone_number}
          onChange={onInputChange}
          isPhoneNumber={true}
          onValidation={handlePhoneValidation} // Передаем функцию валидации телефона
          />
        <EmailModInput
          className={styles.searchInput}
          label="Email: "
          placeholder="адрес электронной почты"
          name="email"
          value={editFormData.email}
          onChange={onInputChange}
          onValidation={handleEmailValidation} // Передаем функцию обновления валидности
        />
        <NoteInput
          label="Примечание:"
          name="owner_note"
          value={editFormData.owner_note}
          onChange={onInputChange}
          rows={3}
        />
        <div className={styles.editFormButtons}>
          <NormButton
            children={"Сохранить"}
            onClick={handleSave}
            disabled={!isEmailValid} // Кнопка неактивна, если email невалиден
          />
          <NormButton children={"Отмена"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default EditOwnerDialog;
