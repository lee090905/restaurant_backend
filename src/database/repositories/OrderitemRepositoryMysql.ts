import { Orderitem } from '../../../Entities/Orderitem/Orderitem';
import {
  OrderitemCreateData,
  OrderitemUpdateData,
  IOrderitemRepository,
} from '../../../Entities/Orderitem/IOrderitemRepository';
import pool from '../mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class OrderitemRepositoryMysql implements IOrderitemRepository {
  async create(data: OrderitemCreateData): Promise<Orderitem> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO orderitems (orderId, dishId, quantity, price, note, status, cancelReason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.order,
        data.dish,
        data.quantity,
        data.price,
        data.note ?? null,
        data.status,
        data.cancelReason ?? null,
      ],
    );
    const id = result.insertId;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, orderId, dishId, quantity, price, note, status, cancelReason, createdAt, updatedAt FROM orderitems WHERE id = ?',
      [id],
    );
    const row = rows[0] as any;
    return Orderitem.create({
      id: row.id,
      order: row.orderId,
      dish: row.dishId,
      quantity: row.quantity,
      price: row.price,
      note: row.note,
      status: row.status,
      cancelReason: row.cancelReason,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async update(data: OrderitemUpdateData): Promise<Orderitem> {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.order !== undefined) {
      fields.push('orderId = ?');
      params.push(data.order);
    }
    if (data.dish !== undefined) {
      fields.push('dishId = ?');
      params.push(data.dish);
    }
    if (data.quantity !== undefined) {
      fields.push('quantity = ?');
      params.push(data.quantity);
    }
    if (data.price !== undefined) {
      fields.push('price = ?');
      params.push(data.price);
    }
    if (data.note !== undefined) {
      fields.push('note = ?');
      params.push(data.note);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      params.push(data.status);
    }
    if (data.cancelReason !== undefined) {
      fields.push('cancelReason = ?');
      params.push(data.cancelReason);
    }

    if (fields.length > 0) {
      const sql = `UPDATE orderitems SET ${fields.join(', ')} WHERE id = ?`;
      params.push(data.id);
      await pool.query<ResultSetHeader>(sql, params);
    }
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, orderId, dishId, quantity, price, note, status, cancelReason, createdAt, updatedAt FROM orderItems WHERE id = ?',
      [data.id],
    );
    const row = rows[0] as any;
    if (!row) throw new Error('Orderitem not found');
    return Orderitem.create({
      id: row.id,
      order: row.orderId,
      dish: row.dishId,
      quantity: row.quantity,
      price: row.price,
      note: row.note,
      status: row.status,
      cancelReason: row.cancelReason,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>('DELETE FROM orderitems WHERE id = ?', [
      id,
    ]);
  }

  async paginate(page: number, limit: number): Promise<Orderitem[]> {
    const offset = (Math.max(1, page) - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, orderId, dishId, quantity, price, note, status, cancelReason, createdAt, updatedAt FROM orderitems ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset],
    );
    return (rows as any[]).map((r) =>
      Orderitem.create({
        id: r.id,
        order: r.orderId,
        dish: r.dishId,
        quantity: r.quantity,
        price: r.price,
        note: r.note,
        status: r.status,
        cancelReason: r.cancelReason,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }),
    );
  }

  async findById(id: number): Promise<Orderitem | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, orderId, dishId, quantity, price, note, status, cancelReason, createdAt, updatedAt FROM orderitems WHERE id = ?',
      [id],
    );
    const row = rows[0] as any;
    if (!row) return null;
    return Orderitem.create({
      id: row.id,
      order: row.orderId,
      dish: row.dishId,
      quantity: row.quantity,
      price: row.price,
      note: row.note,
      status: row.status,
      cancelReason: row.cancelReason,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async findByOrderId(orderId: number): Promise<Orderitem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, orderId, dishId, quantity, price, note, status, cancelReason, createdAt, updatedAt FROM orderitems WHERE orderId = ?',
      [orderId],
    );
    return (rows as any[]).map((r) =>
      Orderitem.create({
        id: r.id,
        order: r.orderId,
        dish: r.dishId,
        quantity: r.quantity,
        price: r.price,
        note: r.note,
        status: r.status,
        cancelReason: r.cancelReason,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }),
    );
  }

  async completeByOrderId(order: number): Promise<Orderitem[]> {
    await pool.query(
      `
    UPDATE orderitems
    SET status = 'completed'
    WHERE orderId = ?
      AND status = 'pending'
    `,
      [order],
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      `
    SELECT id, orderId, dishId, quantity, price, note, status, cancelReason, createdAt, updatedAt
    FROM orderitems
    WHERE orderId = ?
    `,
      [order],
    );

    return rows.map((row: any) =>
      Orderitem.create({
        id: row.id,
        order: row.orderId,
        dish: row.dishId,
        quantity: row.quantity,
        price: row.price,
        note: row.note,
        status: row.status,
        cancelReason: row.cancelReason,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }),
    );
  }
}
