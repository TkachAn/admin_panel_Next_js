//src/comp/add/counter.jsx
'use client';

import React, { useState } from "react";
import { TextModInput, NumInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import s from "./add.module.css";

const AddCounterForm = () => {
  const [plotNumber, setPlotNumber] = useState("");
  const [plotId, setPlotId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [counterId, setCounterId] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [startReading, setStartReading] = useState("");
  const [step, setStep] = useState(1);

  const handleSearchPlot = async () => {
    if (!plotNumber) {
      alert("Введите номер участка.");
      return;
    }
    try {
      console.log("Поиск участка по номеру:", plotNumber);
      const response = await fetch(`/api/lastReadings?plotNumberSearch=${plotNumber}`);
      const data = await response.json();
      console.log("Ответ от API:", data);

      if (response.ok && data.readings.length > 0) {
        const filtered = data.readings.filter(item => item.plot_number === plotNumber);
        if (filtered.length === 0) {
          alert('Нет данных по участку.');
          return;
        }
        const latest = filtered.reduce((prev, current) => (prev.h_id > current.h_id ? prev : current));
        setPlotId(latest.p_id);
        setOwnerId(latest.o_id);
        setCounterId(latest.c_id);
        setStep(2);
      } else {
        alert(data.message || "Участок не найден.");
      }
    } catch (error) {
      console.error("Ошибка при запросе plot:", error);
      alert("Ошибка при связи с сервером.");
    }
  };

  const handleSaveCounter = async () => {
    console.log("Попытка сохранить счётчик");
    if (!serialNumber || !model || !startReading) {
      console.warn("Не все поля заполнены", {
        serialNumber,
        model,
        startReading,
        plotId,
        ownerId,
      });
      alert("Заполните все поля.");
      return;
    }
    try {
      console.log("Создание счётчика:", { serialNumber, model });
      const counterRes = await fetch("/api/counters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serial_number: serialNumber, model }),
      });
      const counterData = await counterRes.json();
      console.log("Ответ при создании счётчика:", counterData);
      if (!counterRes.ok) throw new Error(counterData.message);
      const cID = counterData.counter?.id;
      console.log("Получен cID:", cID);

      console.log("Создание записи в истории:", {
        plot_id: plotId,
        owner_id: ownerId,
        counter_id: cID,
      });
      const historyRes = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plot_id: plotId,
          owner_id: ownerId,
          counter_id: cID,
        }),
      });
      const historyData = await historyRes.json();
      console.log("Ответ при создании history:", historyData);
      if (!historyRes.ok) throw new Error(historyData.message);

      const hID = historyData.id;
      console.log("Получен hID:", hID);

      console.log("Создание показаний:", {
        history_id: hID,
        reading: Number(startReading),
        note: "Новый счётчик",
      });
      const readingRes = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history_id: hID,
          reading: startReading,
          note: "Новый счётчик",
        }),
      });
      const readingData = await readingRes.json();
      console.log("Ответ при создании readings:", readingData);
      if (!readingRes.ok) throw new Error(readingData.message);

      alert("Счётчик успешно добавлен.");
      setStep(1);
      setPlotNumber("");
      setSerialNumber("");
      setModel("");
      setStartReading("");
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <form className={s.form}>
      {step === 1 && (
        <div>
          <TextModInput
            label="Номер участка"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            placeholder="Введите номер участка"
          />
          <NormButton onClick={handleSearchPlot}>Поиск</NormButton>
        </div>
      )}

      {step === 2 && (
        <div>
          <TextModInput
            label="Серийный номер"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Введите серийный номер"
          />
          <TextModInput
            label="Модель"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Введите модель счётчика"
          />
          <NumInput
            label="Начальное показание"
            value={startReading}
            onChange={(e) => setStartReading(e.target.value)}
            placeholder="Введите показание"
          />
          <NormButton onClick={handleSaveCounter}>Сохранить счётчик</NormButton>
        </div>
      )}
    </form>
  );
};

export default AddCounterForm;