// src/app/components/NewCounterForm.js
'use client';

import { useState } from 'react';
import styles from './Form.module.css';

export default function NewCounterForm({ onSubmit }) {
  const [serialNumber, setSerialNumber] = useState('');
  const [model, setModel] = useState('');
  const [note, setNote] = useState('');
  const [startReading, setStartReading] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/counters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serial_number: serialNumber,
        model,
        note,
        start_reading: startReading,
      })
    });

    if (response.ok) {
      const data = await response.json();
      onSubmit?.(data);
    } else {
      alert('Ошибка при добавлении счётчика');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>Серийный номер:
        <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
      </label>
      <label>Модель:
        <input value={model} onChange={(e) => setModel(e.target.value)} />
      </label>
      <label>Примечание:
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <label>Стартовые показания:
        <input type="number" value={startReading} onChange={(e) => setStartReading(e.target.value)} required />
      </label>
      <button type="submit">Добавить счётчик</button>
    </form>
  );
}
