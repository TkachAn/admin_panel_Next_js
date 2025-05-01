//src/components/forms/gem.jsx
'use client';

import React, { useState, useEffect } from 'react';
import s from "./gem.module.css"
import { TextInput } from '@/elem/inputs/inputs';

const GardenPlotForm = () => {
  const [plotNumber, setPlotNumber] = useState('');
  const [plotId, setPlotId] = useState(null);
  const [counterId, setCounterId] = useState(null);
  const [readingData, setReadingData] = useState(null);
  const [ownerNameSearch, setOwnerNameSearch] = useState('');
  const [ownerExists, setOwnerExists] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerNote, setNewOwnerNote] = useState('');
  const [historyId, setHistoryId] = useState(null);
  const [readingNote, setReadingNote] = useState('Новый владелец!');
  const [step, setStep] = useState(1); // Шаг формы


const handleSearchPlot = async () => {
  if (!plotNumber) {
    alert('Пожалуйста, введите номер участка.');
    return;
  }

  try {
    const response = await fetch(`/api/lastReadings?plotNumberSearch=${plotNumber}`);
    const data = await response.json();

    if (response.ok && data.readings.length > 0) {
      const filtered = data.readings.filter(item => item.p_id === Number(plotNumber));
      if (filtered.length === 0) {
        alert('Нет данных по участку.');
        return;
      }
      const latest = filtered.reduce((prev, current) => (prev.h_id > current.h_id ? prev : current));
      setPlotId(latest.p_id);
      setCounterId(latest.c_id);
      setReadingData(latest.reading);
      setStep(2);
    } else {
      alert(data.message || 'Ошибка при поиске участка.');
      setPlotId(null);
      setCounterId(null);
      setReadingData(null);
    }
  } catch (error) {
    console.error('Ошибка при поиске участка:', error);
    alert('Произошла ошибка при связи с сервером.');
  }
};

  const handleSearchOwner = async () => {
    if (!ownerNameSearch) {
      alert('Пожалуйста, введите имя владельца для поиска.');
      return;
    }

    try {
      const response = await fetch(`/api/owner?owner_name=${ownerNameSearch}`);
      const data = await response.json();

      if (response.ok) {
        setOwnerExists(data.exists);
        if (data.exists) {
          setOwnerData(data.owner);
          setStep(4); // Переходим к подтверждению
        } else {
          setNewOwnerName(ownerNameSearch); // Заполняем поле именем из поиска
          setStep(3); // Переходим к созданию нового владельца
        }
      } else {
        alert(data.message || 'Ошибка при поиске владельца.');
        setOwnerExists(null);
        setOwnerData(null);
      }
    } catch (error) {
      console.error('Ошибка при поиске владельца:', error);
      alert('Произошла ошибка при связи с сервером.');
    }
  };

  const handleCreateOwner = async () => {
    if (!newOwnerName) {
      alert('Пожалуйста, введите имя владельца.');
      return;
    }

    try {
      const response = await fetch('/api/owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_name: newOwnerName,
          phone_number: newOwnerPhone,
          email: newOwnerEmail,
          note: newOwnerNote,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setOwnerData(data.owner);
        setStep(4); // Переходим к сохранению истории и показаний
      } else {
        alert(data.message || 'Ошибка при создании владельца.');
      }
    } catch (error) {
      console.error('Ошибка при создании владельца:', error);
      alert('Произошла ошибка при связи с сервером.');
    }
  };

  const handleSaveData = async () => {
    if (!plotId || !counterId || !ownerData?.id) {
      alert('Недостаточно данных для сохранения.');
      return;
    }

    try {
      // 1. Создаем запись в history
      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plot_id: plotId,
          counter_id: counterId,
          owner_id: ownerData.id,
        }),
      });
      const historyData = await historyResponse.json();

      if (historyResponse.ok) {
        setHistoryId(historyData.id);

        // 2. Создаем запись в readings
        const readingsResponse = await fetch('/api/readings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            history_id: historyData.id,
            reading: readingData,
            note: readingNote,
          }),
        });

        if (readingsResponse.ok) {
          alert('Данные успешно сохранены.');
          // Можно сделать редирект или очистить форму
          setStep(1);
          setPlotNumber('');
          setPlotId(null);
          setCounterId(null);
          setReadingData(null);
          setOwnerNameSearch('');
          setOwnerExists(null);
          setOwnerData(null);
          setNewOwnerName('');
          setNewOwnerPhone('');
          setNewOwnerEmail('');
          setNewOwnerNote('');
          setHistoryId(null);
        } else {
          const readingsData = await readingsResponse.json();
          alert(readingsData.message || 'Ошибка при сохранении показаний.');
        }
      } else {
        alert(historyData.message || 'Ошибка при создании записи в истории.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      alert('Произошла ошибка при связи с сервером.');
    }
  };

  return (
    <form className={s.form}>
      {step === 1 && (
        <div className={s.step1}>
          <TextInput
          className={s.input}
          placeholder='введите № участка'
          label="Участок:"
          value={plotNumber}
          onChange={(e) => setPlotNumber(e.target.value)}
          />
          <button type="button" onClick={handleSearchPlot}>
            Поиск
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label htmlFor="owner_name_search">Поиск владельца:</label>
          <input
            type="text"
            id="owner_name_search"
            value={ownerNameSearch}
            onChange={(e) => setOwnerNameSearch(e.target.value)}
          />
          <button type="button" onClick={handleSearchOwner}>
            Поиск владельца
          </button>
        </div>
      )}

      {step === 3 && (
        <div className={s.newOw}>
          <h5>Новый владелец</h5>
          <label htmlFor="new_owner_name">Имя владельца:</label>
          <input
            type="text"
            id="new_owner_name"
            value={newOwnerName}
            onChange={(e) => setNewOwnerName(e.target.value)}
          />
          <label htmlFor="new_owner_phone">Телефон:</label>
          <input
            type="text"
            id="new_owner_phone"
            value={newOwnerPhone}
            onChange={(e) => setNewOwnerPhone(e.target.value)}
          />
          <label htmlFor="new_owner_email">Email:</label>
          <input
            type="email"
            id="new_owner_email"
            value={newOwnerEmail}
            onChange={(e) => setNewOwnerEmail(e.target.value)}
          />
          <label htmlFor="new_owner_note">Примечание:</label>
          <textarea
            id="new_owner_note"
            value={newOwnerNote}
            onChange={(e) => setNewOwnerNote(e.target.value)}
          />
          <button type="button" onClick={handleCreateOwner}>
            Далее
          </button>
        </div>
      )}

      {step === 4 && ownerData && (
        <div>
          <h2>Подтверждение</h2>
          <p>Участок ID: {plotId}</p>
          <p>ID счетчика: {counterId || 706}</p>
          <p>Последние показания: {readingData || 0}</p>
          {ownerExists ? (
            <p>Найден владелец: {ownerData.owner_name}</p>
          ) : (
            <p>Новый владелец: {ownerData.owner_name}</p>
          )}
          <button type="button" onClick={handleSaveData}>
            Сохранить
          </button>
        </div>
      )}
    </form>
  );
};

export default GardenPlotForm;


/*
          <label htmlFor="plot_number">Номер участка:</label>

<input
            type="text"
            id="plot_number"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
          />
*/