import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { serial_number, model, note, start_reading } = data;

    // 1. Добавляем новый счётчик
    const [counterResult] = await pool.execute(
      `INSERT INTO counters (serial_number, model, note) VALUES (?, ?, ?)`,
      [serial_number, model, note]
    );

    const counterId = counterResult.insertId;

    // 2. Создаём пустую запись в history для привязки счётчика (возможно позже обновим owner_id/plot_id)
    const [historyResult] = await pool.execute(
      `INSERT INTO history (counter_id) VALUES (?)`,
      [counterId]
    );

    const historyId = historyResult.insertId;

    // 3. Добавляем стартовые показания
    await pool.execute(
      `INSERT INTO readings (history_id, reading) VALUES (?, ?)`,
      [historyId, start_reading]
    );

    return NextResponse.json({ message: 'Счётчик успешно добавлен' });
  } catch (error) {
    console.error('Ошибка при добавлении счётчика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
