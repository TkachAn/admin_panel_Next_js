// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import query from '@/app/lib/db';

export async function DELETE(request, { params }) {
  const userId = params.id;

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
