/*
'use client';

import { useState, useEffect } from 'react';

export const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Функция для запроса данных о владельцах
    const fetchOwners = async () => {
      const res = await fetch(`/api/ownersData?owner_name=${searchTerm}`);
      const data = await res.json();
      setOwners(data.data);
    };

    fetchOwners();
  }, [searchTerm]);

  return (
    <div>
      <h1>Список владельцев</h1>
      
      
      <div>
        <input
          type="text"
          placeholder="Поиск по имени"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

     
      <table>
        <thead>
          <tr>
            <th>Имя владельца</th>
            <th>Номер участка</th>
            <th>Серийный номер счётчика</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Примечание</th>
          </tr>
        </thead>
        <tbody>
          {owners.length > 0 ? (
            owners.map((owner) => (
              <tr key={owner.o_id}>
                <td>{owner.owner_name}</td>
                <td>{owner.plot_number}</td>
                <td>{owner.serial_number}</td>
                <td>{owner.phone_number}</td>
                <td>{owner.email}</td>
                <td>{owner.owner_note}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Нет данных</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

*/
'use client';

import React, { useState, useEffect } from 'react';
import styles from './Owners.module.css'; // Убедись, что путь к файлу стилей верный

export const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      const res = await fetch(`/api/ownersData?owner_name=${searchTerm}`);
      const data = await res.json();
      setOwners(data.data);
    };

    fetchOwners();
  }, [searchTerm]);

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
          {owners.length > 0 ? (
            owners.map((owner) => (
              <tr key={owner.o_id}>
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
    </div></div>
  );
};