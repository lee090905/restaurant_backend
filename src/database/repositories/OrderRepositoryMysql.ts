import { Order } from "../../../Entities/Order/Order";
import { OrderCreateData, OrderUpdateData, IOrderRepository } from "../../../Entities/Order/IOrderRepository";
import { Table } from "../../../Entities/Table/Table";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class OrderRepositoryMysql implements IOrderRepository {
  async create(data: OrderCreateData): Promise<Order> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO orders (tableId, openedAt, status, note) VALUES (?, NOW(), ?, ?)`,
      [data.tableId, data.status, data.note || null]
    );

    const id = result.insertId;
    
    // Get table info for the order
    const [tableRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, area, status, createdAt FROM tables WHERE id = ?",
      [data.tableId]
    );
    const tableRow = tableRows[0] as any;
    if (!tableRow) throw new Error("Table not found");

    const table = Table.create({
      id: tableRow.id,
      name: tableRow.name,
      area: tableRow.area,
      status: tableRow.status,
      createdAt: tableRow.createdAt,
      updatedAt: tableRow.updatedAt,
    });

    return Order.create({
      id,
      table,
      openedAt: new Date(),
      status: data.status as any,
      note: data.note,
    });
  }

  async update(data: OrderUpdateData): Promise<Order> {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.tableId !== undefined) {
      fields.push("tableId = ?");
      params.push(data.tableId);
    }
    if (data.openedAt !== undefined) {
      fields.push("openedAt = ?");
      params.push(data.openedAt);
    }
    if (data.closedAt !== undefined) {
      fields.push("closedAt = ?");
      params.push(data.closedAt);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      params.push(data.status);
    }
    if (data.note !== undefined) {
      fields.push("note = ?");
      params.push(data.note);
    }

    if (fields.length > 0) {
      const sql = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;
      params.push(data.id);
      await pool.query<ResultSetHeader>(sql, params);
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.id, o.tableId, o.openedAt, o.closedAt, o.status, o.note, 
              t.id as tableId, t.name, t.area, t.status as tableStatus, t.createdAt 
       FROM orders o 
       LEFT JOIN tables t ON o.tableId = t.id 
       WHERE o.id = ?`,
      [data.id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("Order not found");

    const table = Table.create({
      id: row.tableId,
      name: row.name,
      area: row.area,
      status: row.tableStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });

    return Order.create({
      id: row.id,
      table,
      openedAt: row.openedAt,
      closedAt: row.closedAt,
      status: row.status,
      note: row.note,
    });
  }

  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>("DELETE FROM orders WHERE id = ?", [id]);
  }

  async paginate(page: number, limit: number): Promise<Order[]> {
    const offset = (Math.max(1, page) - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.id, o.tableId, o.openedAt, o.closedAt, o.status, o.note, 
              t.id as tableId, t.name, t.area, t.status as tableStatus, t.createdAt 
       FROM orders o 
       LEFT JOIN tables t ON o.tableId = t.id 
       ORDER BY o.openedAt DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return (rows as any[]).map(r =>
      Order.create({
        id: r.id,
        table: Table.create({
          id: r.tableId,
          name: r.name,
          area: r.area,
          status: r.tableStatus,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
        openedAt: r.openedAt,
        closedAt: r.closedAt,
        status: r.status,
        note: r.note,
      })
    );
  }
  async findById(id: number): Promise<Order | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.id, o.tableId, o.openedAt, o.closedAt, o.status, o.note, 
              t.id as tableId, t.name, t.area, t.status as tableStatus, t.createdAt 
       FROM orders o 
       LEFT JOIN tables t ON o.tableId = t.id 
       WHERE o.id = ?`,
      [id]
    );
    const row = rows[0] as any;
    if (!row) return null;

    const table = Table.create({
      id: row.tableId,
      name: row.name,
      area: row.area,
      status: row.tableStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });

    return Order.create({
      id: row.id,
      table,
      openedAt: row.openedAt,
      closedAt: row.closedAt,
      status: row.status,
      note: row.note,
    });
  }
}