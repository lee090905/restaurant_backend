import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS workshiftsprops (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user INT NOT NULL,
      starttime DATETIME NOT NULL,
      endtime DATETIME,
      tolalhours INT,
      note TEXT,
      status ENUM('open','close') NOT NULL DEFAULT 'close',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;
  try {
    await pool.query(sql);
    console.log("Migration 7: ensured 'workshifts' table exists");
  } catch (err) {
    console.error("Migration 7 failed:", err);
    throw err;
  }
}
