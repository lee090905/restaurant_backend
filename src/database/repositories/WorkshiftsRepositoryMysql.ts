import { Workshifts } from '../../../Entities/Workshifts/Workshifts';
import {
  WorkshiftsCreateData,
  WorkshiftsUpdateData,
  IWorkshiftsRepository,
} from '../../../Entities/Workshifts/IWorkshiftsRepository';
import pool from '../mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class WorkshiftsRepositoryMysql implements IWorkshiftsRepository {
  // 1. Tạo mới ca làm việc
  async create(data: WorkshiftsCreateData): Promise<Workshifts> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO workshiftsprops (user, starttime, endtime, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.user,
        data.starttime,
        data.endtime ?? null,
        data.status ?? 'open',
        new Date(),
        new Date(),
      ],
    );
    const id = result.insertId;
    return this.findById(id);
  }

  // 2. Cập nhật (Đóng ca, lưu giờ làm)
  async update(data: WorkshiftsUpdateData): Promise<Workshifts> {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.user !== undefined) {
      fields.push('user = ?');
      params.push(data.user);
    }
    if (data.starttime !== undefined) {
      fields.push('starttime = ?');
      params.push(data.starttime);
    }
    if (data.endtime !== undefined) {
      fields.push('endtime = ?');
      params.push(data.endtime);
    }
    if (data.note !== undefined) {
      fields.push('note = ?');
      params.push(data.note);
    }

    // LƯU Ý: Mapping từ totalhours (code) -> tolalhours (tên cột DB bị sai)
    if (data.totalhours !== undefined) {
      fields.push('tolalhours = ?');
      params.push(data.totalhours);
    }

    if (data.status !== undefined) {
      fields.push('status = ?');
      params.push(data.status);
    }

    // Luôn cập nhật updatedAt
    fields.push('updatedAt = ?');
    params.push(new Date());

    // Nếu không có trường nào cần update thì return luôn
    if (fields.length === 0) {
      return this.findById(data.id);
    }

    params.push(data.id); // Tham số cho WHERE id = ?

    const sql = `UPDATE workshiftsprops SET ${fields.join(', ')} WHERE id = ?`;

    await pool.query<ResultSetHeader>(sql, params);

    return this.findById(data.id);
  }

  // 3. Xóa ca
  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM workshiftsprops WHERE id = ?', [id]);
  }

  // 4. Lấy danh sách phân trang
  async paginate(page: number, limit: number): Promise<Workshifts[]> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM workshiftsprops ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return rows.map((row: any) =>
      Workshifts.create({
        id: row.id,
        user: row.user,
        starttime: new Date(row.starttime),
        endtime: row.endtime ? new Date(row.endtime) : undefined,
        status: row.status,
        totalhours: row.tolalhours, // Map từ cột DB tolalhours
        note: row.note,
        createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      }),
    );
  }

  // 5. Tìm theo ID
  async findById(id: number): Promise<Workshifts> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM workshiftsprops WHERE id = ?`,
      [id],
    );
    const row = rows[0] as any;
    if (!row) throw new Error('Workshift not found');

    return Workshifts.create({
      id: row.id,
      user: row.user,
      starttime: new Date(row.starttime),
      endtime: row.endtime ? new Date(row.endtime) : undefined,
      status: row.status,
      totalhours: row.tolalhours, // Map từ cột DB tolalhours
      note: row.note,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }

  // 6. Tìm ca đang mở của User (để check-in/check-out)
  async findByUserId(userId: number): Promise<Workshifts | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM workshiftsprops WHERE user = ? AND status = 'open' ORDER BY createdAt DESC LIMIT 1`,
      [userId],
    );

    if (!rows.length) return null;

    const row = rows[0] as any;
    return Workshifts.create({
      id: row.id,
      user: row.user,
      starttime: new Date(row.starttime),
      endtime: row.endtime ? new Date(row.endtime) : undefined,
      status: row.status,
      totalhours: row.tolalhours, // Map từ cột DB tolalhours
      note: row.note,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }
}
