import pool from "@/app/lib/pool_db";


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
