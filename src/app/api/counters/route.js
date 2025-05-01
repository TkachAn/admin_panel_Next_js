// /src/app/api/counters/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "garden",
  port: process.env.DB_PORT || 3306,
});

export async function POST(request) {
  console.log("[/api/counters POST] Получен POST-запрос на создание счётчика.");
  let connection;
  try {
    const body = await request.json();
    const { serial_number, model = "", note = "" } = body;
    console.log("[/api/counters POST] Тело запроса:", body);

    if (!serial_number) {
      console.log("[/api/counters POST] Серийный номер не указан.");
      return NextResponse.json(
        { message: "Серийный номер обязателен" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    console.log("[/api/counters POST] Подключение к базе данных успешно.");
    const [result] = await connection.execute(
      `INSERT INTO counters (serial_number, model, note) VALUES (?, ?, ?)`,[serial_number, model, note]
    );
    console.log(
      "[/api/counters POST] Результат запроса INSERT INTO counters:",
      result
    );

    const newCounter = {
      id: result.insertId,
      serial_number,
      model,
      note,
    };
    console.log("[/api/counters POST] Создан новый счётчик:", newCounter);
    const response = NextResponse.json({ counter: newCounter,
      message: "Счётчик успешно добавлен",
      
    });
    console.log("[/api/counters POST] Отправлен ответ:", response);
    return response;
  } catch (err) {
    console.error("[/api/counters POST] Ошибка при создании счётчика:", err);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  } finally {
    if (connection) connection.release();
    console.log("[/api/counters POST] Соединение с базой данных закрыто.");
  }
}
