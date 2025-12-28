import pool from "../mysql";
import { TableReservation } from "../../../Entities/Tablereservation/Tablereservation";
import { ITableReservationRepository, TableReservationCreateData, TableReservationUpdateData } from "../../../Entities/Tablereservation/ITablereservationRepository";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class TableReservationRepositoryMysql implements ITableReservationRepository {
  async create(data: TableReservationCreateData): Promise<TableReservation> {
    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO table_reservations (reservedAt, status, note) VALUES (?, ?, ?)`,
      [data.reservedAt, data.status ?? "reserved", data.note ?? null]
    );
    const id = res.insertId;
    return this.findById(id) as Promise<TableReservation>;
  }

  async update(data: TableReservationUpdateData): Promise<TableReservation> {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.reservedAt !== undefined) {
      fields.push("reservedAt = ?");
      params.push(data.reservedAt);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      params.push(data.status);
    }
    if (data.note !== undefined) {
      fields.push("note = ?");
      params.push(data.note);
    }
    if (fields.length === 0) throw new Error("No fields to update");
    const id = (data as any).id;
    if (id === undefined) throw new Error("Missing id for update");
    params.push(id);
    await pool.query(`UPDATE table_reservations SET ${fields.join(", ")}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, params);
    const t = await this.findById(id);
    if (!t) throw new Error("Reservation not found after update");
    return t;
  }

  async delete(id: number): Promise<void> {
    await pool.query(`DELETE FROM table_reservations WHERE id = ?`, [id]);
  }

  async paginate(page = 1, limit = 10): Promise<TableReservation[]> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM table_reservations ORDER BY reservedAt DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return (rows as any[]).map(r => TableReservation.fromJSON(r));
  }

  async findById(id: number): Promise<TableReservation> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM table_reservations WHERE id = ? LIMIT 1`, [id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("TableReservation not found");
    return TableReservation.fromJSON(row);
  }
}
