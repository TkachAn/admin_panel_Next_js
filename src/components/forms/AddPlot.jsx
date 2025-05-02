// components/AddPlotForm.js
// components/forms/AddPlotForm.js
"use client";

import { useState } from "react";
import { TextModInput, NoteInput } from "@/elem/inputs/inputs";
import { SubmitButton } from "@/elem/buttons/buttons";
import s from "./gem.module.css";

export default function AddPlotForm() {
  const [plotNumber, setPlotNumber] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const formData = {
      plot_number: plotNumber,
      location: location,
      note: note,
    };

    try {
      const response = await fetch("/api/plot/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Участок успешно добавлен!");
        setPlotNumber("");
        setLocation("");
        setNote("");
      } else {
        setError(data.error || "Произошла ошибка при добавлении участка.");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setError("Произошла ошибка при отправке запроса на сервер.");
    }
  };

  return (
    <div className={s.wrapper}>
      <form className={s.form} onSubmit={handleSubmit}>
        <TextModInput
          className={s.input}
          label="Участок:* "
          value={plotNumber}
          onChange={(e) => setPlotNumber(e.target.value)}
          required
          placeholder="Введите номер участка"
        />
        <TextModInput
          className={s.input}
          label="Местоположение: "
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <NoteInput
          className={s.input}
          label="Примечание: "
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className={s.buttonBox}>
          <SubmitButton>Добавить участок</SubmitButton>
        </div>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
