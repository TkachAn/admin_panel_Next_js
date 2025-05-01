/*

'use client';
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { NormButton } from "@/elem/buttons/buttons";
import { TextInput } from "@/elem/inputs/inputs";
import styles from "./plot.module.css";

const PlotDataTable = () => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFiltered = searchNumber.trim() !== "" || searchOwner.trim() !== "";
  const fileName = isFiltered ? "отфильтрованные_показания" : "последние_показания";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/plotData?page=${currentPage}&pageSize=10&plotNumber=${searchNumber}&ownerName=${searchOwner}`
        );
        const result = await res.json();
        setData(result.data);
        setTotalRecords(result.totalRecords);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchNumber, searchOwner]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (plot) => {
    setSelectedPlot(plot);
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd.MM.yyyy", { locale: ru });
  };

  const filteredData = data.filter((item) => {
    return (
      item.plot_number.toLowerCase().includes(searchNumber.toLowerCase()) &&
      item.owner_name.toLowerCase().includes(searchOwner.toLowerCase())
    );
  });

  const downloadExcel = async () => {
    let exportData = [];

    if (isFiltered) {
      const res = await fetch(
        `/api/exportExcel?plotNumber=${searchNumber}&ownerName=${searchOwner}`
      );
      exportData = await res.json();
    } else {
      const res = await fetch(`/api/lastReadings`);
      const json = await res.json();
      exportData = json.data;
    }

    if (!exportData || exportData.length === 0) {
      alert("Нет данных для экспорта.");
      return;
    }

    const headers = ["Участок", "Владелец", "Дата", "кВт/ч", "Счётчик", "замечания"];
    const rows = exportData.map((item) => [
      item.plot_number,
      item.owner_name,
      formatDate(item.readings_date),
      item.readings,
      item.serial_number,
      item.history_note || ""
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv; charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <TextInput
          label="Номер участка"
          placeholder="например, 15-Б"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
        />
        <TextInput
          label="Фамилия инициалы владельца"
          placeholder="например, Иванов И. И."
          value={searchOwner}
          onChange={(e) => setSearchOwner(e.target.value)}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.u}>Участок</th>
              <th>Владелец</th>
              <th className={styles.dd}>Дата</th>
              <th className={styles.rr}>кВт/ч</th>
              <th>Счётчик</th>
              <th>замечания</th>
            </tr>
          </thead>
          <tbody>
            {(isFiltered ? filteredData : data).length > 0 ? (
              (isFiltered ? filteredData : data).map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item)}>
                  <td className={styles.u}>{item.plot_number}</td>
                  <td>{item.owner_name}</td>
                  <td className={styles.d}>{formatDate(item.readings_date)}</td>
                  <td className={styles.r}>{item.readings}</td>
                  <td>{item.serial_number}</td>
                  <td>{item.history_note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Данные не найдены</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <NormButton
            status={currentPage === 1 ? "blocked" : "normal"}
            onClick={() => handlePageChange(currentPage - 1)}
            children="Назад"
          />
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <NormButton
            status={currentPage === totalPages ? "blocked" : "normal"}
            onClick={() => handlePageChange(currentPage + 1)}
            children="Вперёд"
          />
        </div>

        {selectedPlot && (
          <div className={styles.historyBlock}>
            <h3>История участка {selectedPlot.plot_number}</h3>
            <div>Заглушка истории — скоро будет красиво 🛠️</div>
          </div>
        )}

        <div className={styles.buttons}>
          <NormButton onClick={downloadExcel}>
            {isFiltered ? "Скачать отфильтрованные показания" : "Скачать последние показания"}
          </NormButton>
          <NormButton children={"Отправить бухгалтеру"} />
        </div>
      </div>
    </div>
  );
};

export default PlotDataTable;


//'use client';
/*
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale"; // Импортируем русскую локализацию
import { NormButton } from "@/elem/buttons/buttons";
import { NoteInput, TextInput } from "@/elem/inputs/inputs";
import styles from "./plot.module.css"; // Импортируем CSS-модуль

const mockPlots = [
  { id: 1, number: "12А", owner: "Иванов", reading: 1325 },
  { id: 2, number: "15Б", owner: "Петрова", reading: 1280 },
  { id: 3, number: "3В", owner: "Сидоров", reading: 1410 },
];

const PlotDataTable = () => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [plots, setPlots] = useState(mockPlots);
  const [filteredPlots, setFilteredPlots] = useState(mockPlots);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    const filtered = plots.filter((plot) => {
      return (
        plot.number.toLowerCase().includes(searchNumber.toLowerCase()) &&
        plot.owner.toLowerCase().includes(searchOwner.toLowerCase())
      );
    });
    setFilteredPlots(filtered);
  }, [searchNumber, searchOwner, plots]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/plotData?page=${currentPage}&pageSize=10`
      );
      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.totalRecords);
      setTotalPages(result.totalPages);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Функция для форматирования дат в короткий формат (день.месяц год)
  const formatDate = (date) => {
    return format(new Date(date), "dd.MM yyyy", { locale: ru });
  };


  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <TextInput label="Номер участка"
          placeholder="например, 15-Б"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
        />
         <TextInput
          label="Фамилия инициалы владельца"
          placeholder="например, Иванов И. И."
          value={searchOwner}
          onChange={(e) => setSearchOwner(e.target.value)}
        />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.u}>Участок</th>
              <th>Владелец</th>
              <th className={styles.dd}>Дата</th>
              <th className={styles.rr}>кВт/ч</th>
              <th>Счётчик</th>
              <th>замечания</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className={styles.u}>{item.plot_number}</td>
                  <td>{item.owner_name}</td>
                  <td className={styles.d}>{formatDate(item.readings_date)}</td>
                  <td className={styles.r}>{item.readings}</td>
                  <td>{item.serial_number}</td>
                  <td>{item.history_note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Данные не найдены</td>
              </tr>
            )}
          </tbody>
        </table>

      
        <div className={styles.pagination}>
          <NormButton
            status={currentPage === 1 ? "blocked" : "normal"}
            onClick={() => handlePageChange(currentPage - 1)}
            children="Назад"
          />
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <NormButton
            status={currentPage === totalPages ? "blocked" : "normal"}
            onClick={() => handlePageChange(currentPage + 1)}
            children="Вперёд"
          />
        </div>
        {selectedPlot && (
        <div className={styles.historyBlock}>
          <h3>История участка {selectedPlot.number}</h3>
          <div>Заглушка истории — скоро будет красиво 🛠️</div>
        </div>
      )}

      
    </div>
    <h5>Скачать Excel</h5>
      <div className={styles.buttons}>
       
        <NormButton  children={"последние показания"}/>
        
      </div>
      <div className={styles.buttons}>
       
        <NormButton  children={"отфильтрованные данные"}/>
        
      </div>
      <div className={styles.buttons}>
        <NormButton children={"Отправить бухгалтеру"}/>
       
      </div>
    </div>
  );
};

export default PlotDataTable;
*/

  /*
  // Функция для форматирования времени (часы:минуты)
  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };*/