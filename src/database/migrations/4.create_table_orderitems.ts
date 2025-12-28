import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS orderitems (
      id INT PRIMARY KEY AUTO_INCREMENT,
      orderId INT NOT NULL,
      dishId INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      price DECIMAL(10, 2) NOT NULL,
      note TEXT,
      status ENUM('pending', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
      cancelReason TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await pool.query(sql);
    console.log("Migration 5: ensured 'order_items' table exists");
  } catch (err) {
    console.error("Migration 5 failed:", err);
    throw err;
  }
}
