//api/admin/user/rqute.js
import { NextResponse } from 'next/server';
import query from '@/app/lib/db';
import bcrypt from 'bcryptjs';
//import { sha256 } from 'js-sha256'; // Импортируем sha256

export async function GET() {
  try {
    const results = await query('SELECT id, name, email, role, createAt FROM users');
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    return NextResponse.json({ message: 'Ошибка сервера при получении списка пользователей' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // Простая валидация данных
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Пожалуйста, заполните все поля.' }, { status: 400 });
    }

    // Проверка на существование пользователя с таким email
    const existingUser = await query('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Пользователь с таким email уже существует.' }, { status: 409 }); // Conflict
    }

    // Генерация salt
    const salt = sha256(Math.random().toString()).substring(0, 16); // Генерация соли

    // Хеширование пароля с использованием salt
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    // Выполнение SQL-запроса для добавления нового пользователя
    const result = await query(
      'INSERT INTO users (name, email, pass, role, salt) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, salt]
    );

    if (result.insertId) {
      return NextResponse.json({ message: 'Пользователь успешно добавлен!' }, { status: 201 }); // Created
    } else {
      return NextResponse.json({ message: 'Ошибка при добавлении пользователя в базу данных.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    return NextResponse.json({ message: 'Ошибка сервера при добавлении пользователя.' }, { status: 500 });
  }
}