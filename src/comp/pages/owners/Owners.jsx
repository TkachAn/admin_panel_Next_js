"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TextInput } from "@/elem/inputs/TextInput";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./Owners.module.css"; // Убедись, что путь к файлу стилей верный

export const Owners = () => {
  const [allOwners, setAllOwners] = useState([]); // Все полученные владельцы
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    return allOwners.filter(owner =>
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
/*
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