
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


/*

// app/api/plots-data/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import query from '@/app/lib/db'; // Или правильный путь к твоему файлу db.js

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT || 3306,
});

const ITEMS_PER_PAGE = 10;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotNumberFilter = searchParams.get('plotNumber') || '';
  const ownerNameFilter = searchParams.get('ownerName') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  console.log('Запрос:', { plotNumberFilter, ownerNameFilter, page, offset });

  try {
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM plots p
      JOIN history h ON p.id = h.plot_id
      JOIN owners o ON h.owner_id = o.id
      JOIN counters c ON h.counter_id = c.id
      WHERE h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
    `;

    let mainQuery = `
      SELECT
        p.plot_number,
        o.owner_name,
        c.serial_number,
        h.note AS history_note,
        h.createAt AS history_createAt,
        r.date AS reading_date,
        r.updateAt AS reading_updateAt
      FROM
        plots p
      JOIN
        history h ON p.id = h.plot_id
      JOIN
        owners o ON h.owner_id = o.id
      JOIN
        counters c ON h.counter_id = c.id
      LEFT JOIN (
        SELECT
          date,
          updateAt,
          history_id
        FROM
          readings
        WHERE
          history_id IN (SELECT MAX(id) FROM readings GROUP BY history_id)
      ) r ON h.id = r.history_id
      WHERE
        h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
    `;

    const conditions = [];
    const params = [];

    if (plotNumberFilter) {
      conditions.push('p.plot_number LIKE ?');
      params.push(`%${plotNumberFilter}%`);
    }

    if (ownerNameFilter) {
      conditions.push('o.owner_name LIKE ?');
      params.push(`%${ownerNameFilter}%`);
    }

    if (conditions.length > 0) {
      countQuery += ' AND ' + conditions.join(' AND ');
      mainQuery += ' AND ' + conditions.join(' AND ');
    }

    console.log('Запрос COUNT:', countQuery, params);
    const [totalResult] = await query(countQuery, params);
    console.log('Результат COUNT:', totalResult);
/*
    let totalPages = 1;
    let totalItems = 0;
    if (totalResult && totalResult[0] && totalResult[0].total) {
      totalItems = totalResult[0].total;
      totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    }
*//*
    let totalPages = 1;
    let totalItems = 0;
    if (totalResult && totalResult[0]) {
      totalItems = totalResult[0].total;
      totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    }

    console.log('Всего элементов:', totalItems, 'Всего страниц:', totalPages);

    mainQuery += ' ORDER BY h.id DESC LIMIT ? OFFSET ?';
    const finalParams = [...params, ITEMS_PER_PAGE, offset];
    console.log('Запрос MAIN:', mainQuery, finalParams);
    const [rows2] = await query(mainQuery, finalParams);
    console.log('Результат MAIN:', rows2);
*//*
    const formattedResults = rows2.map(row => ({
      ...row,
      history_createAt: row.history_createAt ? new Date(row.history_createAt).toLocaleDateString() : null,
      reading_date: row.reading_date ? new Date(row.reading_date).toLocaleDateString() : null,
      reading_updateAt: row.reading_updateAt ? new Date(row.reading_updateAt).toLocaleTimeString() : null,
    }));
    *//*

    const formattedResults = Array.isArray(rows2)
    ? rows2.map(row => ({
          ...row,
          history_createAt: row.history_createAt ? new Date(row.history_createAt).toLocaleDateString() : null,
          reading_date: row.reading_date ? new Date(row.reading_date).toLocaleDateString() : null,
          reading_updateAt: row.reading_updateAt ? new Date(row.reading_updateAt).toLocaleTimeString() : null,
      }))
    : []; // Или обработка ошибки, если rows2 не массив

    console.log('Отформатированные результаты:', formattedResults);

    return NextResponse.json({
      data: formattedResults,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Ошибка TRY/CATCH:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  }
}*/
/*
const ITEMS_PER_PAGE = 10;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotNumberFilter = searchParams.get('plotNumber') || '';
  const ownerNameFilter = searchParams.get('ownerName') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const connection = await pool.getConnection();
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM plots p
      JOIN history h ON p.id = h.plot_id
      JOIN owners o ON h.owner_id = o.id
      JOIN counters c ON h.counter_id = c.id
      WHERE h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
    `;

    let mainQuery = `
      SELECT
        p.plot_number,
        o.owner_name,
        c.serial_number,
        h.note AS history_note,
        h.createAt AS history_createAt,
        r.date AS reading_date,
        r.updateAt AS reading_updateAt
      FROM
        plots p
      JOIN
        history h ON p.id = h.plot_id
      JOIN
        owners o ON h.owner_id = o.id
      JOIN
        counters c ON h.counter_id = c.id
      LEFT JOIN (
        SELECT
          date,
          updateAt,
          history_id
        FROM
          readings
        WHERE
          history_id IN (SELECT MAX(id) FROM readings GROUP BY history_id)
      ) r ON h.id = r.history_id
      WHERE
        h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
    `;

    const conditions = [];
    const params = [];

    if (plotNumberFilter) {
      conditions.push('p.plot_number LIKE ?');
      params.push(`%${plotNumberFilter}%`);
    }

    if (ownerNameFilter) {
      conditions.push('o.owner_name LIKE ?');
      params.push(`%${ownerNameFilter}%`);
    }

    if (conditions.length > 0) {
      countQuery += ' AND ' + conditions.join(' AND ');
      mainQuery += ' AND ' + conditions.join(' AND ');
    }

    const [totalResult] = await connection.execute(countQuery, params);
    const totalItems = totalResult[0].total;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    mainQuery += ' ORDER BY h.id DESC LIMIT ? OFFSET ?';
    const [rows] = await connection.execute(mainQuery, [...params, ITEMS_PER_PAGE, offset]);

    connection.release();

    const formattedResults = rows.map(row => ({
      ...row,
      history_createAt: row.history_createAt ? new Date(row.history_createAt).toLocaleDateString() : null,
      reading_date: row.reading_date ? new Date(row.reading_date).toLocaleDateString() : null,
      reading_updateAt: row.reading_updateAt ? new Date(row.reading_updateAt).toLocaleTimeString() : null,
    }));

    return NextResponse.json({
      data: formattedResults,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Ошибка при выполнении запроса к базе данных:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  }
}
*/
/*
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT || 3306,
});

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(`
      SELECT
        p.plot_number,
        o.owner_name,
        c.serial_number,
        h.note AS history_note,
        h.createAt AS history_createAt,
        r.date AS reading_date,
        r.updateAt AS reading_updateAt
      FROM
        counters c
      JOIN
        history h ON c.id = h.counter_id
      JOIN
        owners o ON h.owner_id = o.id
      JOIN
        plots p ON h.plot_id = p.id
      LEFT JOIN (
        SELECT
          date,
          updateAt,
          history_id
        FROM
          readings
        WHERE
          history_id IN (SELECT MAX(id) FROM readings GROUP BY history_id)
      ) r ON h.id = r.history_id
      WHERE
        h.id IN (SELECT MAX(id) FROM history GROUP BY plot_id)
      ORDER BY
        p.plot_number;
    `);
    connection.release();

    const formattedResults = rows.map(row => ({
      ...row,
      history_createAt: row.history_createAt ? new Date(row.history_createAt).toLocaleDateString() : null,
      reading_date: row.reading_date ? new Date(row.reading_date).toLocaleDateString() : null,
      reading_updateAt: row.reading_updateAt ? new Date(row.reading_updateAt).toLocaleTimeString() : null,
    }));

    return NextResponse.json({ data: formattedResults });
  } catch (error) {
    console.error('Ошибка при выполнении запроса к базе данных:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  }
}
  */