import pool from '@/app/lib/pool_db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  const ownerId = searchParams.get('ownerId');
  //const counterId = searchParams.get('counterId');

  let whereClauses = [];
  let values = [];

  if (plotId) {
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
//p_o_h_readings
    const query = `
      SELECT * FROM all_data
      ${whereClause}
      ORDER BY date DESC
    `;
    const [rows] = await connection.execute(query, values);

    return NextResponse.json({ readings: rows });
  } catch (error) {
    console.error('Ошибка при запросе из all_data:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
