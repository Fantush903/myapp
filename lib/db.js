import mysql from 'mysql2/promise'

// Connection pool — reuses connections efficiently
let pool

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit:    10,
    })
  }
  return pool
}

// Creates the users table if it doesn't exist yet
export async function initDb() {
  const pool = getPool()
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      reset_code VARCHAR(10)  DEFAULT NULL,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function findUserByEmail(email) {
  const pool = getPool()
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
  return rows[0] || null
}

export async function createUser({ name, email, hashedPassword }) {
  const pool = getPool()
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  )
  return { id: result.insertId, name, email }
}

export async function setResetCode(email, code) {
  const pool = getPool()
  await pool.execute('UPDATE users SET reset_code = ? WHERE email = ?', [code, email])
}

export async function resetPassword(email, code, hashedPassword) {
  const pool = getPool()
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE email = ? AND reset_code = ?',
    [email, code]
  )
  if (!rows[0]) return false
  await pool.execute(
    'UPDATE users SET password = ?, reset_code = NULL WHERE email = ?',
    [hashedPassword, email]
  )
  return true
}
