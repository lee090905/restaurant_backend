import { IOrderRepository } from '../../../Entities/Order/IOrderRepository';
import { IOrderitemRepository } from '../../../Entities/Orderitem/IOrderitemRepository';
import { ITableRepository } from '../../../Entities/Table/ITableRepository';

export interface SplitOrderInput {
  fromTableId: number;
  toTableId: number;
  items: { dish_id: number; quantity: number }[];
}

export class SplitOrder {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderitemRepository: IOrderitemRepository,
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(input: SplitOrderInput): Promise<void> {
    const { fromTableId, toTableId, items } = input;

    if (fromTableId === toTableId) {
      throw new Error('Cannot split to the same table');
    }

    if (!items || items.length === 0) {
      throw new Error('No items to split');
    }

    // 1. Get open order for fromTableId
    const fromOrder = await this.orderRepository.findByTableId(fromTableId);
    if (!fromOrder || fromOrder.status !== 'open') {
      throw new Error('No open order found for the source table');
    }

    // 2. Get or create open order for toTableId
    let toOrder = await this.orderRepository.findByTableId(toTableId);
    if (!toOrder || toOrder.status !== 'open') {
      toOrder = await this.orderRepository.create({
        tableId: toTableId,
        status: 'open',
        workshift: fromOrder.workshift,
      });
      await this.tableRepository.update({
        id: toTableId,
        status: 'open',
      });
    }

    // 3. Move items
    const fromOrderItems = await this.orderitemRepository.findByOrderId(fromOrder.id);
    // filter only pending items to be safely split
    const availableItems = fromOrderItems.filter(i => i.status === 'pending');

    for (const itemToSplit of items) {
      const { dish_id, quantity } = itemToSplit;
      let remainingQuantityToSplit = quantity;

      // Find items in the source order that match this dish_id
      const matchingItems = availableItems.filter(i => i.dish === dish_id);

      for (const sourceItem of matchingItems) {
        if (remainingQuantityToSplit <= 0) break;

        const splitQty = Math.min(sourceItem.quantity, remainingQuantityToSplit);
        remainingQuantityToSplit -= splitQty;

        // Reduce from source
        const newSourceQty = sourceItem.quantity - splitQty;
        if (newSourceQty <= 0) {
          // If we took everything from this source item, delete it or we can just move it
          await this.orderitemRepository.delete(sourceItem.id);
        } else {
          // Update quantity
          await this.orderitemRepository.update({
            id: sourceItem.id,
            quantity: newSourceQty,
          });
        }

        // Add to destination
        // Let's see if destination already has this dish as pending
        const toOrderItems = await this.orderitemRepository.findByOrderId(toOrder.id);
        const existingDestItem = toOrderItems.find(i => i.dish === dish_id && i.status === 'pending');

        if (existingDestItem) {
          await this.orderitemRepository.update({
            id: existingDestItem.id,
            quantity: existingDestItem.quantity + splitQty,
          });
        } else {
          await this.orderitemRepository.create({
            order: toOrder.id,
            dish: dish_id,
            quantity: splitQty,
            price: sourceItem.price,
            status: 'pending',
          });
        }
      }

      if (remainingQuantityToSplit > 0) {
        // Warning: tried to split more than available. We can ignore or throw.
        // Let's just process what we can.
        console.warn(`Could not fully split dish_id ${dish_id}. Requested: ${quantity}, Remaining: ${remainingQuantityToSplit}`);
      }
    }
  }
}
