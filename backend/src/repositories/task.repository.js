import { pool } from "../config/db.js";

export async function findAll(status) {
  let query = `
    SELECT id, title, description, status, created_at
    FROM tasks
  `;

  const values = [];

  if (status) {
    values.push(status);
    query += ` WHERE status = $1`;
  }

  query += ` ORDER BY created_at DESC, id DESC`;

  const result = await pool.query(query, values);

  return result.rows;
}

export async function create(task) {
  const { title, description } = task;

  const query = `
    INSERT INTO tasks (title, description)
    VALUES ($1, $2)
    RETURNING id, title, description, status, created_at
  `;

  const result = await pool.query(query, [
    title,
    description ?? null,
  ]);

  return result.rows[0];
}

export async function updateStatus(id, status) {
  const query = `
    UPDATE tasks
    SET status = $1
    WHERE id = $2
    RETURNING id, title, description, status, created_at
  `;

  const result = await pool.query(query, [status, id]);

  return result.rows[0] ?? null;
}