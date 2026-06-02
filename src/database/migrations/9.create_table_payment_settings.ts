import pool from "../mysql";

export default async function run(): Promise<void> {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS payment_settings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      bank_bin VARCHAR(20) NOT NULL,
      bank_name VARCHAR(100) NOT NULL,
      account_no VARCHAR(50) NOT NULL,
      account_name VARCHAR(150) NOT NULL,
      qr_template VARCHAR(50) NOT NULL DEFAULT 'compact2',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4;
  `;

  const seedSql = `
    INSERT INTO payment_settings (id, bank_bin, bank_name, account_no, account_name, qr_template)
    SELECT 1, '970415', 'VietinBank', '113366668888', 'NHA HANG TEST', 'compact2'
    FROM DUAL
    WHERE NOT EXISTS (SELECT 1 FROM payment_settings LIMIT 1);
  `;

  try {
    await pool.query(createTableSql);
    console.log("Migration 9: ensured 'payment_settings' table exists");
    
    await pool.query(seedSql);
    console.log("Migration 9: seeded default payment settings if table was empty");
  } catch (err) {
    console.error("Migration 9 failed:", err);
    throw err;
  }
}
