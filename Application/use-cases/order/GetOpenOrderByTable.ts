import { IOrderRepository } from "../../../Entities/Order/IOrderRepository";
import { IOrderitemRepository } from "../../../Entities/Orderitem/IOrderitemRepository";
import { IDishRepository } from "../../../Entities/Dish/IDishRepository";

export interface OpenOrderDTO {
  id: number;
  items: {
    dish_id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

export class GetOpenOrderByTable {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderItemRepository: IOrderitemRepository,
    private readonly dishRepository: IDishRepository
  ) {}

  async execute(tableId: number): Promise<OpenOrderDTO | null> {
    const order = await this.orderRepository.findByTableId(tableId);
    if (!order || order.status !== "open") return null;

    const orderItems =
      await this.orderItemRepository.findByOrderId(order.id);

    const items = [];
    let total = 0;

    for (const oi of orderItems) {
      const dish = await this.dishRepository.findById(oi.dish);
      if (!dish) continue;

      items.push({
        dish_id: dish.id,
        name: dish.name,
        price: oi.price,
        quantity: oi.quantity,
      });

      total += oi.price * oi.quantity;
    }

    return {
      id: order.id,
      items,
      total,
    };
  }
}
