import { Pool } from 'mysql2/promise';

export class ReportOrderRepositoryMysql {
  constructor(private db: any) {}

  async revenueByRange(from: string, to: string) {
    const [rows] = await this.db.query(
      `
        SELECT
          COUNT(DISTINCT o.id) AS totalOrders,
          COALESCE(SUM(oi.price * oi.quantity), 0) AS totalRevenue
        FROM orders o
        JOIN orderitems oi ON oi.orderId = o.id
        WHERE o.status = 'closed' 
          AND o.openedAt BETWEEN ? AND ?
      `,
      [from, to + ' 23:59:59'],
    );
    return rows[0];
  }

  async dishSalesStatistic() {
    const [rows] = await this.db.query(
      `
      SELECT
        oi.dishId,
        d.name AS dishName,
        d.category,
        SUM(oi.quantity) AS totalQuantity,
        SUM(oi.price * oi.quantity) AS totalRevenue
      FROM orderitems oi
      JOIN orders o ON o.id = oi.orderId
      JOIN dishes d ON d.id = oi.dishId
      WHERE o.status = 'closed'
      GROUP BY oi.dishId, d.name, d.category
      ORDER BY totalQuantity DESC
      LIMIT 10
      `,
    );
    return rows;
  }

  async revenueTimeSeries() {
    const [rows] = await this.db.query(
      `
      SELECT
        DATE_FORMAT(o.openedAt, '%Y-%m-%d') as reportDate,
        SUM(oi.price * oi.quantity) as totalRevenue
      FROM orders o
      JOIN orderitems oi ON oi.orderId = o.id
      WHERE o.status = 'closed'
        AND o.openedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE_FORMAT(o.openedAt, '%Y-%m-%d')
      ORDER BY reportDate ASC
      `,
    );
    return rows;
  }
}
