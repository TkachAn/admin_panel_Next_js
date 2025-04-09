// comp/admin/modal/window.jsx
"use client";

import { Dialog } from "@headlessui/react";
import { EmailInput, PassInput } from "@/elem/inputs";
import { TextInput } from "@/elem/inputs/TextInput";
import { Textarea } from "@/elem/inputs/Textarea";
import { NormButton } from "@/elem/button";
import styles from "./styles.module.css";

export default function AddUser({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) {
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <EmailInput
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              className={styles.select}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">Выберите роль</option>
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
              <option value="inspector">Инспектор</option>
              <option value="developer">Разработчик</option>
              <option value="root">Суперадмин</option>
            </select>
            <Textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
            <PassInput
              value={formData.pass}
              onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
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
/*<Dialog open={isOpen} onClose={onClose} className="relative z-50">*/

/*
    <Dialog >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.modalContainer}>
        <Dialog.Panel className={styles.modalPanel}>
          <Dialog.Title className={styles.title}>Новый пользователь</Dialog.Title>
          <form onSubmit={onSubmit} className={styles.form}>
            <TextInput
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <EmailInput
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              className={styles.select}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">Выберите роль</option>
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
              <option value="inspector">Инспектор</option>
              <option value="developer">Разработчик</option>
              <option value="root">Суперадмин</option>
            </select>
            <Textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
            <PassInput
              value={formData.pass}
              onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
            />
            <div className={styles.buttons}>
              <NormButton type="button" onClick={onClose}>Отмена</NormButton>
              <NormButton type="submit">Сохранить</NormButton>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>

*/
