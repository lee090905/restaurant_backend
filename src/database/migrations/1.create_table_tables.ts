import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS tables (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      status ENUM('open', 'close') NOT NULL DEFAULT 'open',
      area ENUM('1', '2', '3') NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;

	try {
		await pool.query(sql);
		console.log("Migration 2: ensured 'tables' table exists");
	} catch (err) {
		console.error("Migration 2 failed:", err);
		throw err;
	}
}
