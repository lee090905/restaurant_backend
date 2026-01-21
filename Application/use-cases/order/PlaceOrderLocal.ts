import { ITableRepository } from '../../../Entities/Table/ITableRepository';
import { IOrderRepository } from '../../../Entities/Order/IOrderRepository';
import { IOrderitemRepository } from '../../../Entities/Orderitem/IOrderitemRepository';
import { IDishRepository } from '../../../Entities/Dish/IDishRepository';
import { IWorkshiftsRepository } from '../../../Entities/Workshifts/IWorkshiftsRepository';
import { Order } from '../../../Entities/Order/Order';
import { KitchenPrintService } from '../../services/KitchenPrintService';

interface PlaceOrderItemData {
  dish_id: number;
  quantity: number;
  note?: string;
}

interface PlaceOrderData {
  userId: number;
  items: PlaceOrderItemData[];
  table_id: number;
}

export class PlaceOrderLocal {
  constructor(
    private readonly tableRepository: ITableRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly orderItemRepository: IOrderitemRepository,
    private readonly dishRepository: IDishRepository,
    private readonly workshiftRepository: IWorkshiftsRepository,
  ) {}

  async execute(data: PlaceOrderData): Promise<Order> {
    const table = await this.tableRepository.findById(data.table_id);
    if (!table) throw new Error('Table not found');

    let order: Order;

    if (table.status === 'close') {
      const existingOrder = await this.orderRepository.findByTableId(table.id);
      if (!existingOrder) throw new Error('Order not found for table');
      order = existingOrder;
    } else if (table.status === 'open') {
      const currentWorkshift = await this.workshiftRepository.findByUserId(
        data.userId,
      );

      if (!currentWorkshift) {
        throw new Error('Nhân viên chưa mở ca làm');
      }

      order = await this.orderRepository.create({
        tableId: table.id,
        status: 'open',
        workshift: currentWorkshift.id,
      });

      await this.tableRepository.update({
        id: table.id,
        status: 'close',
      });
    } else {
      throw new Error('Invalid table status');
    }

    for (const item of data.items) {
      const dish = await this.dishRepository.findById(item.dish_id);
      if (!dish) throw new Error('Dish not found');

      await this.orderItemRepository.create({
        order: order.id,
        dish: dish.id,
        quantity: item.quantity,
        price: dish.price,
        note: item.note,
        status: 'pending',
        cancelReason: undefined,
      });

      KitchenPrintService.print({
        tableName: table.name,
        dishName: dish.name,
        note: item.note,
      });
    }

    return order!;
  }
}
