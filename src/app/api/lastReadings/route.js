//src/app/api/lastReadings/route.js

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
  const plotNumberSearch = searchParams.get('plotNumberSearch') || '';
  const ownerNameSearch = searchParams.get('ownerNameSearch') || '';

  let connection;
  try {
    connection = await pool.getConnection();
    let query = 'SELECT * FROM last_p_o_h_readings WHERE 1=1';
    const values = [];

    if (plotNumberSearch) {
      console.log("plotNumberSearch", plotNumberSearch)
      query += ' AND plot_number LIKE ?';
      values.push(`%${plotNumberSearch}%`);
    }

    if (ownerNameSearch) {
      console.log("ownerNameSearch", ownerNameSearch)
      query += ' AND owner_name LIKE ?';
      values.push(`%${ownerNameSearch}%`);
    }

    const [rows] = await connection.execute(query, values);
    return NextResponse.json({
      readings: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error('Ошибка при выполнении запроса к базе данных:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/*
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Создаем пул соединений с базой данных
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT || 3306,
});

export async function GET() {
  let connection;
  try {
    // Устанавливаем соединение с базой данных
    ///connection = await mysql.createConnection(pool);

    // Выполняем SQL-запрос к представлению
    const [rows] = await pool.execute('SELECT * FROM last_p_o_h_readings');

    // Возвращаем данные в формате JSON
    return NextResponse.json(rows);

  } catch (error) {
    console.error('Ошибка при выполнении запроса к базе данных:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });

  } finally {
    // Закрываем соединение, если оно было установлено
    if (connection) {
      await connection.end();
    }
  }
}
*/

/*
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Создаём пул соединений
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        r.id, 
        r.readings_date, 
        r.readings, 
        r.note AS history_note,
        p.plot_number, 
        o.full_name AS owner_name,
        c.serial_number
      FROM readings r
      INNER JOIN (
        SELECT MAX(id) as max_id
        FROM readings
        GROUP BY history_id
      ) AS latest ON r.id = latest.max_id
      LEFT JOIN history h ON r.history_id = h.id
      LEFT JOIN plots p ON h.plot_id = p.id
      LEFT JOIN owners o ON h.owner_id = o.id
      LEFT JOIN counters c ON h.counter_id = c.id
    `);

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("Ошибка при получении последних показаний:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
*/
/*
import mysql from 'mysql2/promise';

// Пул соединений
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        r.id, 
        DATE_FORMAT(r.date, '%d.%m') AS readings_date,
        DATE_FORMAT(r.updateAt, '%d.%m.%Y %H:%i') AS readings_updateAt,
        r.reading,
        r.note AS history_note,
        p.plot_number, 
        o.owner_name,
        c.serial_number
      FROM readings r
      INNER JOIN (
        SELECT MAX(id) AS max_id
        FROM readings
        GROUP BY history_id
      ) AS latest ON r.id = latest.max_id
      LEFT JOIN history h ON r.history_id = h.id
      LEFT JOIN plots p ON h.plot_id = p.id
      LEFT JOIN owners o ON h.owner_id = o.id
      LEFT JOIN counters c ON h.counter_id = c.id
      ORDER BY p.plot_number
    `);

    return new Response(
      JSON.stringify({ data: rows }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Ошибка при получении последних показаний:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка сервера" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
*/