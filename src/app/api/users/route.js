//src/app/api/users/route.js



import { NextResponse } from 'next/server';
import query from '@/app/lib/db'; // Обёртка для подключения к БД
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const users = await query('SELECT id, name, email, role, note, createAt FROM users');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Ошибка при подключении к базе:', error);
    return NextResponse.json({ error: 'Ошибка подключения к базе данных' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, pass, role, note } = body;

    if (!name || !email || !pass || !role) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 });
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(pass, saltRounds);
    // Например:
    const results = await query(
      'INSERT INTO users (name, email, pass, role, note, createAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, hashedPass, role, note] // Обратите внимание: вы не передаете createAt из формы, а генерируете его на сервере
    );

    // После успешного сохранения вы можете вернуть какой-то ответ
    return NextResponse.json({ message: 'Пользователь успешно добавлен', userId: results.insertId }, { status: 201 });

  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    return NextResponse.json({ error: 'Не удалось добавить пользователя' }, { status: 500 });
  }
}
// НОВЫЙ ОБРАБОТЧИК ДЛЯ DELETE (удаление пользователя по ID)
export async function DELETE(request) {
  // Получаем ID пользователя из URL
  const parts = request.url.split('/');
  const userId = parts[parts.length - 1]; // Предполагаем, что ID находится в конце URL

  if (!userId || isNaN(userId)) {
    return NextResponse.json({ error: 'Некорректный ID пользователя' }, { status: 400 });
  }

  try {
    const results = await query('DELETE FROM users WHERE id = ?', [userId]);

    if (results.affectedRows > 0) {
      return NextResponse.json({ message: `Пользователь с ID ${userId} успешно удален` }, { status: 200 });
    } else {
      return NextResponse.json({ error: `Пользователь с ID ${userId} не найден` }, { status: 404 });
    }
  } catch (error) {
    console.error(`Ошибка при удалении пользователя с ID ${userId}:`, error);
    return NextResponse.json({ error: 'Не удалось удалить пользователя' }, { status: 500 });
  }
}

/*

//src/app/api/users/route.js
import { NextResponse } from 'next/server';
import query from '@/app/lib/db'; // Обёртка для подключения к БД

export async function GET() {
  try {
    const users = await query('SELECT id, name, email, role, note, createAt FROM users');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Ошибка при подключении к базе:', error);
    return NextResponse.json({ error: 'Ошибка подключения к базе данных' }, { status: 500 });
  }
}
*/

/*
export async function GET(request) {
  const parts = request.url.split('/');
  const userId = parts[parts.length - 1];

  // Проверяем, является ли последний сегмент числом (вероятный ID пользователя)
  if (userId && !isNaN(userId)) {
    // Запрос на получение конкретного пользователя по ID
    try {
      const user = await query('SELECT id, name, email, role, note, createAt FROM users WHERE id = ?', [userId]);
      if (user.length > 0) {
        return NextResponse.json(user[0]);
      } else {
        return NextResponse.json({ error: `Пользователь с ID ${userId} не найден` }, { status: 404 });
      }
    } catch (error) {
      console.error(`Ошибка при получении пользователя с ID ${userId}:`, error);
      return NextResponse.json({ error: 'Не удалось получить пользователя' }, { status: 500 });
    }
  } else {
    // Запрос на получение списка всех пользователей
    try {
      const users = await query('SELECT id, name, email, role, note, createAt FROM users');
      return NextResponse.json(users);
    } catch (error) {
      console.error('Ошибка при подключении к базе:', error);
      return NextResponse.json({ error: 'Ошибка подключения к базе данных' }, { status: 500 });
    }
  }
}*/

