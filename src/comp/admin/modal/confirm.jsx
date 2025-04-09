// comp/admin/modal/ConfirmModal.jsx
"use client";
import { Dialog } from "@headlessui/react";
import { NormButton } from "@/elem/button";
import styles from "./styles.module.css"; // Создайте этот файл

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.centeredWrapper}>
        <Dialog.Panel className={styles.modalPanel}>
          <Dialog.Title className={styles.dialogTitle}>Подтверждение</Dialog.Title>
          <p className={styles.message}>{message}</p>
          <div className={styles.buttonGroup}>
            <NormButton type="button" onClick={onClose}>
              Отмена
            </NormButton>
            <NormButton type="button" onClick={onConfirm} className={styles.confirmButton}>
              Удалить
            </NormButton>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}