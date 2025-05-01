"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./table.module.css";
import { TextInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import Pagination from "@/components/pagination/Pagination";
import LoadingSpinner from "@/components/spiner/LoadingSpinner";

function GardenReadingsTable() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]); // последние показания (или отфильтрованные по владельцу)
    const [fullHistory, setFullHistory] = useState([]); // полная история при клике
    const [isHistoryShown, setIsHistoryShown] = useState(false); // переключатель
    const [currentOwnerFilter, setCurrentOwnerFilter] = useState(null); // текущий фильтр по владельцу
    const [isFilteredByOwner, setIsFilteredByOwner] = useState(false); // флаг фильтрации по владельцу
    //const [selectedRowId, setSelectedRowId] = useState(null);

    // Фактические фильтры, применяемые при поиске
    const [plotNumberFilter, setPlotNumberFilter] = useState("");
    const [ownerNameFilter, setOwnerNameFilter] = useState("");

    // Поля ввода
    const [plotNumberInput, setPlotNumberInput] = useState("");
    const [ownerNameInput, setOwnerNameInput] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [isSearchApplied, setIsSearchApplied] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (plotNumberFilter) params.append("plotNumberSearch", plotNumberFilter);
        if (ownerNameFilter) params.append("ownerNameSearch", ownerNameFilter);

        try {
            const res = await fetch(`/api/lastReadings?${params.toString()}`);
            if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
            const responseData = await res.json();
            const sortedReadings = (responseData.readings || []).sort((a, b) => b.r_id - a.r_id); // Сортировка по убыванию r_id
            setReadings(sortedReadings);
            setData(sortedReadings);
            setFullHistory([]);
            setIsHistoryShown(false);
            setIsFilteredByOwner(false);
            setCurrentOwnerFilter(null);
            setCurrentPage(1);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [plotNumberFilter, ownerNameFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            setIsFilteredByOwner(false);
            setCurrentOwnerFilter(null);
            fetchData();
        } else {
            // Поиск
            setPlotNumberFilter(plotNumberInput.trim().toLowerCase()); // Обновляем фильтр с trim и lowercase
            setOwnerNameFilter(ownerNameInput.trim()); // Оставляем как есть для владельца (можете добавить lowercase, если нужно)
            setIsSearchApplied(true);
        }
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handleRowClick = async (plotId, ownerId, ownerName) => {
        if (!isHistoryShown) {
            // Первый клик - загрузка полной истории участка
            try {
                const params = new URLSearchParams();
                if (plotId) params.append("plotId", plotId);

                const res = await fetch(`/api/plotReadings?${params.toString()}`);
                const responseData = await res.json();
                const sortedHistory = (responseData.readings || []).sort((a, b) => b.r_id - a.r_id); // Сортировка по убыванию r_id
                setFullHistory(sortedHistory);
                setData(sortedHistory); // Показываем полную историю
                setIsHistoryShown(true);
                setIsFilteredByOwner(false);
                setCurrentOwnerFilter(null);
                setCurrentPage(1);
            } catch (error) {
                console.error("Ошибка при загрузке полной истории:", error);
            }
        } else {
            // Второй клик - фильтрация истории по владельцу (сортировка по убыванию r_id сохраняется)
            const filteredHistory = fullHistory.filter(
                (record) => record.owner_name === ownerName
            );
            setData(filteredHistory);
            setIsFilteredByOwner(true);
            setCurrentOwnerFilter(ownerName);
            setCurrentPage(1);
        }
    };

    const downloadAllLastReadings = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            [
                "Участок №",
                "Владелец",
                "Дата записи",
                "Показания",
                "Пломба",
                "Замечания",
            ],
            ...readings.map((r) => [
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
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "последние_показания.xlsx"
        );
    };

    const downloadFilteredHistory = () => {
        let dataToDownload = [];
        let fileName = "история_показаний.xlsx";

        if (isFilteredByOwner && currentOwnerFilter) {
            dataToDownload = data;
            fileName = `история_участок_${fullHistory[0]?.plot_number}_владелец_${currentOwnerFilter.replace(/\s/g, '_')}.xlsx`;
        } else if (isHistoryShown) {
            dataToDownload = fullHistory;
            fileName = `история_участок_${fullHistory[0]?.plot_number}.xlsx`;
        } else if (isSearchApplied) {
            dataToDownload = data;
            if (plotNumberFilter) {
                fileName = `история_участок_${plotNumberFilter}.xlsx`;
            }
            if (ownerNameFilter) {
                fileName = `история_владелец_${ownerNameFilter.replace(/\s/g, '_')}.xlsx`;
            }
        }

        if (dataToDownload.length > 0) {
            const wb = XLSX.utils.book_new();
            const wsData = [
                [
                    "Участок №",
                    "Владелец",
                    "Дата записи",
                    "Показания",
                    "Пломба",
                    "Замечания",
                ],
                ...dataToDownload.map((r) => [
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
            const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
        } else {
            alert("Нет данных для скачивания.");
        }
    };

    const displayedData = isFilteredByOwner ? data : isHistoryShown ? fullHistory : data;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = displayedData.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [isHistoryShown, isFilteredByOwner, pageSize, displayedData]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.filters}>
                <div>
                    <div className={styles.filter}>
                        <TextInput
                            label="Участок№:"
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

            {loading && <LoadingSpinner />}
            {error && <p>Ошибка: {error.message}</p>}

            {!loading && !error && (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Участок №</th>
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
                                    onClick={() => handleRowClick(r.p_id, r.o_id, r.owner_name)}
                                    className={isHistoryShown ? styles.clickableRow : ""}
                                >
                                    <td>{r.plot_number}</td>
                                    <td>{r.owner_name}</td>
                                    <td>{new Date(r.date).toLocaleDateString()}</td>
                                    <td>{r.reading}</td>
                                    <td>{r.check_plomb ? "Да" : "Нет"}</td>
                                    <td>{r.reading_note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {displayedData.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalCount={displayedData.length}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                    {isFilteredByOwner && currentOwnerFilter && (
                        <p className={styles.filterInfo}>
                            Фильтр по владельцу: <strong>{currentOwnerFilter}</strong>
                        </p>
                    )}
                </>
            )}

            <div className={styles.downloadButtons}>
                <h3>Скачать файл Excel</h3>
                {isSearchApplied ? (
                    <NormButton
                        children={
                            isFilteredByOwner
                                ? `историю владельца ${currentOwnerFilter}`
                                : isHistoryShown
                                ? "историю участка"
                                : "текущий фильтр"
                        }
                        onClick={downloadFilteredHistory}
                    />
                ) : (
                    <NormButton
                        children={"последние показания"}
                        onClick={downloadAllLastReadings}
                        disabled={loading || error || readings.length === 0}
                    />
                )}
            </div>
        </div>
    );
}

export default GardenReadingsTable;


/*
//src/comp/pages/lastReadings/table.jsx
"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState, useEffect } from "react";
import styles from "./table.module.css";
import { TextInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import Pagination from "@/components/pagination/Pagination";
import LoadingSpinner from "@/components/spiner/LoadingSpinner";

function GardenReadingsTable() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]); // последние показания (или отфильтрованные по владельцу)
    const [fullHistory, setFullHistory] = useState([]); // полная история при клике
    const [isHistoryShown, setIsHistoryShown] = useState(false); // переключатель
    const [currentOwnerFilter, setCurrentOwnerFilter] = useState(null); // текущий фильтр по владельцу
    const [isFilteredByOwner, setIsFilteredByOwner] = useState(false); // флаг фильтрации по владельцу
    //const [selectedRowId, setSelectedRowId] = useState(null);

    // Фактические фильтры, применяемые при поиске
    const [plotNumberFilter, setPlotNumberFilter] = useState("");
    const [ownerNameFilter, setOwnerNameFilter] = useState("");

    // Поля ввода
    const [plotNumberInput, setPlotNumberInput] = useState("");
    const [ownerNameInput, setOwnerNameInput] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

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
            setData(data.readings || []);
            setFullHistory([]);
            setIsHistoryShown(false);
            setIsFilteredByOwner(false);
            setCurrentOwnerFilter(null);
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
          setIsFilteredByOwner(false);
          setCurrentOwnerFilter(null);
          fetchData();
      } else {
          // Поиск
          setPlotNumberFilter(plotNumberInput.trim().toLowerCase()); // Обновляем фильтр с trim и lowercase
          setOwnerNameFilter(ownerNameInput.trim()); // Оставляем как есть для владельца (можете добавить lowercase, если нужно)
          setIsSearchApplied(true);
      }
  };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handleRowClick = async (plotId, ownerId, ownerName) => {
        if (!isHistoryShown) {
            // Первый клик - загрузка полной истории участка
            try {
                const params = new URLSearchParams();
                if (plotId) params.append("plotId", plotId);

                const res = await fetch(`/api/plotReadings?${params.toString()}`);
                const data = await res.json();
                setFullHistory(data.readings || []);
                setData(data.readings || []); // Показываем полную историю
                setIsHistoryShown(true);
                setIsFilteredByOwner(false);
                setCurrentOwnerFilter(null);
                setCurrentPage(1);
            } catch (error) {
                console.error("Ошибка при загрузке полной истории:", error);
            }
        } else {
            // Второй клик - фильтрация истории по владельцу
            const filteredHistory = fullHistory.filter(
                (record) => record.owner_name === ownerName
            );
            setData(filteredHistory);
            setIsFilteredByOwner(true);
            setCurrentOwnerFilter(ownerName);
            setCurrentPage(1);
        }
    };

    const downloadAllLastReadings = () => {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [
          "Участок №",
          "Владелец",
          "Дата записи",
          "Показания",
          "Пломба",
          "Замечания",
        ],
        ...readings.map((r) => [
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
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "последние_показания.xlsx"
      );
    };

    const downloadFilteredHistory = () => {
        let dataToDownload = [];
        let fileName = "история_показаний.xlsx";

        if (isFilteredByOwner && currentOwnerFilter) {
            dataToDownload = data;
            fileName = `история_участок_${fullHistory[0]?.plot_number}_владелец_${currentOwnerFilter.replace(/\s/g, '_')}.xlsx`;
        } else if (isHistoryShown) {
            dataToDownload = fullHistory;
            fileName = `история_участок_${fullHistory[0]?.plot_number}.xlsx`;
        } else if (isSearchApplied) {
            dataToDownload = data;
            if (plotNumberFilter) {
                fileName = `история_участок_${plotNumberFilter}.xlsx`;
            }
            if (ownerNameFilter) {
                fileName = `история_владелец_${ownerNameFilter.replace(/\s/g, '_')}.xlsx`;
            }
        }

        if (dataToDownload.length > 0) {
            const wb = XLSX.utils.book_new();
            const wsData = [
                [
                    "Участок №",
                    "Владелец",
                    "Дата записи",
                    "Показания",
                    "Пломба",
                    "Замечания",
                ],
                ...dataToDownload.map((r) => [
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
            const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
        } else {
            alert("Нет данных для скачивания.");
        }
    };

    const displayedData = isFilteredByOwner ? data : isHistoryShown ? fullHistory : data;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = displayedData.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [isHistoryShown, isFilteredByOwner, pageSize, displayedData]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.filters}>
                <div>
                    <div className={styles.filter}>
                        <TextInput
                            label="Участок№:"
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

            {loading && <LoadingSpinner />}
            {error && <p>Ошибка: {error.message}</p>}

            {!loading && !error && (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Участок №</th>
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
                                    onClick={() => handleRowClick(r.p_id, r.o_id, r.owner_name)}
                                    className={isHistoryShown ? styles.clickableRow : ""}
                                >
                                    <td>{r.plot_number}</td>
                                    <td>{r.owner_name}</td>
                                    <td>{new Date(r.date).toLocaleDateString()}</td>
                                    <td>{r.reading}</td>
                                    <td>{r.check_plomb ? "Да" : "Нет"}</td>
                                    <td>{r.reading_note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {displayedData.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalCount={displayedData.length}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                    {isFilteredByOwner && currentOwnerFilter && (
                        <p className={styles.filterInfo}>
                            Фильтр по владельцу: <strong>{currentOwnerFilter}</strong>
                        </p>
                    )}
                </>
            )}

            <div className={styles.downloadButtons}>
                <h3>Скачать файл Excel</h3>
                {isSearchApplied ? (
                    <NormButton
                        children={
                            isFilteredByOwner
                                ? `историю владельца ${currentOwnerFilter}`
                                : isHistoryShown
                                ? "историю участка"
                                : "текущий фильтр"
                        }
                        onClick={downloadFilteredHistory}
                    />
                ) : (
                    <NormButton
                        children={"последние показания"}
                        onClick={downloadAllLastReadings}
                        disabled={loading || error || readings.length === 0}
                    />
                )}
            </div>
        </div>
    );
}

export default GardenReadingsTable;
*/