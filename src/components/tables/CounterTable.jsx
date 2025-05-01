// src/app/components/CountersTable.jsx
"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/spiner/LoadingSpinner";
import Pagination from "../pagination/Pagination";
import Modal from "../Modal/Modal";
import styles from "./CounterTable.module.css";
import AddCounterForm from "../forms/AddCounter";
import { NoteInput, SelectInput, TextModInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
//import AddCounterForm from "@/components/forms/AddCounterForm"; // Импортируем форму

const CountersTable = () => {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [editingCounter, setEditingCounter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Новое состояние
  const [counterTypes, setCounterTypes] = useState(["эл.", "мех."]);

  useEffect(() => {
    fetchCounters();
  }, []);

  useEffect(() => {
    fetchCounters();
  }, [currentPage, search, pageSize]);

  const fetchCounters = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/counters/list?search=${search}&page=${currentPage}&pageSize=${pageSize}`
      );
      const data = await response.json();
      console.log("!!!!!!! data", data);
      if (!data || !data.data) {
        console.error("Empty response from server:", data);
        setCounters([]);
      }
      if (response.ok) {
        setCounters(data.data);
        setTotalCount(data.total);
      } else {
        console.error("Error fetching counters:", data.message);
      }
    } catch (error) {
      console.error("Error fetching counters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEditCounter = (counter) => {
    setEditingCounter(counter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCounter(null);
  };

  const handleSaveCounter = async (e) => {
    e.preventDefault();
    console.log("Сохраняем:", editingCounter);

    try {
      const response = await fetch(`/api/counters/${editingCounter.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingCounter),
      });

      if (response.ok) {
        console.log("Счетчик успешно обновлен");
        setIsModalOpen(false);
        setEditingCounter(null);
        fetchCounters(); // Обновляем таблицу после редактирования
      } else {
        const errorData = await response.json();
        console.error("Ошибка при обновлении счетчика:", errorData);
        // Покажите сообщение об ошибке пользователю
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      // Покажите сообщение об ошибке пользователю
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCounter((prevCounter) => ({
      ...prevCounter,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCounterAdded = () => {
    fetchCounters(); // Обновляем таблицу после добавления счетчика
    closeAddModal(); // Закрываем модальное окно после обновления
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.head}>
        {/* Поиск */}
        <TextModInput label="Поиск"
          value={search}
          onChange={handleSearchChange}
          placeholder="по номеру участка"
        />
        {/* Кнопка "Добавить новый счётчик" */}
        <NormButton children="Добавить новый счётчик" onClick={openAddModal} />
      </div>

      {/* Таблица счётчиков */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Участок №</th>
              <th>Серийный номер</th>
              <th>Модель счётчика</th>
              <th>Тип</th>
              <th>Пломба №</th>
              <th>Магнитная пломба №</th>
              <th>Пломба щита №</th>
              <th>Место установки</th>
              <th>Примечание</th>
            </tr>
          </thead>
          <tbody>
            {counters.map((counter) => (
              <tr key={counter.id} onClick={() => handleEditCounter(counter)}>
                <td>{counter.plot_number}</td>
                <td>{counter.sn}</td>
                <td>{counter.model}</td>
                <td>{counter.type}</td>
                <td>{counter.plomb}</td>
                <td>{counter.magnet_plomb}</td>
                <td>{counter.box_plomb}</td>
                <td>{counter.location}</td>
                <td>{counter.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Пагинация */}
      <div className={styles.paginationContainer}>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Модальное окно редактирования */}
      {isModalOpen && editingCounter && (
        <Modal onClose={handleCloseModal}>
          <form onSubmit={handleSaveCounter} className={styles.editForm}>
            <h3>Редактирование счётчика</h3>
            <div>
              <label htmlFor="plot_number">Номер участка:</label>
              <div className={styles.readOnlyValue}>
                {editingCounter.plot_number}
              </div>
            </div>
            <TextModInput
              label="Серийный номер:"
              id="sn"
              name="sn"
              value={editingCounter.sn || ""}
              onChange={handleInputChange}
            />
            <TextModInput
              label="Модель:"
              id="model"
              name="model"
              value={editingCounter.model || ""}
              onChange={handleInputChange}
            />
            <SelectInput
              label="Тип:"
              id="type"
              name="type"
              value={editingCounter.type || ""}
              onChange={handleInputChange}
              options={counterTypes.map((type) => ({
                value: type,
                label: type,
              }))}
            />
            <TextModInput
              label="Пломба номер :"
              id="plomb"
              name="plomb"
              value={editingCounter.plomb || ""}
              onChange={handleInputChange}
            />
            <TextModInput
              label="Магнитная пломба номер :"
              id="magnet_plomb"
              name="magnet_plomb"
              value={editingCounter.magnet_plomb || ""}
              onChange={handleInputChange}
            />
            <TextModInput
              label="Пломба щита номер :"
              id="box_plomb"
              name="box_plomb"
              value={editingCounter.box_plomb || ""}
              onChange={handleInputChange}
            />
            <TextModInput
              label="Место установки:"
              id="location"
              name="location"
              value={editingCounter.location || ""}
              onChange={handleInputChange}
            />
            <NoteInput
              label="Примечание:"
              id="note"
              name="note"
              value={editingCounter.note || ""}
              onChange={handleInputChange}
            />
            <div className={styles.modalButtons}>
              <NormButton type="submit" className={styles.saveButton}>
                Сохранить
              </NormButton>
              <NormButton
                type="button"
                onClick={handleCloseModal}
                className={styles.cancelButton}
              >
                Отмена
              </NormButton>
            </div>
          </form>

          {/*<form onSubmit={handleSaveCounter} className={styles.editForm}>
            <h3>Редактирование счётчика</h3>
            <div>
              <label htmlFor="plot_number">Номер участка:</label>
              <input
                type="text"
                id="plot_number"
                name="plot_number"
                value={editingCounter.plot_number || ""}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="sn">Серийный номер:</label>
              <input
                type="text"
                id="sn"
                name="sn"
                value={editingCounter.sn || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="model">Модель:</label>
              <input
                type="text"
                id="model"
                name="model"
                value={editingCounter.model || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="type">Тип:</label>
              <select
                id="type"
                name="type"
                value={editingCounter.type || ""}
                onChange={handleInputChange}
              >
                <option value="">Выберите тип</option>
                {counterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="plomb">Пломба номер :</label>
              <input
                type="text"
                id="plomb"
                name="plomb"
                value={editingCounter.plomb || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="magnet_plomb">Магнитная пломба номер :</label>
              <input
                type="text"
                id="magnet_plomb"
                name="magnet_plomb"
                value={editingCounter.magnet_plomb || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="box_plomb">Пломба щита номер :</label>
              <input
                type="text"
                id="box_plomb"
                name="box_plomb"
                value={editingCounter.box_plomb || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="location">Место установки:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editingCounter.location || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="note">Примечание:</label>
              <textarea
                id="note"
                name="note"
                value={editingCounter.note || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.modalButtons}>
              <button type="submit" className={styles.saveButton}>
                Сохранить
              </button>
              <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>
                Отмена
              </button>
            </div>
          </form>*/}
        </Modal>
      )}

      {/* Модальное окно добавления */}
      {isAddModalOpen && (
        <Modal onClose={closeAddModal}>
          <AddCounterForm onCounterAdded={handleCounterAdded} />
        </Modal>
      )}
    </div>
  );
};

export default CountersTable; 