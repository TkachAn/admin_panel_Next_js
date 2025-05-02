// src/app/api/users/[id]/route.js //Для редактирования выбранного пользователя 
import { NextResponse } from 'next/server';
import query from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcrypt';

export async function DELETE(request, { params }) {
  const awaitedParams = await params;
  const userIdToDelete = awaitedParams.id;
  console.log('userIdToDelete: ', userIdToDelete);

  // Отримайте інформацію про поточну сесію (поточного користувача)
  const session = await getServerSession();
  console.log('session: ', session);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Потрібна автентифікація' }, { status: 401 });
  }

  const currentUserEmail = session.user.email;
  console.log('currentUserEmail: ', currentUserEmail);

  try {
    if (!userIdToDelete || isNaN(userIdToDelete)) {
      return NextResponse.json({ error: 'Некоректний ID користувача' }, { status: 400 });
    }

    // Отримайте email видаляємого користувача за його ID
    const userToDeleteResult = await query('SELECT email FROM users WHERE id = ?', [userIdToDelete]);

    if (!userToDeleteResult || userToDeleteResult.length === 0) {
      return NextResponse.json({ error: `Користувача з ID ${userIdToDelete} не знайдено` }, { status: 404 });
    }

    const userToDeleteEmail = userToDeleteResult[0].email;
    console.log('userToDeleteEmail: ', userToDeleteEmail);

    // Порівняйте email поточного користувача та видаляємого
    if (currentUserEmail === userToDeleteEmail) {
      return NextResponse.json({ error: 'Администратор не может удалить самого себя!' }, { status: 403 });
    }

    const deleteResult = await query('DELETE FROM users WHERE id = ?', [userIdToDelete]);
    console.log('deleteResult: ', deleteResult);

    if (deleteResult.affectedRows > 0) {
      return NextResponse.json({ message: `Користувача з ID ${userIdToDelete} успішно видалено` }, { status: 200 });
    } else {
      return NextResponse.json({ error: `Користувача з ID ${userIdToDelete} не знайдено` }, { status: 404 });
    }

  } catch (error) {
    console.error(`Помилка при видаленні користувача з ID ${userIdToDelete}:`, error);
    return NextResponse.json({ error: 'Не вдалося видалити користувача' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  //const awaitedParams = await params;
  const { id } = await params;
console.log('id route[]: ', id)
  if (!id) {
    return NextResponse.json({ error: 'Не передан ID пользователя' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, email, role, note, pass } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Обязательные поля отсутствуют' }, { status: 400 });
    }

    // Строим запрос динамически
    let sql = 'UPDATE users SET name = ?, email = ?, role = ?, note = ?';
    const values = [name, email, role, note || ''];

    if (pass && pass.trim() !== '') {
      const hashedPass = await bcrypt.hash(pass, 10);
      sql += ', pass = ?';
      values.push(hashedPass);
    }

    sql += ' WHERE id = ?';
    values.push(id);

    await query(sql, values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
  }
}
