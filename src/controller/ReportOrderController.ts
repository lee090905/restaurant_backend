// src/controller/ReportOrderController.ts
import { Request, Response } from 'express';
import { ReportOrderRepositoryMysql } from '../database/repositories/ReportOrderRepositoryMysql';

export class ReportOrderController {
  constructor(private repo: ReportOrderRepositoryMysql) {}

  revenueByRange = async (req: Request, res: Response) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res
          .status(400)
          .json({ message: 'Missing from/to date parameters' });
      }

      const data = await this.repo.revenueByRange(String(from), String(to));
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  dishStatistic = async (_req: Request, res: Response) => {
    try {
      const data = await this.repo.dishSalesStatistic();
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  revenueChart = async (_req: Request, res: Response) => {
    try {
      const data = await this.repo.revenueTimeSeries();
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
