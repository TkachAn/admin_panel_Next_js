// src/components/forms/AddCounterForm.jsx
"use client";

import React, { useState } from "react";
import { TextModInput, NumInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import { X } from "lucide-react"; // Импортируем иконку X из lucide-react
import s from "./gem.module.css";

const AddCounterForm = ({ onCounterAdded }) => {
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
      const response = await fetch(
        `/api/lastReadings?plotNumberSearch=${plotNumber}`
      );
      const data = await response.json();
      console.log("Ответ от API:", data);

      if (response.ok && data.readings.length > 0) {
        const filtered = data.readings.filter(
          (item) => item.plot_number === plotNumber
        );
        if (filtered.length === 0) {
          alert("Нет данных по участку.");
          return;
        }
        const latest = filtered.reduce((prev, current) =>
          prev.h_id > current.h_id ? prev : current
        );
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
      if (onCounterAdded) {
        onCounterAdded(); // Вызываем колбэк после успешного добавления
      }
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const handleCloseForm = () => {
    // Здесь должна быть логика для закрытия формы.
    // Например, установка состояния видимости в false в родительском компоненте.
    console.log("Закрыть форму!");
    // Для примера, просто сбросим шаг формы на 1
    setStep(1);
  };
  return (
    <div className={s.wrapper}>
      <form className={s.form}>
        <div className={s.closeButton} onClick={handleCloseForm}>
          <X size={24} /> {/* Используем иконку X из lucide-react */}
        </div>
        {step === 1 && (
          <div>
            <h2>Выберите участок</h2>
            <p>
              Пожалуйста, введите номер участка, на котором вы хотите заменить
              счётчик, и нажмите кнопку "Поиск".
            </p>
            <div className={s.step1}>
              <TextModInput
                label="участок"
                value={plotNumber}
                onChange={(e) => setPlotNumber(e.target.value)}
                placeholder="Введите номер участка"
              />
              <div className={s.buttonBox}>
                <NormButton
                  children={"Поиск"}
                  type="button"
                  onClick={handleSearchPlot}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Информация о новом счётчике</h2>
            <p>
              Пожалуйста, заполните данные нового счётчика. Эти данные
              необходимы для связи с участком и упрощённого снятия показаний
              счётчиков .
            </p>
            <div className={s.twoColumns}>
              <TextModInput
                label="Номер"
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
                label="Показания"
                value={startReading}
                onChange={(e) => setStartReading(e.target.value)}
                placeholder="Введите начальные показания"
              />
            </div>
            <div className={s.buttonBox}>
              <NormButton onClick={handleSaveCounter}>
                Сохранить счётчик
              </NormButton>
            </div>
          </div>
        )}
      </form>
    </div>
  );

  /*
  return (
    <form className={s.form}>
      {step === 1 && (
        <div>
          <h2>Добавить новый счётчик</h2>
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
  );*/
};

export default AddCounterForm;

/*
"use client";

import React, { useState } from "react";
import { TextModInput, NumInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import s from "./gem.module.css";

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
      const response = await fetch(`/api/plot?plot_number=${plotNumber}`);
      const data = await response.json();
      console.log("Ответ от API:", data);
      if (response.ok) {
        //setPlotId(data.plot_id);
        //setOwnerId(data.owner_id);

        setPlotId(data.plotID);
        setOwnerId(data.ownerID);

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

/*
"use client";

import React, { useState } from "react";
import s from "./gem.module.css";
import { TextInput } from "@/elem/inputs/inputs";

const AddCounterForm = () => {
  const [plotNumber, setPlotNumber] = useState("");
  const [plotId, setPlotId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [counterSerialNumber, setCounterSerialNumber] = useState("");
  const [counterModel, setCounterModel] = useState("");
  const [newCounterId, setNewCounterId] = useState(null);
  const [historyRecordId, setHistoryRecordId] = useState(null);
  const [initialReading, setInitialReading] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleSearchPlot = async () => {
    if (!plotNumber) {
      setErrorMessage("Пожалуйста, введите номер участка.");
      return;
    }
    setErrorMessage("");
    setInfoMessage("Поиск участка...");

    try {
      const response = await fetch(`/api/plot?plot_number=${plotNumber}`);
      const data = await response.json();

      if (response.ok) {
        setPlotId(data.plotID);
        setOwnerId(data.ownerId); // Предполагаем, что /api/plot возвращает ownerId
        setStep(2);
        setInfoMessage(
          `Участок ID: ${data.plotID} найден. Владелец ID: ${data.ownerId}`
        );
      } else {
        setErrorMessage(data.message || "Ошибка при поиске участка.");
        setPlotId(null);
        setOwnerId(null);
        setInfoMessage("");
      }
    } catch (error) {
      console.error("Ошибка при поиске участка:", error);
      setErrorMessage("Произошла ошибка при связи с сервером.");
      setPlotId(null);
      setOwnerId(null);
      setInfoMessage("");
    }
  };

  const handleCreateCounter = async () => {
    if (!counterSerialNumber) {
      setErrorMessage("Пожалуйста, введите серийный номер счётчика.");
      return;
    }
    setErrorMessage("");
    setInfoMessage("Создание нового счётчика...");

    try {
      const response = await fetch("/api/counters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: counterSerialNumber,
          model: counterModel,
          initialReading: initialReading, // Добавлено отправка initialReading
        }),
      });
      const data = await response.json();

      if (response.ok && data.counter) {
        // Изменено на data.counter
        setNewCounterId(data.counter.id); // Изменено на data.counter.id
        setStep(3);
        setInfoMessage(`Счётчик ID: ${data.counter.id} успешно создан.`); // Изменено на data.counter.id
      } else {
        setErrorMessage(data.message || "Ошибка при создании счётчика."); // Изменено на data.message
        setNewCounterId(null);
        setInfoMessage("");
      }
    } catch (error) {
      console.error("Ошибка при создании счётчика:", error);
      setErrorMessage("Произошла ошибка при связи с сервером.");
      setNewCounterId(null);
      setInfoMessage("");
    }
  };

  const handleCreateHistoryRecord = async () => {
    if (!plotId || !newCounterId || !ownerId) {
      setErrorMessage("Недостаточно данных для создания записи в истории.");
      return;
    }
    setErrorMessage("");
    setInfoMessage("Создание записи в истории...");

    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          counter_id: newCounterId,
          plot_id: plotId,
          owner_id: ownerId,
        }),
      });
      const data = await response.json();

      if (response.ok && data.id) {
        // Изменено на data.id
        setHistoryRecordId(data.id); // Изменено на data.id
        setStep(4);
        setInfoMessage(`Запись в истории ID: ${data.id} успешно создана.`); // Изменено на data.id
      } else {
        setErrorMessage(
          data.message || "Ошибка при создании записи в истории."
        ); // Изменено на data.message
        setHistoryRecordId(null);
        setInfoMessage("");
      }
    } catch (error) {
      console.error("Ошибка при создании записи в истории:", error);
      setErrorMessage("Произошла ошибка при связи с сервером.");
      setHistoryRecordId(null);
      setInfoMessage("");
    }
  };

  const handleSaveReading = async () => {
    if (!historyRecordId || !initialReading) {
      setErrorMessage("Пожалуйста, введите начальные показания.");
      return;
    }
    setErrorMessage("");
    setInfoMessage("Сохранение начальных показаний...");

    try {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history_id: historyRecordId,
          reading: initialReading,
          note: "Новый счётчик",
        }),
      });

      if (response.ok) {
        setInfoMessage("Счётчик успешно добавлен.");
        setStep(5); // Шаг завершения // Можно добавить очистку формы
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Ошибка при сохранении показаний."
        );
        setInfoMessage("");
      }
    } catch (error) {
      console.error("Ошибка при сохранении показаний:", error);
      setErrorMessage("Произошла ошибка при связи с сервером.");
      setInfoMessage("");
    }
  };

  return (
    <form className={s.form}>
      {errorMessage && <p className={s.error}>{errorMessage}</p>}{" "}
      {infoMessage && <p className={s.info}>{infoMessage}</p>}{" "}
      {step === 1 && (
        <div className={s.step}>
          <TextInput
            className={s.input}
            placeholder="введите № участка"
            label="Участок:"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
          />

          <button type="button" onClick={handleSearchPlot}>
            Поиск участка
          </button>
        </div>
      )}
      {step === 2 && (
        <div className={s.step}>
          <p>ID участка: {plotId}</p>
          <TextInput
            label="Серийный номер счётчика:"
            value={counterSerialNumber}
            onChange={(e) => setCounterSerialNumber(e.target.value)}
          />

          <TextInput
            label="Модель счётчика (необязательно):"
            value={counterModel}
            onChange={(e) => setCounterModel(e.target.value)}
          />

          <TextInput
            label="Начальные показания счётчика:"
            type="number"
            value={initialReading}
            onChange={(e) => setInitialReading(e.target.value)}
          />

          <button type="button" onClick={handleCreateCounter}>
            Создать счётчик
          </button>
        </div>
      )}
      {step === 3 && (
        <div className={s.step}>
          <p>ID участка: {plotId}</p>
          <p>ID нового счётчика: {newCounterId}</p>
          <button type="button" onClick={handleCreateHistoryRecord}>
            Создать запись в истории
          </button>
        </div>
      )}
      {step === 4 && (
        <div className={s.step}>
          <p>ID участка: {plotId}</p>
          <p>ID счётчика: {newCounterId}</p>
          <p>ID записи в истории: {historyRecordId}</p>
          <button type="button" onClick={handleSaveReading}>
            Сохранить показания
          </button>
        </div>
      )}
      {step === 5 && (
        <div className={s.step}>
          <p>Счётчик успешно добавлен!</p>
         
        </div>
      )}
    </form>
  );
};

export default AddCounterForm;

/*

'use client';

import React, { useState } from 'react';
import s from "./gem.module.css";
import { TextInput } from '@/elem/inputs/inputs';

const AddCounterForm = () => {
  const [plotNumber, setPlotNumber] = useState('');
  const [plotId, setPlotId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [counterSerialNumber, setCounterSerialNumber] = useState('');
  const [counterModel, setCounterModel] = useState('');
  const [newCounterId, setNewCounterId] = useState(null);
  const [historyRecordId, setHistoryRecordId] = useState(null);
  const [initialReading, setInitialReading] = useState('');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSearchPlot = async () => {
    if (!plotNumber) {
      setErrorMessage('Пожалуйста, введите номер участка.');
      return;
    }
    setErrorMessage('');
    setInfoMessage('Поиск участка...');

    try {
      const response = await fetch(`/api/plot?plot_number=${plotNumber}`);
      const data = await response.json();

      if (response.ok) {
        setPlotId(data.plotID);
        setOwnerId(data.ownerId); // Предполагаем, что /api/plot возвращает ownerId
        setStep(2);
        setInfoMessage(`Участок ID: ${data.plotID} найден. Владелец ID: ${data.ownerId}`);
      } else {
        setErrorMessage(data.message || 'Ошибка при поиске участка.');
        setPlotId(null);
        setOwnerId(null);
        setInfoMessage('');
      }
    } catch (error) {
      console.error('Ошибка при поиске участка:', error);
      setErrorMessage('Произошла ошибка при связи с сервером.');
      setPlotId(null);
      setOwnerId(null);
      setInfoMessage('');
    }
  };

  const handleCreateCounter = async () => {
    if (!counterSerialNumber) {
      setErrorMessage('Пожалуйста, введите серийный номер счётчика.');
      return;
    }
    setErrorMessage('');
    setInfoMessage('Создание нового счётчика...');

    try {
      const response = await fetch('/api/counters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial_number: counterSerialNumber,
          model: counterModel,
        }),
      });
      const data = await response.json();

      if (response.ok && data.counterId) {
        setNewCounterId(data.counterId);
        setStep(3);
        setInfoMessage(`Счётчик ID: ${data.counterId} успешно создан.`);
      } else {
        setErrorMessage(data.error || 'Ошибка при создании счётчика.');
        setNewCounterId(null);
        setInfoMessage('');
      }
    } catch (error) {
      console.error('Ошибка при создании счётчика:', error);
      setErrorMessage('Произошла ошибка при связи с сервером.');
      setNewCounterId(null);
      setInfoMessage('');
    }
  };

  const handleCreateHistoryRecord = async () => {
    if (!plotId || !newCounterId || !ownerId) {
      setErrorMessage('Недостаточно данных для создания записи в истории.');
      return;
    }
    setErrorMessage('');
    setInfoMessage('Создание записи в истории...');

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counter_id: newCounterId,
          plot_id: plotId,
          owner_id: ownerId,
        }),
      });
      const data = await response.json();

      if (response.ok && data.historyId) {
        setHistoryRecordId(data.historyId);
        setStep(4);
        setInfoMessage(`Запись в истории ID: ${data.historyId} успешно создана.`);
      } else {
        setErrorMessage(data.error || 'Ошибка при создании записи в истории.');
        setHistoryRecordId(null);
        setInfoMessage('');
      }
    } catch (error) {
      console.error('Ошибка при создании записи в истории:', error);
      setErrorMessage('Произошла ошибка при связи с сервером.');
      setHistoryRecordId(null);
      setInfoMessage('');
    }
  };

  const handleSaveReading = async () => {
    if (!historyRecordId || !initialReading) {
      setErrorMessage('Пожалуйста, введите начальные показания.');
      return;
    }
    setErrorMessage('');
    setInfoMessage('Сохранение начальных показаний...');

    try {
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history_id: historyRecordId,
          reading: initialReading,
          note: 'Новый счётчик',
        }),
      });

      if (response.ok) {
        setInfoMessage('Счётчик успешно добавлен.');
        setStep(5); // Шаг завершения
        // Можно добавить очистку формы
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Ошибка при сохранении показаний.');
        setInfoMessage('');
      }
    } catch (error) {
      console.error('Ошибка при сохранении показаний:', error);
      setErrorMessage('Произошла ошибка при связи с сервером.');
      setInfoMessage('');
    }
  };

  return (
    <form className={s.form}>
      {errorMessage && <p className={s.error}>{errorMessage}</p>}
      {infoMessage && <p className={s.info}>{infoMessage}</p>}

      {step === 1 && (
        <div className={s.step}>
          <TextInput
            className={s.input}
            placeholder='введите № участка'
            label="Участок:"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
          />
          <button type="button" onClick={handleSearchPlot}>
            Поиск участка
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={s.step}>
          <p>ID участка: {plotId}</p>
          <TextInput
            label="Серийный номер счётчика:"
            value={counterSerialNumber}
            onChange={(e) => setCounterSerialNumber(e.target.value)}
          />
          <TextInput
            label="Модель счётчика (необязательно):"
            value={counterModel}
            onChange={(e) => setCounterModel(e.target.value)}
          />
          <button type="button" onClick={handleCreateCounter}>
            Создать счётчик
          </button>
        </div>
      )}

      {step === 3 && (
        <div className={s.step}>
          <p>ID участка: {plotId}</p>
          <p>ID нового счётчика: {newCounterId}</p>
          <button type="button" onClick={handleCreateHistoryRecord}>
            Создать запись в истории
          </button>
        </div>
      )}

      {step === 4 && (
        <div className={s.step}>
          <p>ID участка: {plotId}</p>
          <p>ID счётчика: {newCounterId}</p>
          <p>ID записи в истории: {historyRecordId}</p>
          <TextInput
            label="Начальные показания счётчика:"
            type="number"
            value={initialReading}
            onChange={(e) => setInitialReading(e.target.value)}
          />
          <button type="button" onClick={handleSaveReading}>
            Сохранить показания
          </button>
        </div>
      )}

      {step === 5 && (
        <div className={s.step}>
          <p>Счётчик успешно добавлен!</p>

        </div>
      )}
    </form>
  );
};

export default AddCounterForm;

*/
