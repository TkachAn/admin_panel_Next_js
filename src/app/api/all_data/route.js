// src/app/api/all_data/route.js

import pool from '@/app/lib/pool_db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotNumberSearch = searchParams.get('plotNumberSearch') || '';

  let connection;
  try {
    connection = await pool.getConnection();
    let query = 'SELECT * FROM all_data WHERE 1=1';
    const values = [];

    if (plotNumberSearch) {
      query += ' AND plot_number LIKE ?';
      values.push(`%${plotNumberSearch}%`);
    }

      // Добавляем предложение ORDER BY для сортировки по r_id в обратном порядке
    query += ' ORDER BY r_id DESC';

    const [rows] = await connection.execute(query, values);
    return NextResponse.json({
      records: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error('Ошибка при выполнении запроса к all_data:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
