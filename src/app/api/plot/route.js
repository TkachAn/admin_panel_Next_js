//src/app/api/plot/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden',
  port: process.env.DB_PORT || 3306,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotNumber = searchParams.get('plot_number');

  //console.log('[/api/plot] Получен номер участка:', plotNumber);

  if (!plotNumber) {
    console.log('[/api/plot] Номер участка не указан.');
    return NextResponse.json({ message: 'Укажите номер участка' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    console.log('[/api/plot] Подключение к базе данных успешно.');

    // Получаем ID участка по номеру
    const [plotRows] = await connection.execute(
      'SELECT id FROM plots WHERE plot_number = ?',
      [plotNumber]
    );
    console.log('[/api/plot] Результат запроса SELECT ID FROM plots:', plotRows);


    if (plotRows.length === 0) {
      console.log('[/api/plot] Участок не найден.');
      return NextResponse.json({ message: 'Участок не найден' }, { status: 404 });
    }

    const plotID = plotRows[0].id;
    console.log('[/api/plot] Найден plotID:', plotID);

    // Используем представление p_o_h_readings для получения последней записи по участку
    const [readingRows] = await connection.execute(
      `SELECT *
        FROM p_o_h_readings
        WHERE plot_id = ?
        ORDER BY date DESC
        LIMIT 1`,
      [plotID]
    );
    console.log('[/api/plot] Результат запроса SELECT * FROM p_o_h_readings:', readingRows);

    if (readingRows.length === 0) {
      console.log('[/api/plot] Последние показания не найдены для plotID:', plotID);
      const response = NextResponse.json({ plotID, counterID: null, readingData: null });
      console.log('[/api/plot] Отправлен ответ:', response);
      return response;
    }
    const ownerID = readingRows[0].o_id;
    const counterID = readingRows[0].c_id;
    const readingData = readingRows[0].reading;
    console.log('[/api/plot] Найден counterID:', counterID, 'ownerID:',ownerID,'и readingData:', readingData);

    const response = NextResponse.json({ plotID, counterID, ownerID, readingData });
    console.log('[/api/plot] Отправлен ответ:', response);
    return response;

  } catch (error) {
    console.error('[/api/plot] Ошибка при получении данных участка:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('[/api/plot] Соединение с базой данных закрыто.');
    }
  }
}
/*
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden',
  port: process.env.DB_PORT || 3306,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotNumber = searchParams.get('plot_number');

  if (!plotNumber) {
    return NextResponse.json({ message: 'Укажите номер участка' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Получаем ID участка по номеру
    const [plotRows] = await connection.execute(
      'SELECT id FROM plots WHERE plot_number = ?',
      [plotNumber]
    );

    if (plotRows.length === 0) {
      return NextResponse.json({ message: 'Участок не найден' }, { status: 404 });
    }

    const plotID = plotRows[0].id;

    // Используем представление p_o_h_readings для получения последней записи по участку
    const [readingRows] = await connection.execute(
      `SELECT * 
       FROM p_o_h_readings 
       WHERE plot_id = ? 
       ORDER BY date DESC 
       LIMIT 1`,
      [plotID]
    );

    if (readingRows.length === 0) {
        console.log(NextResponse.json({ plotID, counterID: null, readingData: null }))
      return NextResponse.json({ plotID, counterID: null, readingData: null });
    }

    const counterID = readingRows[0].c_id;
    const readingData = readingRows[0].reading;

    return NextResponse.json({ plotID, counterID, readingData });

  } catch (error) {
    console.error('Ошибка при получении данных участка:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
*/