// components/PlotTable.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'; // Импортируем русскую локализацию
import styles from './plot.module.css'; // Импортируем CSS-модуль

const PlotDataTable = () => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/plotData?page=${currentPage}&pageSize=10`);
      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.totalRecords);
      setTotalPages(result.totalPages);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Функция для форматирования дат в короткий формат (день.месяц год)
  const formatDate = (date) => {
    return format(new Date(date), 'dd.MM yyyy', { locale: ru });
  };

  // Функция для форматирования времени (часы:минуты)
  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.u}>Участок</th>
            <th>Владелец</th>
            <th className={styles.dd}>Дата</th>
            <th className={styles.rr}>кВт/ч</th>
            <th>Счётчик</th>
            <th>замечания</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td className={styles.u}>{item.plot_number}</td>
                <td>{item.owner_name}</td>
                <td className={styles.d}>{formatDate(item.readings_date)}</td>
                <td className={styles.r}>{item.readings}</td>
                <td>{item.serial_number}</td>
                <td>{item.history_note}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Данные не найдены</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}>
          Назад
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}>
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default PlotDataTable;


/***   <th>История</th>
 * <td>{formatTime(item.readings_updateAt)}</td>
 */

/*
import { useEffect, useState } from 'react';


const PlotTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Число элементов на странице

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/plotData?page=${currentPage}&pageSize=${pageSize}`);
      const result = await res.json();
      setData(result.data);
      setTotalPages(result.totalPages);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Номер участка</th>
            <th>Имя владельца</th>
            <th>Серийный номер счётчика</th>
            <th>История (замечания)</th>
            <th>Дата истории</th>
            <th>Дата показания</th>
            <th>Дата обновления показания</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.plot_number}</td>
              <td>{item.owner_name}</td>
              <td>{item.serial_number}</td>
              <td>{item.history_note}</td>
              <td>{item.history_createAt}</td>
              <td>{item.readings_date}</td>
              <td>{item.readings_updateAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Назад
        </button>
        <span>Страница {currentPage} из {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default PlotTable;*/
