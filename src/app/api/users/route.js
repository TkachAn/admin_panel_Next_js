//src/app/api/users/route.js
import { NextResponse } from 'next/server';
import query from '@/app/lib/db'; // Обёртка для подключения к БД
import bcrypt from 'bcrypt';

// Функция для форматирования даты в "ДД.ММ.ГГГГ"
function formatDate(dateString) {
  if (!dateString) {
    return null; // Или какое-то другое значение по умолчанию
  }
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JS с 0
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}


export async function GET() {
  try {
    const users = await query('SELECT id, name, email, role, note, createAt FROM users');
    const formattedUsers = users.map(user => ({
      ...user,
      createAt: formatDate(user.createAt),
    }));
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Ошибка при подключении к базе:', error);
    return NextResponse.json({ error: 'Ошибка подключения к базе данных' }, { status: 500 });
  }
}



/*
export async function GET() {
  try {
    const users = await query('SELECT id, name, email, role, note, createAt FROM users');

    // Форматируем дату createAt для каждого пользователя
    const formattedUsers = users.map(user => ({
      ...user,
      createAt: formatDate(user.createAt),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Ошибка при подключении к базе:', error);
    return NextResponse.json({ error: 'Ошибка подключения к базе данных' }, { status: 500 });
  }
}*/

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, pass, role, note } = body;

    if (!name || !email || !pass || !role) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(pass, saltRounds);

    const results = await query(
      'INSERT INTO users (name, email, pass, role, note, createAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, hashedPass, role, note]
    );

    return NextResponse.json({ message: 'Пользователь успешно добавлен', userId: results.insertId }, { status: 201 });

  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    return NextResponse.json({ error: 'Не удалось добавить пользователя' }, { status: 500 });
  }
}

/*
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
}*/
