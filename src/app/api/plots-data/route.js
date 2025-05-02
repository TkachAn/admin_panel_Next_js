
// app/api/plots-data/route.js
import { NextResponse } from 'next/server';
import query from '@/app/lib/db';

const ITEMS_PER_PAGE = 10;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    // Подсчёт общего количества
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM plots p
      JOIN history h ON p.id = h.plot_id
      WHERE h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
    `;
    const [countResult] = await query(countQuery);
    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    // Основной запрос
    const mainQuery = `
      SELECT
        p.plot_number,
        o.owner_name,
        c.serial_number,
        h.note AS history_note,
        h.createAt AS history_createAt,
        r.date AS reading_date,
        r.updateAt AS reading_updateAt
      FROM plots p
      JOIN history h ON p.id = h.plot_id
      JOIN owners o ON h.owner_id = o.id
      JOIN counters c ON h.counter_id = c.id
      LEFT JOIN (
        SELECT date, updateAt, history_id
        FROM readings
        WHERE history_id IN (SELECT MAX(id) FROM readings GROUP BY history_id)
      ) r ON h.id = r.history_id
      WHERE h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
      ORDER BY h.id DESC
      LIMIT ? OFFSET ?
    `;

    const data = await query(mainQuery, [ITEMS_PER_PAGE, offset]);

    const formatted = data.map(row => ({
      ...row,
      history_createAt: row.history_createAt
        ? new Date(row.history_createAt).toLocaleDateString('ru-RU')
        : 'Нет данных',
      reading_date: row.reading_date
        ? new Date(row.reading_date).toLocaleDateString('ru-RU')
        : 'Нет данных',
      reading_updateAt: row.reading_updateAt
        ? new Date(row.reading_updateAt).toLocaleTimeString('ru-RU')
        : 'Нет данных',
    }));

    return NextResponse.json({
      data: formatted,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Ошибка TRY/CATCH:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  }
}
