// Application/use-cases/order/CheckoutOrder.ts
import { IOrderRepository } from '../../../Entities/Order/IOrderRepository';
import { ITableRepository } from '../../../Entities/Table/ITableRepository';
import { IOrderitemRepository } from '../../../Entities/Orderitem/IOrderitemRepository';

interface CheckoutOrderData {
  orderitem_id: number;
  order_id: number;
  table_id: number;
}

export class CheckoutOrder {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly tableRepository: ITableRepository,
    private readonly orderitemRepository: IOrderitemRepository,
  ) {}

  async execute(data: CheckoutOrderData): Promise<void> {
    const order = await this.orderRepository.findById(data.order_id);
    if (!order) throw new Error('Order not found');

    await this.orderitemRepository.completeByOrderId(order.id);

    // 1️⃣ ĐÓNG ORDER
    await this.orderRepository.update({
      id: data.order_id,
      status: 'closed',
      closedAt: new Date(),
    });

    await this.tableRepository.update({
      id: data.table_id,
      status: 'open',
    });
  }
}
