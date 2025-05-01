//src/comp/pages/Owners.jsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  SelectInput,
  TextInput,
} from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./Owners.module.css";
import AddOwner from "./winsdow";
import EditOwnerDialog from "./redo_owner";

export const Owners = () => {
  const [allOwners, setAllOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpenAddOwner, setIsOpenAddOwner] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Состояние для диалогового окна редактирования
  const [editingOwner, setEditingOwner] = useState(null);
  const [editFormData, setEditFormData] = useState({
    phone_number: "",
    email: "",
    owner_note: "",
    id: null,
  });

  const fetchOwners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ownersData`);
      if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
      const data = await res.json();
      setAllOwners(data.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const filteredOwners = useMemo(() => {
    if (!searchTerm) {
      return allOwners;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allOwners.filter((owner) =>
      owner.owner_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allOwners, searchTerm]);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = filteredOwners.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOwners]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleOpenEditForm = (owner) => {
    setEditingOwner(owner);
    setEditFormData({
      phone_number: owner.phone_number || "",
      email: owner.email || "",
      owner_note: owner.owner_note || "",
      id: owner.o_id,
    });
    setIsEditDialogOpen(true); // Открываем диалоговое окно
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingOwner(null);
    setEditFormData({ phone_number: "", email: "", owner_note: "", id: null }); // Сброс формы
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editFormData.id) return;

    try {
      const response = await fetch(`/api/owner_redo/${editFormData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: editFormData.phone_number,
          email: editFormData.email,
          note: editFormData.owner_note,
        }),
      });

      if (response.ok) {
        const updatedOwners = allOwners.map((owner) =>
          owner.o_id === editFormData.id ? { ...owner, ...editFormData } : owner
        );
        setAllOwners(updatedOwners);
        setIsEditDialogOpen(false); // Закрываем диалоговое окно после сохранения
        setEditingOwner(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при обновлении владельца");
      }
    } catch (error) {
      console.error("Ошибка при обновлении владельца:", error);
      setError("Произошла ошибка при связи с сервером");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <TextInput
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder="Поиск по имени"
        />
        <NormButton
          children={"Добавить нового владельца"}
          onClick={() => setIsOpenAddOwner(true)}
        />
      </div>
      <div className={styles.tableContainer}>
        {loading && <p>Загрузка данных...</p>}
        {error && <p>Ошибка: {error.message}</p>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя владельца</th>
              <th className={styles.u}>Участок</th>
              <th>SN счётчика</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>О владельце</th>
            </tr>
          </thead>
          <tbody>
            {currentOwners.length > 0 ? (
              currentOwners.map((owner) => (
                <tr
                  key={owner.h_id}
                  onClick={() => handleOpenEditForm(owner)}
                  className={styles.row}
                >
                  <td>{owner.owner_name}</td>
                  <td className={styles.u}>{owner.plot_number}</td>
                  <td>{owner.serial_number}</td>
                  <td>{owner.phone_number}</td>
                  <td>{owner.email}</td>
                  <td>{owner.owner_note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Нет данных</td>
              </tr>
            )}
          </tbody>
        </table>
        {isEditDialogOpen && editingOwner && (
          <EditOwnerDialog
            isOpen={isEditDialogOpen}
            onClose={handleCloseEditDialog}
            onSave={handleSaveEdit}
            editingOwner={editingOwner}
            editFormData={editFormData}
            onInputChange={handleEditInputChange}
          />
        )}
        <AddOwner
          isOpen={isOpenAddOwner}
          onClose={() => setIsOpenAddOwner(false)}
          onSubmit={() => {}}
        />
      </div>
      <div className={styles.pag}>
        <div className={styles.pagination}>
          <div className={styles.box}>
            <SelectInput
              className={styles.select}
              options={[
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            />
            <NormButton
              children={"← назад"}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span>{`${currentPage} / ${totalPages}`}</span>
            <NormButton
              children={"вперёд →"}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/*


          <div className={styles.editDialogOverlay}>
            <div className={styles.editDialog}>
              <h2>Редактировать владельца</h2>
              <p>Имя: {editingOwner.owner_name}</p>

              <PhoneInput
                className={styles.searchInput}
                label="Телефон: "
                placeholder="номер телефона"
                name="phone_number"
                value={editFormData.phone_number}
                onChange={handleEditInputChange}
                isPhoneNumber={true}
              />
              <EmailInput
                className={styles.searchInput}
                label="Email: "
                placeholder="адрес электронной почты"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
              />
              <label htmlFor="owner_note">Примечание:</label>
              <textarea
                id="owner_note"
                name="owner_note"
                value={editFormData.owner_note}
                onChange={handleEditInputChange}
              />
              <div className={styles.editFormButtons}>
                <NormButton children={"Сохранить"} onClick={handleSaveEdit} />
                <NormButton children={"Отмена"} onClick={handleCloseEditDialog} />
              </div>
            </div>
          </div>

"use client";





import React, { useState, useEffect, useMemo } from "react";
import {
  EmailInput,
  NoteInput,
  PhoneInput,
  SelectInput,
  TextInput,
} from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./Owners.module.css";
import AddOwner from "./winsdow";

export const Owners = () => {
  const [allOwners, setAllOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpenAddOwner, setIsOpenAddOwner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Состояние для отображения формы редактирования
  const [editingOwner, setEditingOwner] = useState(null); // Владелец, которого редактируем
  const [editFormData, setEditFormData] = useState({
    // Данные формы редактирования
    phone_number: "",
    email: "",
    owner_note: "",
    id: null, // ID редактируемого владельца
  });

  const fetchOwners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ownersData`);
      if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
      const data = await res.json();
      setAllOwners(data.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const filteredOwners = useMemo(() => {
    if (!searchTerm) {
      return allOwners;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allOwners.filter((owner) =>
      owner.owner_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allOwners, searchTerm]);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = filteredOwners.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOwners]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleOpenEditForm = (owner) => {
    setEditingOwner(owner);
    setEditFormData({
      phone_number: owner.phone_number || "+380",
      email: owner.email || "",
      owner_note: owner.note || "",
      id: owner.o_id, // Используем owner.o_id, предполагая, что это ID владельца
    });
    setIsEditMode(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editFormData.id) return;

    try {
      const response = await fetch(`/api/owner_redo/${editFormData.id}`, {
        method: "PATCH", // Используйте метод PATCH для обновления
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: editFormData.phone_number,
          email: editFormData.email,
          note: editFormData.owner_note,
        }),
      });

      if (response.ok) {
        // Обновляем состояние allOwners после успешного редактирования
        const updatedOwners = allOwners.map((owner) =>
          owner.o_id === editFormData.id ? { ...owner, ...editFormData } : owner
        );
        setAllOwners(updatedOwners);
        setIsEditMode(false);
        setEditingOwner(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при обновлении владельца");
      }
    } catch (error) {
      console.error("Ошибка при обновлении владельца:", error);
      setError("Произошла ошибка при связи с сервером");
    }
  };

  const handleCloseEditForm = () => {
    setIsEditMode(false);
    setEditingOwner(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <TextInput
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder="Поиск по имени"
        />
        <NormButton
          children={"Добавить нового владельца"}
          onClick={() => setIsOpenAddOwner(true)}
        />
      </div>
      <div className={styles.tableContainer}>
        {loading && <p>Загрузка данных...</p>}
        {error && <p>Ошибка: {error.message}</p>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя владельца</th>
              <th className={styles.u}>Участок</th>
              <th>SN счётчика</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>О владельце</th>
            </tr>
          </thead>
          <tbody>
            {currentOwners.length > 0 ? (
              currentOwners.map((owner) => (
                <tr
                  key={owner.h_id}
                  onClick={() => handleOpenEditForm(owner)}
                  className={styles.row}
                >
                  <td>{owner.owner_name}</td>
                  <td className={styles.u}>{owner.plot_number}</td>
                  <td>{owner.serial_number}</td>
                  <td>{owner.phone_number}</td>
                  <td>{owner.email}</td>
                  <td>{owner.owner_note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Нет данных</td>
              </tr>
            )}
          </tbody>
        </table>
        {isEditMode && editingOwner && (
          <div className={styles.editFormOverlay}>
            <div className={styles.editForm}>
              <h2>Редактировать владельца</h2>
              <p>Имя: {editingOwner.owner_name}</p>

              <PhoneInput
                className={styles.searchInput}
                label="Телефон: "
                placeholder="номер телефона"
                name="phone_number"
                value={editFormData.phone_number}
                onChange={handleEditInputChange}
              />

              <EmailInput
                className={styles.searchInput}
                label="эл. почта: "
                placeholder="е-меил"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
              />

              <NoteInput
                label="Примечание:"
                name="owner_note"
                value={editFormData.owner_note}
                onChange={handleEditInputChange}
              />

              <label htmlFor="owner_note">Примечание:</label>
              <textarea
                id="owner_note"
                name="owner_note"
                value={editFormData.owner_note}
                onChange={handleEditInputChange}
              />
              <div className={styles.editFormButtons}>
                <NormButton children={"Сохранить"} onClick={handleSaveEdit} />
                <NormButton children={"Отмена"} onClick={handleCloseEditForm} />
              </div>
            </div>
          </div>
        )}
        <AddOwner
          isOpen={isOpenAddOwner}
          onClose={() => setIsOpenAddOwner(false)}
          onSubmit={() => {}} // Вам нужно реализовать логику добавления владельца
        />
      </div>
      <div className={styles.pag}>
        <div className={styles.pagination}>
          <div className={styles.box}>
            <SelectInput
              className={styles.select}
              options={[
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            />
            <NormButton
              children={"← назад"}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span>{`${currentPage} / ${totalPages}`}</span>
            <NormButton
              children={"вперёд →"}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/*

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SelectInput, TextInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./Owners.module.css"; // Убедись, что путь к файлу стилей верный

import AddOwner from "./winsdow";

export const Owners = () => {
  const [allOwners, setAllOwners] = useState([]); // Все полученные владельцы
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? "PATCH" : "POST";
    const url = formData.id ? `/api/users/${formData.id}` : "/api/users";

    await fetch(url, {
      method,
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

  const fetchOwners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ownersData`); // Запрашиваем все данные
      if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
      const data = await res.json();
      setAllOwners(data.data); // Сохраняем все данные
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []); // Загружаем данные только один раз при монтировании

  // Фильтрация владельцев на основе searchTerm
  const filteredOwners = useMemo(() => {
    if (!searchTerm) {
      return allOwners;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allOwners.filter((owner) =>
      owner.owner_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allOwners, searchTerm]);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = filteredOwners.slice(startIndex, endIndex);

  // Сброс страницы при изменении критерия поиска
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOwners]);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <TextInput
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder="Поиск по имени"
        />
        <NormButton children={"Добавить нового владельца"} onClick={() => setIsOpen(true)}/>
      </div>
      <div className={styles.tableContainer}>
        {loading && <p>Загрузка данных...</p>}
        {error && <p>Ошибка: {error.message}</p>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя владельца</th>
              <th className={styles.u}>Участок</th>
              <th>SN счётчика</th>
              <th>Телефон</th>
              <th>Email</th>
              <th> О владельце</th>
            </tr>
          </thead>
          <tbody>
            {currentOwners.length > 0 ? (
              currentOwners.map((owner) => (
                <tr key={owner.h_id}>
                  <td>{owner.owner_name}</td>
                  <td className={styles.u}>{owner.plot_number}</td>
                  <td>{owner.serial_number}</td>
                  <td>{owner.phone_number}</td>
                  <td>{owner.email}</td>
                  <td>{owner.owner_note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Нет данных</td>
              </tr>
            )}
          </tbody>
        </table>
        <AddOwner
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSubmit}
                
                
                
              />
      </div>
      <div className={styles.pag}>
        <div className={styles.pagination}>
        
          <div className={styles.box}>
          <SelectInput  className={styles.select} 
              options={
                [{ value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" }]
              }
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            />
          <NormButton
            children={"← назад"}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          />

          <span>{`${currentPage} / ${totalPages}`}</span>
          <NormButton
            children={"вперёд →"}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          </div>


        </div>
      </div>
    </div>
  );
};
/*

label={"Записей на странице: "}

            <label>Записей на странице:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>


"use client";

import React, { useState, useEffect } from "react";
import { TextInput } from "@/elem/inputs/TextInput";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./Owners.module.css"; // Убедись, что путь к файлу стилей верный

export const Owners = () => {
  const [allOwners, setAllOwners] = useState([]); // Все полученные владельцы
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchOwners = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/ownersData?owner_name=${searchTerm}`);
      if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
      const data = await res.json();
      setOwners(data.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [searchTerm]);

  const totalPages = Math.ceil(owners.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = owners.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по имени"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.tableContainer}>
        {loading && <p>Загрузка данных...</p>}
        {error && <p>Ошибка: {error.message}</p>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя владельца</th>
              <th className={styles.u}>Участок</th>
              <th>SN счётчика</th>
              <th>Телефон</th>
              <th>Email</th>
              <th> О владельце</th>
            </tr>
          </thead>
          <tbody>
            {currentOwners.length > 0 ? (
              currentOwners.map((owner) => (
                <tr key={owner.h_id}>
                  <td>{owner.owner_name}</td>
                  <td className={styles.u}>{owner.plot_number}</td>
                  <td>{owner.serial_number}</td>
                  <td>{owner.phone_number}</td>
                  <td>{owner.email}</td>
                  <td>{owner.owner_note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Нет данных</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.pag}>
        <div className={styles.pagination}>
          <div className={styles.label}>
            <label>Записей на странице:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← назад
          </button>
          <span>{`${currentPage} / ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            вперёд →
          </button>
        </div>
      </div>
    </div>
  );
};
*/
