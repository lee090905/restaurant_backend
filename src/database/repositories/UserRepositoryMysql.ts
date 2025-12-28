import pool from "../mysql";
import { User } from "../../../Entities/User/User";
import { IUserRepository, UserCreateData, UserUpdateData } from "../../../Entities/User/IUserRepository";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class UserRepository implements IUserRepository {
  async create(data: UserCreateData): Promise<User> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (username, password, role, createdAt) VALUES (?, ?, ?, ?)`,
      [data.username, data.password, data.role, new Date()]
    );  
    const id = result.insertId;

    return User.create({
      id,
      username: data.username,
      password: data.password,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } 
  async update(data: UserUpdateData): Promise<User> {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.username !== undefined) {
      fields.push("username = ?");
      params.push(data.username);
    }
    if (data.password !== undefined) {
      fields.push("password = ?");
      params.push(data.password);
    }
    if (data.role !== undefined) {
      fields.push("role = ?");
      params.push(data.role);
    }
    if (fields.length > 0) {
      const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      params.push(data.id);
      await pool.query<ResultSetHeader>(sql, params);
    }
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id, username, password, role, createdAt, updatedAt FROM users WHERE id = ?", [data.id]);
    const row = rows[0] as any;
    if (!row) throw new Error("User not found");
    return User.create({ id: row.id, username: row.username, password: row.password, role: row.role, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }
  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [id]);
  }
  async paginate(page: number, limit: number): Promise<User[]> {
    const offset = (Math.max(1, page) - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, username, password, role, createdAt, updatedAt FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return (rows as any[]).map(r => User.create({ id: r.id, username: r.username, password: r.password, role: r.role, createdAt: r.createdAt, updatedAt: r.updatedAt }));
  }

  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, username, password, role, createdAt, updatedAt FROM users WHERE username = ?",
      [username]
    );
    const row = rows[0] as any;
    if (!row) return null;
    return User.create({ id: row.id, username: row.username, password: row.password, role: row.role, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }

  async findById(id: number): Promise<User> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, username, password, role, createdAt, updatedAt FROM users WHERE id = ?",
      [id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("User not found");
    return User.create({ id: row.id, username: row.username, password: row.password, role: row.role, createdAt: new Date(row.createdAt), updatedAt: new Date(row.updatedAt) });
  }
}