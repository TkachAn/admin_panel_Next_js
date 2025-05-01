//src/components/forms/AddOwnerForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import s from "./gem.module.css";
import {
  EmailModInput,
  NoteInput,
  PhoneInput,
  TextInput,
  TextModInput,
} from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import { X } from "lucide-react"; // Импортируем иконку X из lucide-react

const AddOwnerForm = () => {
  const [plotNumber, setPlotNumber] = useState("");
  const [plotId, setPlotId] = useState(null);
  const [counterId, setCounterId] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [readingData, setReadingData] = useState(null);
  const [ownerNameSearch, setOwnerNameSearch] = useState("");
  const [ownerExists, setOwnerExists] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerNote, setNewOwnerNote] = useState("");
  const [historyId, setHistoryId] = useState(null);
  const [readingNote, setReadingNote] = useState("Новый владелец!");
  const [step, setStep] = useState(1); // Шаг формы

  const handleSearchPlot = async () => {
    if (!plotNumber) {
      alert("Пожалуйста, введите номер участка.");
      return;
    }

    try {
      const response = await fetch(
        `/api/lastReadings?plotNumberSearch=${plotNumber}`
      );
      const data = await response.json();

      if (response.ok && data.readings.length > 0) {
        const filtered = data.readings.filter(
          (item) => item.p_id === Number(plotNumber)
        );
        if (filtered.length === 0) {
          alert("Нет данных по участку.");
          return;
        }
        const latest = filtered.reduce((prev, current) =>
          prev.h_id > current.h_id ? prev : current
        );
        setPlotId(latest.p_id);
        setCounterId(latest.c_id);
        setSerialNumber(latest.serial_number);
        setReadingData(latest.reading);
        setStep(2);
      } else {
        alert(data.message || "Ошибка при поиске участка.");
        setPlotId(null);
        setCounterId(null);
        setReadingData(null);
      }
    } catch (error) {
      console.error("Ошибка при поиске участка:", error);
      alert("Произошла ошибка при связи с сервером.");
    }
  };

  const handleSearchOwner = async () => {
    if (!ownerNameSearch) {
      alert("Пожалуйста, введите имя владельца для поиска.");
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
        alert(data.message || "Ошибка при поиске владельца.");
        setOwnerExists(null);
        setOwnerData(null);
      }
    } catch (error) {
      console.error("Ошибка при поиске владельца:", error);
      alert("Произошла ошибка при связи с сервером.");
    }
  };

  const handleCreateOwner = async () => {
    if (!newOwnerName) {
      alert("Пожалуйста, введите имя владельца.");
      return;
    }

    try {
      const response = await fetch("/api/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        alert(data.message || "Ошибка при создании владельца.");
      }
    } catch (error) {
      console.error("Ошибка при создании владельца:", error);
      alert("Произошла ошибка при связи с сервером.");
    }
  };

  const handleSaveData = async () => {
    if (!plotId || !counterId || !ownerData?.id) {
      alert("Недостаточно данных для сохранения.");
      return;
    }

    try {
      // 1. Создаем запись в history
      const historyResponse = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        const readingsResponse = await fetch("/api/readings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            history_id: historyData.id,
            reading: readingData,
            note: readingNote,
          }),
        });

        if (readingsResponse.ok) {
          alert("Данные успешно сохранены.");
          // Можно сделать редирект или очистить форму
          setStep(1);
          setPlotNumber("");
          setPlotId(null);
          setCounterId(null);
          setReadingData(null);
          setOwnerNameSearch("");
          setOwnerExists(null);
          setOwnerData(null);
          setNewOwnerName("");
          setNewOwnerPhone("");
          setNewOwnerEmail("");
          setNewOwnerNote("");
          setHistoryId(null);
        } else {
          const readingsData = await readingsResponse.json();
          alert(readingsData.message || "Ошибка при сохранении показаний.");
        }
      } else {
        alert(historyData.message || "Ошибка при создании записи в истории.");
      }
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      alert("Произошла ошибка при связи с сервером.");
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
              Пожалуйста, введите номер участка, для которого вы хотите сменить
              владельца, и нажмите кнопку "Поиск".
            </p>
            <div className={s.step1}>
              <TextInput
                className={s.input}
                placeholder="введите № участка"
                label="участок"
                value={plotNumber}
                onChange={(e) => setPlotNumber(e.target.value)}
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
            <h2>Поиск владельца</h2>
            <p>
              Введите фамилию и инициалы для поиска среди существующих
              владельцев участков.
            </p>
            <p>
              Если владелец будет найден, вы сразу перейдёте к подтверждению,
              так что постарайтесь <b>как можно точнее </b>ввести фамилию и
              инициалы
            </p>
            <div className={s.step1}>
              <TextModInput
                id="owner_name_search"
                value={ownerNameSearch}
                onChange={(e) => setOwnerNameSearch(e.target.value)}
                placeholder="Например: Петров С.А."
              />
              <div className={s.buttonBox}>
                <NormButton
                  children={"Поиск"}
                  type="button"
                  onClick={handleSearchOwner}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={s.newOw}>
            <h5>Новый владелец</h5>
            <p>
              Пожалуйста, заполните данные нового владельца участка. Возможно
              эта информация будет использована для автоматизации снятия
              показаний счётчиков.
            </p>
            <TextModInput
              label="Фамилия:"
              id="new_owner_name"
              value={newOwnerName}
              placeholder="введите фамилию и инициалы"
              onChange={(e) => setNewOwnerName(e.target.value)}
            />
            <PhoneInput
              label="Телефон:"
              id="new_owner_phone"
              value={newOwnerPhone}
              onChange={(e) => setNewOwnerPhone(e.target.value)}
            />
            <EmailModInput
              label="Email:"
              id="new_owner_email"
              value={newOwnerEmail}
              onChange={(e) => setNewOwnerEmail(e.target.value)}
            />
            <NoteInput
              label="Примечание:"
              id="new_owner_note"
              value={newOwnerNote}
              onChange={(e) => setNewOwnerNote(e.target.value)}
            />
            <div className={s.buttonBox}>
              <NormButton
                children={"Далее"}
                type="button"
                onClick={handleCreateOwner}
              />
            </div>
          </div>
        )}

        {step === 4 && ownerData && (
          <div className={s.confirmationBox}>
            <h2>Подтверждение</h2>
            <p>
              <b>Номер участка:</b> {plotNumber}
            </p>

            <p>
              <b>Новый владелец:</b> {ownerData.owner_name}
            </p>
            <b>Информация о счётчике</b>

            <div className={s.counterInfo}>
              <p>
                <b>Серийный номер :</b> {serialNumber || "Не указан"}
              </p>
              <p>
                <b>Последние показания:</b> {readingData || 0}
              </p>
            </div>

            <p>
              Пожалуйста, проверьте введенные данные перед сохранением.
              Убедитесь, что номер участка и серийный номер счётчика верны.
            </p>

            <div className={s.buttonBox}>
              <NormButton
                children={"Сохранить"}
                type="button"
                onClick={handleSaveData}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddOwnerForm;

/*ownerExists ? (
              <p>
                <b>Найден владелец:</b> {ownerData.owner_name}
              </p>
            ) : (
              <p>
                <b>Новый владелец:</b> {ownerData.owner_name}
              </p>
            )*/
