"use client";
/*
import React, { useState } from "react";
import { TextModInput } from "@/elem/inputs/inputs";
import s from "@/comp/table/table.module.css";
import { NormButton } from "@/elem/buttons/buttons";

const ReadingsTable = () => {
  const [plotNumber, setPlotNumber] = useState("");
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchCounters = async () => {
    if (!plotNumber.trim()) {
      alert("Введите номер участка");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/all_data?plotNumberSearch=${encodeURIComponent(plotNumber)}`
      );
      const data = await res.json();
      console.log("Данные по all_data:", data);
      /*
      if (res.ok && data.readings?.length > 0) {
        const filtered = data.readings.filter(item => item.plot_number === plotNumber);*/
/*
      if (res.ok && data.records?.length > 0) {
        const filtered = data.records.filter(
          (item) => item.plot_number === plotNumber
        );

        setCounters(filtered);
      } else {
        setCounters([]);
        alert("Счётчики не найдены.");
      }
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
      alert("Ошибка сервера.");
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    { header: 'Имя', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Роль', accessor: 'role' },
    { header: 'Заметка', accessor: 'note' },
  ];
  return (
    <div className={s.form}>
      <div className={s.step1}>
        <TextModInput
          label="Номер участка"
          value={plotNumber}
          onChange={(e) => setPlotNumber(e.target.value)}
          placeholder="Введите номер участка"
        />
        <NormButton onClick={handleFetchCounters}>Показать счётчики</NormButton>
      </div>
      {loading && <p>Загрузка...</p>}
      {counters.length > 0 && (
        <div className={s.tableWrapper}>

          <table className={s.table}>
            <thead>
              <tr>
                <th>Участок</th>
                <th>Владелец</th>
                <th>Серийный номер</th>
                <th>Модель</th>
                <th>Тип</th>
                <th>Пломба на счётчике</th>
                <th>Магнитная пломба</th>
                <th>Пломба на ящике</th>
                <th>Место установки</th>
                <th>Последнее показание</th>
                <th>Дата показания</th>
                <th>Примечание</th>
              </tr>
            </thead>
            <tbody>
              {counters.map((counter) => (
                <tr key={counter.r_id}>
                  <td>{counter.plot_number}</td>
                  <td>{counter.owner_name}</td>
                  <td>{counter.serial_number}</td>
                  <td>{counter.model}</td>
                  <td>{counter.type || "-"}</td>
                  <td>{counter.plomb_count || "-"}</td>
                  <td>{counter.plomb_magnet || "-"}</td>
                  <td>{counter.plomb_box || "-"}</td>
                  <td>{counter.install_location || "-"}</td>
                  <td>{counter.reading}</td>
                  <td>
                    {counter.date
                      ? new Date(counter.date).toLocaleDateString(
                          "ru-UA"
                        )
                      : "-"}
                  </td>
                  <td>{counter.reading_note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReadingsTable;
*/