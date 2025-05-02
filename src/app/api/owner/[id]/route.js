// src/app/api/owner/[id]/route.js
import pool from '@/app/lib/pool_db';
import { NextResponse } from 'next/server';

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