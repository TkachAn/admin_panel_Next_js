// src/api/plot/add/route.js
import pool from '@/app/lib/pool_db';
import { NextResponse } from 'next/server';
 // Импортируем пул соединений

export async function POST(request) {
  let connection; // Объявляем переменную для соединения вне блока try

  try {
    const { plot_number, location, note } = await request.json();

    if (!plot_number) {
      return NextResponse.json({ error: 'Номер участка обязателен.' }, { status: 400 });
    }

    connection = await pool.getConnection(); // Получаем соединение из пула

    // Проверка на существование участка с таким же номером
    const [existingPlot] = await connection.execute(
      'SELECT plot_number FROM plots WHERE plot_number = ?',
      [plot_number]
    );

    if (existingPlot.length > 0) {
      connection.release(); // Возвращаем соединение в пул
      return NextResponse.json({ error: 'Участок с таким номером уже существует.' }, { status: 409 });
    }

    // Получение ID владельца по умолчанию
    const [defaultOwner] = await connection.execute(
      'SELECT id FROM owners WHERE owner_name = ?',
      ['DEFAULT']
    );

    if (defaultOwner.length === 0) {
      connection.release();
      return NextResponse.json({ error: 'Не найден владелец по умолчанию.' }, { status: 500 });
    }
    const defaultOwnerId = defaultOwner[0].id;

    // Получение ID счетчика по умолчанию
    const [defaultCounter] = await connection.execute(
      'SELECT id FROM counters WHERE serial_number = ?',
      ['DEFAULT']
    );

    if (defaultCounter.length === 0) {
      connection.release();
      return NextResponse.json({ error: 'Не найден счетчик по умолчанию.' }, { status: 500 });
    }
    const defaultCounterId = defaultCounter[0].id;

    // Создание записи в таблице plots
    const [plotResult] = await connection.execute(
      'INSERT INTO plots (plot_number, location, note) VALUES (?, ?, ?)',
      [plot_number, location, note]
    );
    const plotId = plotResult.insertId;

    // Создание записи в таблице history
    const hisnote = 'src/api/plot/add/route.js'
    const [historyResult] = await connection.execute(
      'INSERT INTO history (plot_id, owner_id, counter_id, note) VALUES (?, ?, ?, ?)',
      [plotId, defaultOwnerId, defaultCounterId, hisnote]
    );
    const historyId = historyResult.insertId;
    const noterec = 'новый участок';
    // Создание записи в таблице readings
    await connection.execute(
      'INSERT INTO readings (history_id, reading, note) VALUES (?, ?, ?)',
      [historyId, 0, noterec]
    );

    connection.release(); // Возвращаем соединение в пул

    return NextResponse.json({ message: 'Участок успешно добавлен!' }, { status: 201 });

  } catch (error) {
    console.error('Ошибка при добавлении участка:', error);
    if (connection) {
      connection.release(); // Ensure connection is released even if an error occurs
    }
    return NextResponse.json({ error: 'Произошла ошибка на сервере.' }, { status: 500 });
  }
}