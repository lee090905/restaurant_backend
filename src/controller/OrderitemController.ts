import { Request, Response } from 'express';
import {
  IOrderitemRepository,
  OrderitemCreateData,
  OrderitemUpdateData,
} from '../../Entities/Orderitem/IOrderitemRepository';
import { cancelOrderItemService } from '../../Application/use-cases/order/cancelOrderItem';
import { IUserRepository } from '../../Entities/User/IUserRepository';

export class OrderitemController {
  constructor(
    private readonly orderitemRepository: IOrderitemRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  // POST /orderitems
  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as OrderitemCreateData;

      if (
        !body.order ||
        !body.dish ||
        !body.quantity ||
        body.price == null ||
        !body.status
      ) {
        return res
          .status(400)
          .json({ message: 'order, dish, quantity, price, status required' });
      }

      const orderitem = await this.orderitemRepository.create(body);
      return res.status(201).json(orderitem);
    } catch (err: any) {
      console.error('Create orderitem error:', err?.message ?? err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // PUT /orderitems/:id
  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const body = req.body as OrderitemUpdateData;
      const { id: _ignoredId, ...rest } = body as any;
      const orderitem = await this.orderitemRepository.update({ id, ...rest });

      return res.status(200).json(orderitem);
    } catch (err: any) {
      if (err.message === 'Orderitem not found') {
        return res.status(404).json({ message: 'Orderitem not found' });
      }
      console.error('Update orderitem error:', err?.message ?? err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // DELETE /orderitems/:id
  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      await this.orderitemRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error('Delete orderitem error:', err?.message ?? err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // GET /orderitems?page=&limit=
  paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const items = await this.orderitemRepository.paginate(page, limit);
      return res.status(200).json(items);
    } catch (err: any) {
      console.error('List orderitems error:', err?.message ?? err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }
      const orderitem = await this.orderitemRepository.findById(id);
      if (!orderitem) {
        return res.status(404).json({ message: 'Orderitem not found' });
      }
      return res.status(200).json(orderitem);
    } catch (err: any) {
      console.error('Find orderitem by id error:', err?.message ?? err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  findByOrderId = async (req: Request, res: Response) => {
    try {
      const orderId = Number(req.params.orderId);
      const items = await this.orderitemRepository.findByOrderId(orderId);
      return res.status(200).json(items);
    } catch (err: any) {
      console.error('Find orderitems by order id error:', err?.message ?? err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  // POST /orderitems/cancel
  cancel = async (req: Request, res: Response) => {
    try {
      const updated = await cancelOrderItemService(
        {
          orderItemId: req.body.orderItemId,
          reason: req.body.reason,
        },
        {
          orderitemRepository: this.orderitemRepository,
        },
      );

      return res.status(200).json(updated);
    } catch (err: any) {
      switch (err.message) {
        case 'MISSING_DATA':
          return res.status(400).json({ message: 'Thiếu dữ liệu' });
        case 'ORDERITEM_NOT_FOUND':
          return res.status(404).json({ message: 'Orderitem not found' });
        default:
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
}
