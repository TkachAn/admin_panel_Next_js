import { pool } from '@/app/lib/db';

export async function POST(req) {
  try {
    const data = await req.json();
    const { plot_number, owner_name, phone_number, email, note } = data;

    // Получаем данные из вьюшки по номеру участка
    const [vresults] = await pool.execute(
      'SELECT * FROM vplotdata WHERE plot_number = ?',
      [plot_number]
    );

    if (vresults.length === 0) {
      return new Response(JSON.stringify({ error: 'Участок не найден' }), { status: 404 });
    }

    const v = vresults[0];
    const plot_id = v.p_id;
    const counter_id = v.c_id;
    const last_reading = v.reading;

    // Проверяем есть ли уже такой владелец
    const [ownerResults] = await pool.execute(
      'SELECT id FROM owners WHERE owner_name = ?',
      [owner_name]
    );

    let owner_id;

    if (ownerResults.length > 0) {
      owner_id = ownerResults[0].id;
    } else {
      const [insertOwner] = await pool.execute(
        'INSERT INTO owners (owner_name, phone_number, email, note) VALUES (?, ?, ?, ?)',
        [owner_name, phone_number, email, note]
      );
      owner_id = insertOwner.insertId;
    }

    // Добавляем запись в history
    const [historyInsert] = await pool.execute(
      'INSERT INTO history (plot_id, owner_id, counter_id, note) VALUES (?, ?, ?, ?)',
      [plot_id, owner_id, counter_id, note]
    );
    const history_id = historyInsert.insertId;

    // Добавляем новую запись показаний
    await pool.execute(
      'INSERT INTO readings (history_id, reading) VALUES (?, ?)',
      [history_id, last_reading]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Ошибка при добавлении владельца:', err);
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), { status: 500 });
  }
}
