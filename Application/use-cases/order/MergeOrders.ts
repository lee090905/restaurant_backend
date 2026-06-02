import { IOrderRepository } from '../../../Entities/Order/IOrderRepository';
import { IOrderitemRepository } from '../../../Entities/Orderitem/IOrderitemRepository';
import { ITableRepository } from '../../../Entities/Table/ITableRepository';

export interface MergeOrdersInput {
  fromTableId: number;
  toTableId: number;
}

export class MergeOrders {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderitemRepository: IOrderitemRepository,
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(input: MergeOrdersInput): Promise<void> {
    const { fromTableId, toTableId } = input;

    if (fromTableId === toTableId) {
      throw new Error('Cannot merge a table to itself');
    }

    // 1. Get open order for fromTableId
    const fromOrder = await this.orderRepository.findByTableId(fromTableId);
    if (!fromOrder || fromOrder.status !== 'open') {
      throw new Error('No open order found for the source table');
    }

    // 2. Get open order for toTableId
    let toOrder = await this.orderRepository.findByTableId(toTableId);
    
    // If no open order on toTable, we'll throw an error (since the user said "Cộng gộp tiền vào bàn 8" which implies table 8 is already open)
    // Wait, what if it's not open? It's safer to create one if it doesn't exist, but usually you merge to an existing open table.
    if (!toOrder || toOrder.status !== 'open') {
      toOrder = await this.orderRepository.create({
        tableId: toTableId,
        status: 'open',
        workshift: fromOrder.workshift, // keep same shift
      });
      // Set toTable status to open
      await this.tableRepository.update({
        id: toTableId,
        status: 'open',
      });
    }

    // 3. Move all order items from fromOrder to toOrder
    const orderItems = await this.orderitemRepository.findByOrderId(fromOrder.id);
    for (const item of orderItems) {
      await this.orderitemRepository.update({
        id: item.id,
        order: toOrder.id,
      });
    }

    // 4. Close the old order (or mark it closed)
    await this.orderRepository.update({
      id: fromOrder.id,
      status: 'closed',
      note: `Merged to table ${toTableId}`,
      closedAt: new Date(),
    });

    // 5. Update fromTable status to close
    await this.tableRepository.update({
      id: fromTableId,
      status: 'close',
    });
  }
}
