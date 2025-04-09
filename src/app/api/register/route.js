//src/api/register/route.js
import bcrypt from 'bcrypt';
import query from '@/app/lib/db';

export async function POST(req) {
  const { name, email, pass } = await req.json();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);

  await query('INSERT INTO users (name, email, pass, salt, role) VALUES (?, ?, ?, ?, ?)', [name, email, hash, salt, 'user']);

  return Response.json({ ok: true });
}
