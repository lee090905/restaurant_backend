import { Request, Response } from 'express';
import { PlaceOrderLocal } from '../../Application/use-cases/order/PlaceOrderLocal';

export class OrderLocalController {
  constructor(private readonly placeOrderLocal: PlaceOrderLocal) {}

  placeOrder = async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        userId: number;
        table_id: number;
        items: {
          dish_id: number;
          quantity: number;
          note?: string;
        }[];
      };

      if (!body?.table_id) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request data',
        });
      }

      const order = await this.placeOrderLocal.execute(body);

      return res.status(201).json({
        success: true,
        data: order.toJSON(),
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
