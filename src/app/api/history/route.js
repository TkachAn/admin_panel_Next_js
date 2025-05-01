// src/app/api/history/route.js
import { NextResponse } from 'next/server';
import pool from '@/app/lib/pool_db';

export async function POST(request) {
  console.log('[/api/history POST] Получен POST-запрос на создание записи в истории.');
  let connection;
  try {
    const body = await request.json();
    const { plot_id, counter_id, owner_id } = body;
    console.log('[/api/history POST] Тело запроса:', body);
    
    if (!plot_id || !counter_id || !owner_id) {
      console.log('[/api/history POST] Не все обязательные поля заполнены.');

      return NextResponse.json({ message: 'Все поля обязательны' }, { status: 400 });
    }
    connection = await pool.getConnection();
    console.log('[/api/history POST] Подключение к базе данных успешно.');

    const [result] = await connection.execute(
      `INSERT INTO history (plot_id, counter_id, owner_id)
        VALUES (?, ?, ?)`,
      [plot_id, counter_id, owner_id]
    );
    console.log('[/api/history POST] Результат запроса INSERT INTO history:', result);

    const newHistoryId = result.insertId;
    console.log('[/api/history POST] Создана запись в истории с ID:', newHistoryId);

    const response = NextResponse.json({ id: newHistoryId });
    console.log('[/api/history POST] Отправлен ответ:', response);

    return response;
  } catch (error) {
    console.error('[/api/history POST] Ошибка при создании записи в истории:', error);

    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('[/api/history POST] Соединение с базой данных закрыто.');
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

export async function POST(request) {
  console.log('[/api/history POST] Получен POST-запрос на создание записи в истории.');
  let connection;
  try {
    const body = await request.json();
    const { plot_id, counter_id, owner_id } = body;
    console.log('[/api/history POST] Тело запроса:', body);

    if (!plot_id || !counter_id || !owner_id) {
      console.log('[/api/history POST] Не все обязательные поля заполнены.');
      return NextResponse.json({ message: 'Все поля обязательны' }, { status: 400 });
    }

    connection = await pool.getConnection();
    console.log('[/api/history POST] Подключение к базе данных успешно.');
    const [result] = await connection.execute(
      `INSERT INTO history (plot_id, counter_id, owner_id)
        VALUES (?, ?, ?, NOW())`,
      [plot_id, counter_id, owner_id]
    );
    console.log('[/api/history POST] Результат запроса INSERT INTO history:', result);

    const newHistoryId = result.insertId;
    console.log('[/api/history POST] Создана запись в истории с ID:', newHistoryId);
    const response = NextResponse.json({ id: newHistoryId });
    console.log('[/api/history POST] Отправлен ответ:', response);
    return response;

  } catch (error) {
    console.error('[/api/history POST] Ошибка при создании записи в истории:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('[/api/history POST] Соединение с базой данных закрыто.');
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

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { plot_id, counter_id, owner_id } = body;

    if (!plot_id || !counter_id || !owner_id) {
      return NextResponse.json({ message: 'Все поля обязательны' }, { status: 400 });
    }

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO history (plot_id, counter_id, owner_id, date)
       VALUES (?, ?, ?, NOW())`,
      [plot_id, counter_id, owner_id]
    );

    return NextResponse.json({
      message: 'Запись в history создана',
      history: {
        id: result.insertId,
        plot_id,
        counter_id,
        owner_id,
      },
    });
  } catch (err) {
    console.error('Ошибка при создании записи в history:', err);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
*/