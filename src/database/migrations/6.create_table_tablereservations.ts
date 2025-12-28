import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS tablereservations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      reservedAt DATETIME NOT NULL,
      status ENUM('reserved', 'cancelled', 'completed') NOT NULL,
      note TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;
  try {
    await pool.query(sql);
    console.log("Migration 6: ensured 'table_reservations' table exists");
  } catch (err) {
    console.error("Migration 6 failed:", err);
    throw err;
  }
}
