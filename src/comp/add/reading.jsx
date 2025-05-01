//src/comp/add/reading.jsx
'use client';

import React, { useState } from 'react';
import { TextModInput, NumInput, NoteInput } from '@/elem/inputs/inputs';
import { NormButton } from '@/elem/buttons/buttons';
import s from './add.module.css';


const AddReadingsForm1 = () => {
  const [plotNumber, setPlotNumber] = useState('');
  const [historyId, setHistoryId] = useState(null);
  const [counterId, setCounterId] = useState(null);
  const [sealCounter, setSealCounter] = useState('');
  const [sealMagnetic, setSealMagnetic] = useState('');
  const [sealBox, setSealBox] = useState('');
  const [reading, setReading] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);



  const handleSearchPlot = async () => {
    if (!plotNumber.trim()) {
      alert('Введите номер участка');
      return;
    }
    try {
      const res = await fetch(`/api/lastReadings?plotNumberSearch=${plotNumber}`);
      const data = await res.json();
      console.log('Данные из lastReadings:', data);
  
      if (res.ok && data.readings.length > 0) {
        // Отфильтровать только нужный участок
        const filtered = data.readings.filter(item => item.p_id === Number(plotNumber));
        if (filtered.length === 0) {
          alert('Нет записей по этому участку.');
          return;
        }
        // Среди нужного участка найти запись с максимальным h_id
        const latest = filtered.reduce((prev, current) => (prev.h_id > current.h_id ? prev : current));
  
        setHistoryId(latest.h_id);
        setCounterId(latest.c_id);
        setStep(2);
        console.log('Выбрана последняя запись по участку и h_id:', latest);
      } else {
        alert('Участок не найден или нет истории показаний.');
      }
    } catch (err) {
      console.error('Ошибка при поиске участка:', err);
      alert('Ошибка сервера.');
    }
  };
  


  const handleSubmitReading = async () => {
    if (!reading.trim()) {
      alert('Введите показания счётчика.');
      return;
    }
    try {
      const payload = {
        history_id: historyId,
        reading: Number(reading),
        seal_counter: sealCounter,
        seal_magnetic: sealMagnetic,
        seal_box: sealBox,
        note,
      };
      console.log('Отправка показаний:', payload);

      const res = await fetch('/api/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        alert('Показания успешно добавлены.');
        setPlotNumber('');
        setHistoryId(null);
        setCounterId(null);
        setSealCounter('');
        setSealMagnetic('');
        setSealBox('');
        setReading('');
        setNote('');
        setStep(1);
      } else {
        alert(data.message || 'Ошибка при добавлении показаний.');
      }
    } catch (err) {
      console.error('Ошибка при отправке показаний:', err);
      alert('Ошибка при связи с сервером.');
    }
  };

  return (
    <form className={s.form}>
      {step === 1 && (
        <div>
          <h3>Добавить новые показания</h3>
          <TextModInput
            label="Номер участка"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            placeholder="Для добавления показаний введите номер участка"
          />
          <NormButton onClick={handleSearchPlot}>Найти!!!</NormButton>
        </div>
      )}

      {step === 2 && (
        <div>
          <TextModInput
            label="Номер пломбы на счётчике"
            value={sealCounter}
            onChange={(e) => setSealCounter(e.target.value)}
            placeholder="Введите номер пломбы"
          />
          <TextModInput
            label="Магнитная пломба"
            value={sealMagnetic}
            onChange={(e) => setSealMagnetic(e.target.value)}
            placeholder="Введите магнитную пломбу"
          />
          <TextModInput
            label="Пломба на ящике"
            value={sealBox}
            onChange={(e) => setSealBox(e.target.value)}
            placeholder="Введите пломбу на ящике"
          />
          <NumInput
            label="Показания счётчика"
            value={reading}
            onChange={(e) => setReading(e.target.value)}
            placeholder="Введите показания"
          />
          <NoteInput
            label="Примечание"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Примечания к показаниям"
          />
          <NormButton onClick={handleSubmitReading}>Добавить</NormButton>
        </div>
      )}
    </form>
  );
};

export default AddReadingsForm1;
