"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './plotsData.module.css';

const ITEMS_PER_PAGE = 10;

const PlotsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plotNumberFilter, setPlotNumberFilter] = useState('');
  const [ownerNameFilter, setOwnerNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/plots-data?plotNumber=${plotNumberFilter}&ownerName=${ownerNameFilter}&page=${currentPage}`
      );
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setTotalPages(result.totalPages);
      } else {
        setError(result.error || 'Ошибка');
      }
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [plotNumberFilter, ownerNameFilter, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlotNumberChange = (event) => {
    setPlotNumberFilter(event.target.value);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleOwnerNameChange = (event) => {
    setOwnerNameFilter(event.target.value);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className={styles.container}>
      <h1>Данные участков</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Фильтр по номеру участка"
          value={plotNumberFilter}
          onChange={handlePlotNumberChange}
        />
        <input
          type="text"
          placeholder="Фильтр по имени владельца"
          value={ownerNameFilter}
          onChange={handleOwnerNameChange}
          style={{ marginLeft: '1rem' }}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Номер участка</th>
            <th>Имя владельца</th>
            <th>Серийный номер счетчика</th>
            <th>Последняя заметка</th>
            <th>Дата заметки</th>
            <th>Последняя дата показаний</th>
            <th>Время обновления показаний</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <td>{row.plot_number}</td>
              <td>{row.owner_name}</td>
              <td>{row.serial_number}</td>
              <td>{row.history_note}</td>
              <td>{row.history_createAt || 'Нет данных'}</td>
              <td>{row.reading_date || 'Нет данных'}</td>
              <td>{row.reading_updateAt || 'Нет данных'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Назад
        </button>
        <div style={{ margin: '0 1rem' }}>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              style={{ fontWeight: currentPage === pageNumber ? 'bold' : 'normal', margin: '0 0.5rem' }}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Вперед
        </button>
      </div>
    </div>
  );
};

export default PlotsData;
/*
import React, { useState, useEffect } from 'react';
import styles from './plotsData.module.css';

const PlotsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/plots-data');
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
        } else {
          setError(result.error || 'Ошибка');
        }
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className={styles.container}>
      <h1>Данные участков</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Номер участка</th>
            <th>Имя владельца</th>
            <th>Серийный номер счетчика</th>
            <th>Последняя заметка</th>
            <th>Дата заметки</th>
            <th>Последняя дата показаний</th>
            <th>Время обновления показаний</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <td>{row.plot_number}</td>
              <td>{row.owner_name}</td>
              <td>{row.serial_number}</td>
              <td>{row.history_note}</td>
              <td>{row.history_createAt || 'Нет данных'}</td> 
              <td>{row.reading_date || 'Нет данных'}</td>       
              <td>{row.reading_updateAt || 'Нет данных'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlotsData;
*/