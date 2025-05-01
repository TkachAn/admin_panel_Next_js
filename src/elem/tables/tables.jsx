'use client';
import { useState } from 'react';
import styles from './table.module.css'; // Стили отдельно, чтобы был порядок

export default function UniTable({ columns, columnNames, data }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingRow, setEditingRow] = useState(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const index = columns.indexOf(sortColumn);
    const aValue = a[index] || '';
    const bValue = b[index] || '';

    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, 'ru');
    } else {
      return bValue.localeCompare(aValue, 'ru');
    }
  });

  const handleRowClick = (row) => {
    setEditingRow(row);
  };

  const handleEditChange = (e, index) => {
    const updatedRow = [...editingRow];
    updatedRow[index] = e.target.value;
    setEditingRow(updatedRow);
  };

  const handleSave = () => {
    // Тут ты сам можешь добавить обновление в базу / запрос на сервер
    console.log('Сохраняем:', editingRow);
    setEditingRow(null);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columnNames.map((name, idx) => (
              <th key={idx} onClick={() => handleSort(columns[idx])}>
                {name}
                {sortColumn === columns[idx] && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={() => handleRowClick(row)}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {editingRow && (
        <div className={styles.editForm}>
          <h3>Редактирование записи</h3>
          {editingRow.map((value, index) => (
            <div key={index} className={styles.inputGroup}>
              <label>{columnNames[index]}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleEditChange(e, index)}
              />
            </div>
          ))}
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={() => setEditingRow(null)}>Отмена</button>
        </div>
      )}
    </div>
  );
}
