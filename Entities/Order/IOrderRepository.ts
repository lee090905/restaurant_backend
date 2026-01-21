import { Order, OrderStatus } from './Order';

export interface IOrderRepository {
  create(order: OrderCreateData): Promise<Order>;
  update(order: OrderUpdateData): Promise<Order>;
  delete(id: number): Promise<void>;
  paginate(page: number, limit: number): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  findByTableId(tableId: number): Promise<Order | null>;
}

export interface OrderCreateData {
  tableId: number;
  status: OrderStatus;
  workshift?: number;
  note?: string;
}
export interface OrderUpdateData {
  id: number;
  tableId?: number;
  workshif?: number;
  openedAt?: Date;
  closedAt?: Date;
  status?: OrderStatus;
  note?: string;
}
