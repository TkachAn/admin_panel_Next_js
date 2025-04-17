//src/comp/pages/lastReadings/table.jsx

"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState, useEffect } from "react";
import styles from "./table.module.css";
import { TextInput } from "@/elem/inputs/TextInput";
import { NormButton } from "@/elem/buttons/buttons";

function GardenReadingsTable() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]); // последние показания
  const [fullHistory, setFullHistory] = useState([]); // полная история при клике
  const [isHistoryShown, setIsHistoryShown] = useState(false); // переключатель
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Фактические фильтры, применяемые при поиске
  const [plotNumberFilter, setPlotNumberFilter] = useState("");
  const [ownerNameFilter, setOwnerNameFilter] = useState("");

  // Поля ввода
  const [plotNumberInput, setPlotNumberInput] = useState("");
  const [ownerNameInput, setOwnerNameInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (plotNumberFilter) params.append("plotNumberSearch", plotNumberFilter);
    if (ownerNameFilter) params.append("ownerNameSearch", ownerNameFilter);

    try {
      const res = await fetch(`/api/lastReadings?${params.toString()}`);
      if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
      const data = await res.json();
      setReadings(data.readings || []);
      setData(data.readings || []); // ← ЭТОГО НЕ ХВАТАЛО!
      setCurrentPage(1);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [plotNumberFilter, ownerNameFilter]);

  const handleSearchClick = () => {
    if (isSearchApplied) {
      // Сброс
      setPlotNumberInput("");
      setOwnerNameInput("");
      setPlotNumberFilter("");
      setOwnerNameFilter("");
      setIsSearchApplied(false);
      setIsHistoryShown(false);
      setFullHistory([]);
      fetchData();
    } else {
      // Поиск
      setPlotNumberFilter(plotNumberInput.trim());
      setOwnerNameFilter(ownerNameInput.trim());
      setIsSearchApplied(true);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleRowClick = async (plotId, ownerId) => {
    try {
      const params = new URLSearchParams();
      if (plotId) params.append("plotId", plotId);
      if (ownerId) params.append("ownerId", ownerId);

      const res = await fetch(`/api/plotReadings?${params.toString()}`);
      const data = await res.json();
      setFullHistory(data.readings || []);
      setIsHistoryShown(true);

      setIsSearchApplied(true);
    } catch (error) {
      console.error("Ошибка при загрузке полной истории:", error);
    }
  };

  const handleResetFilters = () => {
    setIsHistoryShown(false);
    setFullHistory([]);
  };


  const downloadAllLastReadings = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Участок №", "Владелец", "Дата записи", "Показания", "Пломба", "Замечания"],
      ...readings.map(r => [
        r.plot_number,
        r.owner_name,
        new Date(r.date).toLocaleDateString(),
        r.reading,
        r.check_plomb ? "Да" : "Нет",
        r.reading_note,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Последние показания");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'последние_показания.xlsx');
  };

  const downloadFilteredHistory = () => {
    let dataToDownload = [];
    let fileName = 'история_показаний.xlsx';

    if (isHistoryShown) {
      dataToDownload = fullHistory;
      fileName = `история_участок_${fullHistory[0]?.plot_number}.xlsx`;
    } else if (isSearchApplied) {
      dataToDownload = data;
      if (plotNumberFilter) {
        fileName = `история_участок_${plotNumberFilter}.xlsx`;
      } //else if (ownerNameFilter) {fileName = `история_владелец_${ownerNameFilter.replace(/\s/g, '_')}.xlsx`;
        if (ownerNameFilter) {fileName = `история_владелец_${ownerNameFilter}.xlsx`;
      }
    }

    if (dataToDownload.length > 0) {
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["Участок №", "Владелец", "Дата записи", "Показания", "Пломба", "Замечания"],
        ...dataToDownload.map(r => [
          r.plot_number,
          r.owner_name,
          new Date(r.date).toLocaleDateString(),
          r.reading,
          r.check_plomb ? "Да" : "Нет",
          r.reading_note,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "История показаний");
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
    } else {
      alert("Нет данных для скачивания.");
    }
  };

  const displayedData = isHistoryShown ? fullHistory : data;

   const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;

  const currentItems = displayedData.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [isHistoryShown]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <div>
          <div className={styles.filter}>
            <TextInput
              label="Участок №: "
              placeholder="например, 15-Б"
              onChange={(e) => setPlotNumberInput(e.target.value)}
              value={plotNumberInput}
            />
            <TextInput
              label="Владелец: "
              placeholder="например, Иванов И. И."
              value={ownerNameInput}
              onChange={(e) => setOwnerNameInput(e.target.value)}
            />
          </div>
          <div className={styles.filter}>
            <NormButton
              status="accent"
              children={isSearchApplied ? "Сброс" : "Поиск"}
              onClick={() => {
                handleSearchClick();
              }}
            />
          </div>
        </div>
      </div>

      {loading && <p>Загрузка данных...</p>}
      {error && <p>Ошибка: {error.message}</p>}

      {!loading && !error && (
        <>
          {/*isHistoryShown && (
            <div style={{ marginBottom: "1rem" }}>
              <button onClick={handleResetFilters}>
                Показать последние показания
              </button>
            </div>
          )*/}

          <table className={styles.table}>
            <thead>
              <tr>
                {/*<th>ID участка</th>*/}
                <th>Участок №</th>
                {/*<th>ID владельца</th>*/}
                <th>Владелец</th>
                <th>Дата записи</th>
                <th>Показания</th>
                <th>Пломба</th>
                <th>Замечания</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((r, i) => (
                <tr
                  key={`row-${r.r_id ?? `${r.p_id}-${r.o_id}-${i}`}`}
                  onClick={() => handleRowClick(r.p_id, r.o_id)}
                >
                  {/*<td>{r.p_id}</td>*/}
                  <td>{r.plot_number}</td>
                  {/*<td>{r.o_id}</td>*/}
                  <td>{r.owner_name}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.reading}</td>
                  <td>{r.check_plomb ? "Да" : "Нет"}</td>
                  <td>{r.reading_note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
              <div className={styles.downloadButtons}>
          <NormButton onClick={downloadAllLastReadings}>
            Скачать все последние показания (Excel)
          </NormButton>
          <NormButton onClick={downloadFilteredHistory} disabled={loading || error || readings.length === 0}>
            Скачать {isHistoryShown ? 'историю участка' : isSearchApplied ? 'текущий фильтр' : 'последние показания'} (Excel)
          </NormButton>
        </div>
      <div className={styles.pag}>
        <div className={styles.pagination}>
          <div className={styles.label}>
            <label>Записей на странице:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← назад
          </button>
          <span>{`${currentPage} / ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            вперёд →
          </button>
        </div>
      </div>
    </div>
  );
}

export default GardenReadingsTable;

//<span className={styles.titleFilter}>Поиск </span>
