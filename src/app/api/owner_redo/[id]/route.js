// src/app/api/owner_redo/[id]/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden',
  port: process.env.DB_PORT || 3306,
});

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { phone_number, email, note } = body;

  if (!id) {
    return NextResponse.json({ message: 'ID владельца не указан' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE owners SET phone_number = ?, email = ?, note = ? WHERE id = ?`,
      [phone_number, email, note, id]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Данные владельца успешно обновлены' });
    } else {
      return NextResponse.json({ message: 'Владелец с таким ID не найден' }, { status: 404 });
    }
  } catch (error) {
    console.error('Ошибка при обновлении владельца:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}