import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function registerUser(first_name, last_name, email, password) {
  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [first_name, last_name, email, hashedPassword]
  );

  const userId = result.insertId;
  const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

  return { user: { id: userId, first_name, last_name, email }, token };
}

export async function loginUser(email, password) {
  const [users] = await db.query('SELECT id, email, password FROM users WHERE email = ?', [email]);
  if (!users.length) throw new Error('Invalid credentials');

  const user = users[0];
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  return { user: { id: user.id, email: user.email }, token };
}

