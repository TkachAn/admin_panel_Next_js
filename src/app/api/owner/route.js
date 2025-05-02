// src/app/api/owner/route.js
import { NextResponse } from 'next/server';
import pool from '@/app/lib/pool_db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('owner_name');

  console.log('[/api/owner GET] Получено имя владельца для поиска:', name);

  if (!name) {
    console.log('[/api/owner GET] Имя не указано.');
    return NextResponse.json({ message: 'Имя не указано' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    console.log('[/api/owner GET] Подключение к базе данных успешно.');
    const [rows] = await connection.execute(
      'SELECT * FROM owners WHERE owner_name = ?',
      [name]
    );
    console.log('[/api/owner GET] Результат запроса SELECT * FROM owners:', rows);

    if (rows.length > 0) {
      console.log('[/api/owner GET] Владелец найден:', rows[0]);
      const response = NextResponse.json({ exists: true, owner: rows[0] });
      console.log('[/api/owner GET] Отправлен ответ:', response);
      return response;
    } else {
      console.log('[/api/owner GET] Владелец не найден.');
      const response = NextResponse.json({ exists: false });
      console.log('[/api/owner GET] Отправлен ответ:', response);
      return response;
    }
  } catch (err) {
    console.error('[/api/owner GET] Ошибка при поиске владельца:', err);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) connection.release();
    console.log('[/api/owner GET] Соединение с базой данных закрыто.');
  }
}

export async function POST(request) {
  console.log('[/api/owner POST] Получен POST-запрос на создание владельца.');
  let connection;
  try {
    const body = await request.json();
    const { owner_name, phone_number = '', email = '', note = '' } = body;
    console.log('[/api/owner POST] Тело запроса:', body);

    if (!owner_name) {
      console.log('[/api/owner POST] Имя владельца не указано.');
      return NextResponse.json({ message: 'Имя владельца не указано' }, { status: 400 });
    }

    connection = await pool.getConnection();
    console.log('[/api/owner POST] Подключение к базе данных успешно.');
    const [result] = await connection.execute(
      `INSERT INTO owners (owner_name, phone_number, email, note)
        VALUES (?, ?, ?, ?)`,
      [owner_name, phone_number, email, note]
    );
    console.log('[/api/owner POST] Результат запроса INSERT INTO owners:', result);

    const newOwner = {
      id: result.insertId,
      owner_name,
      phone_number,
      email,
      note,
    };
    console.log('[/api/owner POST] Создан новый владелец:', newOwner);
    const response = NextResponse.json({ owner: newOwner });
    console.log('[/api/owner POST] Отправлен ответ:', response);
    return response;
  } catch (err) {
    console.error('[/api/owner POST] Ошибка при создании владельца:', err);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) connection.release();
    console.log('[/api/owner POST] Соединение с базой данных закрыто.');
  }
}
