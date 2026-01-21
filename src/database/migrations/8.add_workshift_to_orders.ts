import pool from '../mysql';

export default async function run(): Promise<void> {
  // Adding workshiftId to orders table.
  // We reference 'workshiftsProps' based on your previous files.
  const sql = `
    ALTER TABLE orders 
    ADD COLUMN workshiftId INT NULL,
    ADD CONSTRAINT fk_order_workshift 
    FOREIGN KEY (workshiftId) REFERENCES workshiftsprops(id) ON DELETE SET NULL;
  `;

  try {
    await pool.query(sql);
    console.log("Migration 8: added 'workshiftId' to 'orders' table");
  } catch (err) {
    console.error('Migration 8 failed:', err);
    throw err;
  }
}
