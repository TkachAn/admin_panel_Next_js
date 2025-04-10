// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import query from '@/app/lib/db';

export async function DELETE(request, { params }) {
  //const userId = params.id;
  const awaitedParams = await params;
  const userId = awaitedParams.id;

  if (!userId || isNaN(userId)) {
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
  }

  try {
    const result = await query("DELETE FROM users WHERE id = ?", [userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}
export async function PATCH(request, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Не передан ID пользователя' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, email, role, note } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Обязательные поля отсутствуют' }, { status: 400 });
    }

    await query(
      `UPDATE users SET name = ?, email = ?, role = ?, note = ? WHERE id = ?`,
      [name, email, role, note || '', id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
  }
}
