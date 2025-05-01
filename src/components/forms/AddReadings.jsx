//Components/forms/readings.jsx
"use client";

import React, { useState } from "react";
import { TextModInput, NumInput, NoteInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import { X } from "lucide-react"; // Импортируем иконку X из lucide-react
import s from "./gem.module.css";

const AddReadingsForm = ({ onClose }) => {
  // Убрали plotNumber из пропсов, теперь он в состоянии
  const [plotNumber, setPlotNumber] = useState("");
  const [historyId, setHistoryId] = useState(null);
  const [reading, setReading] = useState("");
  const [note, setNote] = useState("");
  const [addedReadingInfo, setAddedReadingInfo] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);

  const handleSearchPlot = async () => {
    if (!plotNumber.trim()) {
      alert("Введите номер участка");
      return;
    }

    try {
      const res = await fetch(
        `/api/lastReadings?plotNumberSearch=${plotNumber}`
      );

      if (!res.ok) {
        // Если статус ответа не OK (например, 404)
        let errorMessage = `Ошибка поиска участка: `;
        if (res.status === 404) {
          errorMessage += `Участок с номером "${plotNumber}" не найден.`;
        } else {
          errorMessage += `Сервер вернул ошибку ${res.status}.`;
        }
        alert(errorMessage);
        return;
      }

      const data = await res.json();
      console.log("Данные из lastReadings:", data);

      if (data.readings && data.readings.length > 0) {
        const filtered = data.readings.filter(
          (item) => item.plot_number === plotNumber.trim()
        );

        if (filtered.length === 0) {
          alert("Нет информации по этому участку.");
          return;
        }

        const latest = filtered.reduce((prev, current) =>
          prev.h_id > current.h_id ? prev : current
        );

        if (!latest.h_id) {
          alert("Участок найден, но у него нет истории (h_id отсутствует).");
          return;
        }
        setHistoryId(latest.h_id);
        setStep(2);
        return;
      }

      // Если readings нет — запрашиваем напрямую history
      const historyRes = await fetch(
        `/api/historyByPlot?plotNumber=${plotNumber}`
      );

      if (!historyRes.ok) {
        let errorMessage = `Ошибка поиска истории участка: `;
        if (historyRes.status === 404) {
          errorMessage += `История для участка с номером "${plotNumber}" не найдена.`;
        } else {
          errorMessage += `Сервер вернул ошибку ${historyRes.status}.`;
        }
        alert(errorMessage);
        return;
      }

      const historyData = await historyRes.json();

      if (historyData.history) {
        setHistoryId(historyData.history.id);
        setStep(2);
      } else {
        alert(
          historyData.message || "История не найдена для указанного участка."
        );
      }
    } catch (err) {
      console.error("Ошибка при поиске участка:", err);
      alert("Произошла ошибка при связи с сервером или обработке ответа.");
    }
  };

  const handleSubmitReading = async () => {
    if (!reading.trim()) {
      alert("Введите показания счётчика.");
      return;
    }
    setIsAdding(true);
    setErrorMessage("");
    try {
      const readingsRes = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history_id: historyId,
          reading: Number(reading),
          note,
        }),
      });
      const readingsData = await readingsRes.json();

      if (readingsRes.ok) {
        console.log(
          "Показания успешно добавлены, ID:",
          readingsData.reading.id,
          "для history_id:",
          historyId
        );
        const allDataRes = await fetch(
          `/api/all_data?plotNumberSearch=${encodeURIComponent(plotNumber)}`
        );
        const allData = await allDataRes.json();

        if (allDataRes.ok && allData.records) {
          const latestReading = allData.records.find(
            (record) => record.h_id === historyId
          );
          if (latestReading) {
            setAddedReadingInfo(latestReading);
            setStep(3); // Переходим к шагу отображения информации
          } else {
            setErrorMessage(
              "Не удалось загрузить информацию о добавленных показаниях."
            );
          }
        } else {
          setErrorMessage("Ошибка при загрузке данных об участке.");
        }
        setReading("");
        setNote("");
      } else {
        setErrorMessage(
          readingsData.message || "Ошибка при добавлении показаний."
        );
      }
    } catch (err) {
      console.error("Ошибка при отправке показаний:", err);
      setErrorMessage("Ошибка при связи с сервером.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleCloseCard = () => {
    setAddedReadingInfo(null);
    //setStep(1); // Возвращаемся к первому шагу для нового ввода
    onClose();
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
          <X size={24} />
        </div>
        {step === 1 && (
          <div>
            <h2>Выберите участок</h2>
            <p>
              Пожалуйста, введите номер участка, на котором расположен счётчик
              показания которого вы хотите снять и нажмите кнопку "Поиск".
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
            <NormButton onClick={handleSubmitReading} disabled={isAdding}>
              {isAdding ? "Добавление..." : "Добавить"}
            </NormButton>
            <NormButton
              type="button"
              onClick={() => setStep(1)}
              disabled={isAdding}
            >
              Назад
            </NormButton>
          </div>
        )}

        {step === 3 && addedReadingInfo && (
          <div className={s.confirmationBox}>
            <h2>Показания успешно добавлены!</h2>
            <p>
              <b>Номер участка:</b> {addedReadingInfo.plot_number}
            </p>
            <p>
              <b>Владелец:</b> {addedReadingInfo.owner_name}
            </p>
            <p>
              <b>Серийный номер:</b> {addedReadingInfo.serial_number}
            </p>
            <p>
              <b>Модель:</b> {addedReadingInfo.model}
            </p>
            <p>
              <b>Тип:</b> {addedReadingInfo.type || "-"}
            </p>
            <p>
              <b>Пломба на счётчике:</b> {addedReadingInfo.plomb_count || "-"}
            </p>
            <p>
              <b>Магнитная пломба:</b> {addedReadingInfo.plomb_magnet || "-"}
            </p>
            <p>
              <b>Пломба на ящике:</b> {addedReadingInfo.plomb_box || "-"}
            </p>
            <p>
              <b>Место установки:</b> {addedReadingInfo.install_location || "-"}
            </p>
            <p>
              <b>Последнее показание:</b> {addedReadingInfo.reading}
            </p>
            <p>
              <b>Дата показания:</b>{" "}
              {new Date(addedReadingInfo.date).toLocaleDateString("ru-UA")}
            </p>
            <p>
              <b>Примечание:</b> {addedReadingInfo.reading_note || "-"}
            </p>
            <div className={s.buttonBox}>
              <NormButton onClick={handleCloseCard}>Закрыть</NormButton>
            </div>
          </div>
        )}

        {errorMessage && <p className={s.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AddReadingsForm;

/*/
//Components/forms/readings.jsx
'use client';

import React, { useState } from 'react';
import { TextModInput, NumInput, NoteInput } from '@/elem/inputs/inputs';
import { NormButton } from '@/elem/buttons/buttons';
import s from './gem.module.css';
import { CloseButton } from '@headlessui/react';


const AddReadingsForm = () => {
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
          <TextModInput
            label="Номер участка"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            placeholder="Введите номер участка"
          />
          <NormButton children={"Найти"} onClick={handleSearchPlot}/>
        </div>
      )}

      {step === 2 && (
        <div>
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

export default AddReadingsForm;


/*
            {step === 3 && (
        <div>
          //Карточка с данными об участке 
          <CloseButton children={"Выйти"} />
        </div>
      )}
*/
/* seal_counter: sealCounter,
        seal_magnetic: sealMagnetic,
        seal_box: sealBox,*/
