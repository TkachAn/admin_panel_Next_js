// src/app/components/ChangeOwnerForm.js
'use client';

import { useState } from 'react';
import styles from './Owners.module.css';

export default function ChangeOwnerForm() {
  const [plotNumber, setPlotNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [viewData, setViewData] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/vplotdata?plot_number=${plotNumber}`);
    const data = await res.json();
    setViewData(data);
  };

  const handleSubmit = async () => {
    if (!viewData) return;
    const res = await fetch('/api/change-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plot_number: plotNumber,
        owner_name: ownerName,
        phone,
        email,
        note,
        serial_number: viewData.serial_number,
        last_reading: viewData.reading,
        p_id: viewData.p_id,
        c_id: viewData.c_id
      })
    });
    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className={styles.container}>
      <h2>Смена владельца участка</h2>
      <label>Номер участка:
        <input value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} />
      </label>
      <button onClick={handleSearch}>Найти</button>

      {viewData && (
        <>
          <label>Владелец:
            <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </label>

          {ownerName && (
            <>
              <label>Телефон:
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>Email:
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </>
          )}

          <label>Счётчик (серийный номер):
            <input value={viewData.serial_number} disabled />
          </label>
          <label>Примечание:
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button onClick={handleSubmit}>Добавить</button>
        </>
      )}
    </div>
  );
}
