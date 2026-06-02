import pool from "../mysql";

export default async function run(): Promise<void> {
  const sql = `
    ALTER TABLE orderitems 
    ADD COLUMN IF NOT EXISTS cancelApproved TINYINT DEFAULT 0 AFTER cancelReason;
  `;

  try {
    await pool.query(sql);
    console.log("Migration 10: ensured 'cancelApproved' column exists in 'orderitems'");
  } catch (err) {
    console.error("Migration 10 failed:", err);
    throw err;
  }
}
