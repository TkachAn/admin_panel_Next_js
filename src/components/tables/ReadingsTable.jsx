//src/components/table/ReadingsTable.jsx //full history
"use client";

import React, { useState } from "react";
import { TextModInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import LoadingSpinner from "../spiner/LoadingSpinner";
import Modal from "../Modal/Modal";
import AddReadingsForm from "@/components/forms/AddReadings";
import s from "./CounterTable.module.css";


const ReadingsTable = () => {
  const [plotNumber, setPlotNumber] = useState("");
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
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
 /* const columns = [
    { header: "Имя", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Роль", accessor: "role" },
    { header: "Заметка", accessor: "note" },
  ];*/
  return (
    <div className={s.tableWrapper}>
      <div className={s.p_Wrapper}>
        <p>
          На этой странице вы найдёте подробную историческую информацию об
          участке, включая сведения о всех его владельцах, информацию об
          установке счётчиков и их показаниях в разные периоды
          времени.
        </p>
        <p>
          Для того чтобы получить информацию введите номер интересующего вас
          участка.
        </p>
      </div>
      <div className={s.step1}>
        <div>
          <TextModInput
            className={s.inputFilter}
            label="Поиск"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            placeholder="по номеру участка"
          />
          <NormButton
            children={"найти информацию об участке"}
            onClick={handleFetchCounters}
          />
        </div>
        <div>
          <div>
            <NormButton children={"Добавить показания"} onClick={openModal} />
          </div>
        </div>
      </div>
      {loading && <LoadingSpinner />}
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
                      ? new Date(counter.date).toLocaleDateString("ru-UA")
                      : "-"}
                  </td>
                  <td>{counter.reading_note || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <AddReadingsForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ReadingsTable;
