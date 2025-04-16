import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT || 3306,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  const ownerId = searchParams.get('ownerId');
  const counterId = searchParams.get('counterId');

  let whereClauses = [];
  let values = [];

  if (plotId && ownerId && counterId) {
    // Клик по строке: ищем по всем трём ID
    whereClauses.push('plot_id = ?', 'owner_id = ?', 'counter_id = ?');
    values.push(plotId, ownerId, counterId);
  } else if (plotId && ownerId) {
    // Фильтрация по участку и владельцу
    whereClauses.push('plot_id = ?', 'owner_id = ?');
    values.push(plotId, ownerId);
  } else if (plotId) {
    // Только по участку
    whereClauses.push('plot_id = ?');
    values.push(plotId);
  } else if (ownerId) {
    // Только по владельцу
    whereClauses.push('owner_id = ?');
    values.push(ownerId);
  } else {
    return NextResponse.json({ error: 'Недостаточно параметров' }, { status: 400 });
  }

  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT * FROM p_o_h_readings
      ${whereClause}
      ORDER BY date DESC
    `;
    const [rows] = await connection.execute(query, values);

    return NextResponse.json({ readings: rows });
  } catch (error) {
    console.error('Ошибка при запросе из p_o_h_readings:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
