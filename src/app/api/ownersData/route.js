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
  const ownerName = searchParams.get('owner_name') || '';

  try {
    // Запрос к view_owners_data для фильтрации по имени владельца
    const [results] = await pool.execute(
      `
        SELECT * 
        FROM view_owners_data
        WHERE owner_name LIKE ?
        ORDER BY owner_name ASC
      `,
      [`%${ownerName}%`]
    );

    return new Response(
      JSON.stringify({ data: results }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при запросе данных:', error);
    return new Response('Ошибка сервера', { status: 500 });
  }
}
