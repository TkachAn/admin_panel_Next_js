//src/app/api/readings/route.js

import { NextResponse } from 'next/server';
import pool from '@/app/lib/pool_db';

export async function POST(request) {
  console.log('[/api/readings POST] Получен POST-запрос на добавление показаний.');
  let connection;
  try {
    const body = await request.json();
    const { history_id, reading, note  } = body;
    console.log('[/api/readings POST] Тело запроса:', body);

    if (!history_id || reading == null) {
      console.log('[/api/readings POST] history_id или reading не указаны.');
      return NextResponse.json({ message: 'history_id и reading обязательны' }, { status: 400 });
    }

    connection = await pool.getConnection();
    console.log('[/api/readings POST] Подключение к базе данных успешно.');
    const [result] = await connection.execute(
      `INSERT INTO readings (history_id, reading, date, note)
        VALUES (?, ?, NOW(), ?)`,
      [history_id, reading, note ]
    );
    console.log('[/api/readings POST] Результат запроса INSERT INTO readings:', result);

    const newReading = {
      id: result.insertId,
      history_id,
      reading, 
      note, 
    };
    console.log('[/api/readings POST] Добавлены показания:', newReading);
    const response = NextResponse.json({
      message: 'Показание успешно добавлено',
      reading: newReading,
    });
    console.log('[/api/readings POST] Отправлен ответ:', response);
    return response;
  } catch (err) {
    console.error('[/api/readings POST] Ошибка при добавлении показания:', err);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) connection.release();
    console.log('[/api/readings POST] Соединение с базой данных закрыто.');
  }
}