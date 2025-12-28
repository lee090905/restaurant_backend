import pool from "../mysql";
 
export default async function run(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS dishes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL DEFAULT 0,
      category enum('appetizer', 'Salad', 'Grilled', 'Fried', 'Stir-fried', 'Steamed/Boiled', 'Hotpot', 'Seafood', 'Specials', 'Drinks', 'inactive') NOT NULL,
      active TINYINT(1) DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;
    try {
        await pool.query(sql);
        console.log("Migration 3: ensured 'dishes' table exists");
    } catch (err) {
        console.error("Migration 3 failed:", err);
        throw err;
    }
}