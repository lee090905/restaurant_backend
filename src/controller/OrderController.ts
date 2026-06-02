import { Request, Response } from 'express';
import {
  IOrderRepository,
  OrderCreateData,
  OrderUpdateData,
} from '../../Entities/Order/IOrderRepository';
import { GetOpenOrderByTable } from '../../Application/use-cases/order/GetOpenOrderByTable';
import { CheckoutOrder } from '../../Application/use-cases/order/CheckoutOrder';
import { MergeOrders } from '../../Application/use-cases/order/MergeOrders';
import { SplitOrder } from '../../Application/use-cases/order/SplitOrder';

export class OrderController {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly getOpenOrderByTable: GetOpenOrderByTable,
    private readonly checkoutOrder: CheckoutOrder,
    private readonly mergeOrders: MergeOrders,
    private readonly splitOrder: SplitOrder,
  ) {}
  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as OrderCreateData;
      if (!body) {
        return res.status(400).json({ message: 'Request body is required' });
      }
      if (!body.tableId || !body.status) {
        return res.status(400).json({ message: 'tableId, status required' });
      }
      const order = await this.orderRepository.create({
        tableId: body.tableId,
        status: body.status,
        note: body.note,
      });
      return res.status(201).json(order.toJSON());
    } catch (err: any) {
      console.error('Create order error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }
      const body = req.body as OrderUpdateData;
      const order = await this.orderRepository.update({
        id,
        tableId: body.tableId,
        openedAt: body.openedAt ? new Date(body.openedAt) : undefined,
        closedAt: body.closedAt ? new Date(body.closedAt) : undefined,
        status: body.status,
        note: body.note,
      });
      return res.status(200).json(order.toJSON());
    } catch (err: any) {
      console.error('Update order error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }
      await this.orderRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error('Delete order error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const orders = await this.orderRepository.paginate(page, limit);
      return res.status(200).json(orders.map((order) => order.toJSON()));
    } catch (err: any) {
      console.error('Paginate orders error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }
      const order = await this.orderRepository.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(order.toJSON());
    } catch (err: any) {
      console.error('Find order by id error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  findByTableId = async (req: Request, res: Response) => {
    try {
      const tableId = Number(req.params.tableId);
      const order = await this.orderRepository.findByTableId(tableId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found for table' });
      }
      return res.status(200).json(order.toJSON());
    } catch (err: any) {
      console.error('Find order by table id error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  getOpenByTable = async (req: Request, res: Response) => {
    try {
      const tableId = Number(req.params.tableId);
      const result = await this.getOpenOrderByTable.execute(tableId);

      if (!result) {
        return res.status(404).json({ message: 'No open order' });
      }

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
  checkout = async (req: Request, res: Response) => {
    try {
      const { orderitem_id, order_id, table_id } = req.body;
      await this.checkoutOrder.execute({ orderitem_id, order_id, table_id });
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  merge = async (req: Request, res: Response) => {
    try {
      const { fromTableId, toTableId } = req.body;
      if (!fromTableId || !toTableId) {
        return res.status(400).json({ message: 'fromTableId and toTableId are required' });
      }

      await this.mergeOrders.execute({ fromTableId, toTableId });
      return res.status(200).json({ success: true, message: 'Merged successfully' });
    } catch (err: any) {
      console.error('Merge order error:', err);
      return res.status(400).json({ message: err.message });
    }
  };

  split = async (req: Request, res: Response) => {
    try {
      const { fromTableId, toTableId, items } = req.body;
      if (!fromTableId || !toTableId || !items) {
        return res.status(400).json({ message: 'fromTableId, toTableId, and items are required' });
      }

      await this.splitOrder.execute({ fromTableId, toTableId, items });
      return res.status(200).json({ success: true, message: 'Split successfully' });
    } catch (err: any) {
      console.error('Split order error:', err);
      return res.status(400).json({ message: err.message });
    }
  };
}
