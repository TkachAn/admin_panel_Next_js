// elem/modal/error.jsx
import { Dialog } from "@headlessui/react";
import styles from "./styles.module.css"; // Создайте этот файл стилей
import { NormButton } from "@/elem/buttons/buttons";

export default function ErrorModal({ isOpen = true, onClose, message }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.centeredWrapper}>
        <Dialog.Panel className={styles.modalPanel}>
          <Dialog.Title className={styles.dialogTitle}>Ошибка</Dialog.Title>
          <div className={styles.picGroup}>
          <div className={styles.pic}> <img src="chock_chock.png" alt="dack" /> </div>
          <div className={styles.message}>{message}</div>

          </div>
          <div className={styles.buttonGroup}>
            <NormButton onClick={onClose}>Ок</NormButton>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}