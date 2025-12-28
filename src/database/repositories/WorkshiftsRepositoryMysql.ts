import { Workshifts } from "../../../Entities/Workshifts/Workshifts";
import { WorkshiftsCreateData, WorkshiftsUpdateData, IWorkshiftsRepository } from "../../../Entities/Workshifts/WorkshiftsRepository";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../../../Entities/User/User";

export class WorkshiftsRepositoryMysql implements IWorkshiftsRepository {
  async create(data: WorkshiftsCreateData): Promise<Workshifts> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO workshiftsProps (user, starttime, endtime, note, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.user, data.starttime, data.endtime ?? null, data.note ?? null, data.status ?? 'open', new Date(), new Date()]
    );
    const id = result.insertId;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT w.id, w.user, w.starttime, w.endtime, w.note, w.tolalhours, w.status, w.createdAt, w.updatedAt,
              u.id as u_id, u.username as u_username, u.password as u_password, u.role as u_role, u.createdAt as u_createdAt, u.updatedAt as u_updatedAt
       FROM workshiftsProps w
       LEFT JOIN users u ON w.user = u.id
       WHERE w.id = ?`,
      [id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("Workshift not found");

    const user = User.create({
      id: row.u_id,
      username: row.u_username,
      password: row.u_password,
      role: row.u_role,
      createdAt: row.u_createdAt ? new Date(row.u_createdAt) : undefined,
      updatedAt: row.u_updatedAt ? new Date(row.u_updatedAt) : undefined,
    });

    return Workshifts.create({
      id: row.id,
      user,
      starttime: new Date(row.starttime),
      endtime: row.endtime ? new Date(row.endtime) : undefined,
      note: row.note,
      status: row.status,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }

  async update(data: WorkshiftsUpdateData): Promise<Workshifts> {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.starttime !== undefined) { fields.push("starttime = ?"); params.push(data.starttime); }
    if (data.endtime !== undefined) { fields.push("endtime = ?"); params.push(data.endtime); }
    if (data.note !== undefined) { fields.push("note = ?"); params.push(data.note); }
    if (data.totalhours !== undefined) { fields.push("tolalhours = ?"); params.push(data.totalhours); }
    if (data.status !== undefined) { fields.push("status = ?"); params.push(data.status); }

    if (fields.length > 0) {
      const sql = `UPDATE workshiftsProps SET ${fields.join(", ")} WHERE id = ?`;
      params.push(data.id);
      await pool.query<ResultSetHeader>(sql, params);
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT w.id, w.user, w.starttime, w.endtime, w.note, w.tolalhours, w.status, w.createdAt, w.updatedAt,
              u.id as u_id, u.username as u_username, u.password as u_password, u.role as u_role, u.createdAt as u_createdAt, u.updatedAt as u_updatedAt
       FROM workshiftsProps w
       LEFT JOIN users u ON w.user = u.id
       WHERE w.id = ?`,
      [data.id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("Workshift not found");

    const user = User.create({
      id: row.u_id,
      username: row.u_username,
      password: row.u_password,
      role: row.u_role,
      createdAt: row.u_createdAt ? new Date(row.u_createdAt) : undefined,
      updatedAt: row.u_updatedAt ? new Date(row.u_updatedAt) : undefined,
    });

    return Workshifts.create({
      id: row.id,
      user,
      starttime: new Date(row.starttime),
      endtime: row.endtime ? new Date(row.endtime) : undefined,
      note: row.note,
      status: row.status,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }

  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>("DELETE FROM workshiftsProps WHERE id = ?", [id]);
  }

  async paginate(page: number, limit: number): Promise<Workshifts[]> {
    const offset = (Math.max(1, page) - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT w.id, w.user, w.starttime, w.endtime, w.note, w.tolalhours, w.status, w.createdAt, w.updatedAt,
              u.id as u_id, u.username as u_username, u.password as u_password, u.role as u_role, u.createdAt as u_createdAt, u.updatedAt as u_updatedAt
       FROM workshiftsProps w
       LEFT JOIN users u ON w.user = u.id
       ORDER BY w.createdAt DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return (rows as any[]).map(row => {
      const user = User.create({
        id: row.u_id,
        username: row.u_username,
        password: row.u_password,
        role: row.u_role,
        createdAt: row.u_createdAt ? new Date(row.u_createdAt) : undefined,
        updatedAt: row.u_updatedAt ? new Date(row.u_updatedAt) : undefined,
      });
      return Workshifts.create({
        id: row.id,
        user,
        starttime: new Date(row.starttime),
        endtime: row.endtime ? new Date(row.endtime) : undefined,
        note: row.note,
        status: row.status,
        createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      });
    });
  }

  async findById(id: number): Promise<Workshifts> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT w.id, w.user, w.starttime, w.endtime, w.note, w.tolalhours, w.status, w.createdAt, w.updatedAt,
              u.id as u_id, u.username as u_username, u.password as u_password, u.role as u_role, u.createdAt as u_createdAt, u.updatedAt as u_updatedAt
       FROM workshiftsProps w
       LEFT JOIN users u ON w.user = u.id
       WHERE w.id = ?`,
      [id]
    );
    const row = rows[0] as any;
    if (!row) throw new Error("Workshift not found");
    const user = User.create({
      id: row.u_id,
      username: row.u_username,
      password: row.u_password,
      role: row.u_role,
      createdAt: row.u_createdAt ? new Date(row.u_createdAt) : undefined,
      updatedAt: row.u_updatedAt ? new Date(row.u_updatedAt) : undefined,
    });
    return Workshifts.create({
      id: row.id,
      user,
      starttime: new Date(row.starttime),
      endtime: row.endtime ? new Date(row.endtime) : undefined,
      status: row.status,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }

  async findByUserId(userId: number): Promise<Workshifts | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT w.id, w.user, w.starttime, w.endtime, w.note, w.tolalhours, w.status, w.createdAt, w.updatedAt,
              u.id as u_id, u.username as u_username, u.password as u_password, u.role as u_role, u.createdAt as u_createdAt, u.updatedAt as u_updatedAt
       FROM workshiftsProps w
       LEFT JOIN users u ON w.user = u.id
       WHERE w.user = ? AND w.status = 'open'
       ORDER BY w.createdAt DESC
       LIMIT 1`,
      [userId]
    );
    if (rows.length === 0) return null;
    
    const row = rows[0] as any;
    const user = User.create({
      id: row.u_id,
      username: row.u_username,
      password: row.u_password,
      role: row.u_role,
      createdAt: row.u_createdAt ? new Date(row.u_createdAt) : undefined,
      updatedAt: row.u_updatedAt ? new Date(row.u_updatedAt) : undefined,
    });
    return Workshifts.create({
      id: row.id,
      user,
      starttime: new Date(row.starttime),
      endtime: row.endtime ? new Date(row.endtime) : undefined,
      note: row.note,
      status: row.status,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }
}