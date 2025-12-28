import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(512) NOT NULL,
      role ENUM('admin', 'staff') NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;
  try {
  await pool.query(sql);
  console.log("Migration 5: ensured 'users' table exists");
  } 
  catch (err) {
  console.error("Migration 5 failed:", err);
  throw err;
  }
}
