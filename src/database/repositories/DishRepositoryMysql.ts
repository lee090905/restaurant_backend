import { Dish } from "../../../Entities/Dish/Dish";
import { DishCreateData, DishUpdateData, IDishRepository } from "../../../Entities/Dish/IDishRepository";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
 
export class DishRepositoryMysql implements IDishRepository {
  async create(data: DishCreateData): Promise<Dish> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO dishes (name, price, category, active) VALUES (?, ?, ?, ?)`,
      [data.name, data.price, data.category, 1]
    );

    const id = result.insertId;

    return Dish.create({
      id,
      name: data.name,
      price: data.price,
      category: data.category as any,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  async update(data: DishUpdateData): Promise<Dish> {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.name !== undefined) {
      fields.push("name = ?");
      params.push(data.name);
    }
    if (data.price !== undefined) {
      fields.push("price = ?");
      params.push(data.price);
    }
    if (data.category !== undefined) {
      fields.push("category = ?");
      params.push(data.category);
    }
    if (fields.length > 0) {
      const sql = `UPDATE dishes SET ${fields.join(", ")} WHERE id = ?`;
      params.push(data.id);
      await pool.query<ResultSetHeader>(sql, params);
    }
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id, name, price, category, active, createdAt, updatedAt FROM dishes WHERE id = ?", [data.id]);
    const row = rows[0] as any;
    if (!row) throw new Error("Dish not found");
    return Dish.create({ id: row.id, name: row.name, price: row.price, category: row.category, active: row.active, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }
  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>("DELETE FROM dishes WHERE id = ?", [id]);
  }
  async paginate(page: number, limit: number): Promise<Dish[]> {
    const offset = (Math.max(1, page) - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, price, category, active, createdAt, updatedAt FROM dishes ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return (rows as any[]).map(r => Dish.create({ id: r.id, name: r.name, price: r.price, category: r.category, active: r.active, createdAt: r.createdAt, updatedAt: r.updatedAt }));
  }
  async findById(id: number): Promise<Dish> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, price, category, active, createdAt, updatedAt FROM dishes WHERE id = ?",
      [id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("Dish not found");
    return Dish.create({ id: row.id, name: row.name, price: row.price, category: row.category, active: row.active, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }
}