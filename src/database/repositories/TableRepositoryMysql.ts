import { Table } from "../../../Entities/Table/Table";
import { TableCreateData, TableUpdateData, ITableRepository } from "../../../Entities/Table/ITableRepository";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class TableRepository implements ITableRepository {
  async create(data: TableCreateData): Promise<Table> {
    // Sử dụng dấu ? làm placeholder để tránh SQL Injection và nhận dữ liệu động
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO tables (name, area, status) VALUES (?, ?, ?)`,
      [data.name, data.area, data.status || 'close'] // true sẽ được mysql2 chuyển thành 1
    );

    const id = result.insertId;
    
    // Trả về đối tượng Table vừa tạo
    return Table.create({     
      id, 
      name: data.name, 
      area: data.area, 
      status: data.status || 'close',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  async update(data: TableUpdateData): Promise<Table> {
    const fields: string[] = [];
    const params: any[] = [];   
    if (data.name !== undefined) {
      fields.push("name = ?");
      params.push(data.name);
    }
    if (data.area !== undefined) {
      fields.push("area = ?");
      params.push(data.area);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      params.push(data.status);
    }
    if (fields.length > 0) {
      const sql = `UPDATE tables SET ${fields.join(", ")} WHERE id = ?`;
      params.push(data.id);
      await pool.query<ResultSetHeader>(sql, params);
    }
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id, name, area, status, createdAt FROM tables WHERE id = ?", [data.id]);
    const row = rows[0] as any;
    if (!row) throw new Error("Table not found");
    return Table.create({ id: row.id, name: row.name, area: row.area, status: row.status, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }

  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>("DELETE FROM tables WHERE id = ?", [id]);
  }

  async paginate(page: number, limit: number): Promise<Table[]> {
    const offset = (Math.max(1, page) - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, area, status, createdAt FROM tables ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return (rows as any[]).map(r => Table.create({ id: r.id, name: r.name, area: r.area, status: r.status, createdAt: r.createdAt, updatedAt: r.updatedAt }));
 }
 async findById(id: number): Promise<Table> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, area, status, createdAt FROM tables WHERE id = ?",
      [id]
    );
    const row = (rows as any[])[0];
    if (!row) throw new Error("Table not found");
    return Table.create({ id: row.id, name: row.name, area: row.area, status: row.status, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }
}