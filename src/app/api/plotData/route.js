//src/app/api/plotData/route.js
/*
import mysql from 'mysql2/promise';


// Создаем пул соединений с базой данных
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT || 3306,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const offset = (page - 1) * pageSize;

  // Новые параметры фильтрации
  const plotNumber = searchParams.get('plotNumber') || '';
  const ownerName = searchParams.get('ownerName') || '';

  try {
    // Общая часть SQL
    const baseQuery = `
      FROM plots p
      JOIN history h ON p.id = h.plot_id
      JOIN owners o ON h.owner_id = o.id
      JOIN counters c ON h.counter_id = c.id
      JOIN readings r ON r.history_id = h.id
      WHERE
        h.id = (SELECT id FROM history WHERE plot_id = p.id ORDER BY createAt DESC LIMIT 1)
        AND r.id = (SELECT id FROM readings WHERE history_id = h.id ORDER BY updateAt DESC LIMIT 1)
        AND p.plot_number LIKE ?
        AND o.owner_name LIKE ?
    `;

    // Параметры для LIKE
    const likePlot = `%${plotNumber}%`;
    const likeOwner = `%${ownerName}%`;

    // Получаем записи с учётом фильтра
    const [results] = await pool.execute(
      `
        SELECT
          p.plot_number,
          o.full_name AS owner_name,
          c.serial_number,
          r.note AS history_note,
          h.createAt AS history_createAt,
          DATE_FORMAT(r.date, '%d.%m') AS readings_date,
          DATE_FORMAT(r.updateAt, '%d.%m.%Y %H:%i') AS readings_updateAt,
          r.reading AS readings
        ${baseQuery}
        ORDER BY p.plot_number
        LIMIT ? OFFSET ?
      `,
      [likePlot, likeOwner, pageSize, offset]
    );

    // Подсчитываем общее число записей с учётом фильтра
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) AS total ${baseQuery}`,
      [likePlot, likeOwner]
    );

    const totalRecords = countResult[0].total;

    return new Response(
      JSON.stringify({
        data: results,
        totalRecords,
        totalPages: Math.ceil(totalRecords / pageSize),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при запросе данных:', error);
    return new Response('Ошибка сервера', { status: 500 });
  }
}
*/


import mysql from 'mysql2/promise';

// Создание пула соединений с базой данных
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const offset = (page - 1) * pageSize;

  const plotNumber = searchParams.get('plotNumber')?.trim() || '';
  const ownerName = searchParams.get('ownerName')?.trim() || '';

  const likePlot = `%${plotNumber}%`;
  const likeOwner = `%${ownerName}%`;

  const baseQuery = `
    FROM plots p
    JOIN history h ON p.id = h.plot_id
    JOIN owners o ON h.owner_id = o.id
    JOIN counters c ON h.counter_id = c.id
    JOIN readings r ON r.history_id = h.id
    WHERE
      h.id = (
        SELECT id FROM history
        WHERE plot_id = p.id
        ORDER BY createAt DESC
        LIMIT 1
      )
      AND r.id = (
        SELECT id FROM readings
        WHERE history_id = h.id
        ORDER BY updateAt DESC
        LIMIT 1
      )
      AND p.plot_number LIKE ?
      AND o.owner_name LIKE ?
  `;

  try {
    // Получение данных
    const [dataRows] = await pool.execute(
      `
        SELECT
          p.plot_number,
          o.owner_name,
          c.serial_number,
          r.note AS history_note,
          h.createAt AS history_createAt,
          DATE_FORMAT(r.date, '%d.%m') AS readings_date,
          DATE_FORMAT(r.updateAt, '%d.%m.%Y %H:%i') AS readings_updateAt,
          r.reading AS reading
        ${baseQuery}
        ORDER BY p.plot_number
        LIMIT ?
        OFFSET ?
      `,
      [likePlot, likeOwner, pageSize, offset]
    );

    // Получение количества записей
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total ${baseQuery}`,
      [likePlot, likeOwner]
    );

    const totalRecords = countRows[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return new Response(
      JSON.stringify({
        data: dataRows,
        totalRecords,
        totalPages,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Ошибка при запросе данных:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при получении данных' }),
      { status: 500 }
    );
  }
}



/*
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);

  const offset = (page - 1) * pageSize;

  try {
    // Запрос на получение данных
    const [results] = await pool.execute(
      `
        SELECT
          p.plot_number,
          o.owner_name,
          c.serial_number,
          r.note AS history_note,
          h.createAt AS history_createAt,
          DATE_FORMAT(r.date, '%d.%m') AS readings_date,  -- Форматируем дату
          DATE_FORMAT(r.updateAt, '%d.%m.%Y %H:%i') AS readings_updateAt,  -- Форматируем время
          r.reading AS readings  -- Исправленное поле для показаний
        FROM
          plots p
        JOIN
          history h ON p.id = h.plot_id
        JOIN
          owners o ON h.owner_id = o.id
        JOIN
          counters c ON h.counter_id = c.id
        JOIN
          readings r ON r.history_id = h.id
        WHERE
          h.id = (SELECT id FROM history WHERE plot_id = p.id ORDER BY createAt DESC LIMIT 1)
          AND r.id = (SELECT id FROM readings WHERE history_id = h.id ORDER BY updateAt DESC LIMIT 1)
        ORDER BY
          p.plot_number
        LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    // Запрос на получение общего числа записей
    const [countResult] = await pool.execute(
      `
        SELECT COUNT(*) AS total
        FROM plots p
        JOIN history h ON p.id = h.plot_id
        JOIN owners o ON h.owner_id = o.id
        JOIN counters c ON h.counter_id = c.id
        JOIN readings r ON r.history_id = h.id
        WHERE
          h.id = (SELECT id FROM history WHERE plot_id = p.id ORDER BY createAt DESC LIMIT 1)
          AND r.id = (SELECT id FROM readings WHERE history_id = h.id ORDER BY updateAt DESC LIMIT 1)`
    );

    const totalRecords = countResult[0].total;

    return new Response(
      JSON.stringify({
        data: results,
        totalRecords,
        totalPages: Math.ceil(totalRecords / pageSize),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при запросе данных:', error);
    return new Response('Ошибка сервера', { status: 500 });
  }
}
*/