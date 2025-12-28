import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      tableID INT,
      openedAt DATETIME NOT NULL,
      closedAt DATETIME,
      status ENUM('open', 'waiting_payment', 'closed') NOT NULL DEFAULT 'open',
      note TEXT
    ) DEFAULT CHARSET=utf8mb4;
  `;

    try {
        await pool.query(sql);
        console.log("Migration 4: ensured 'orders' table exists");
    } catch (err) {
        console.error("Migration 4 failed:", err);
        throw err;
    }
}