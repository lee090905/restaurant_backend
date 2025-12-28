import { Order } from "../Order/Order";
import { Dish } from "../Dish/Dish";

export interface OrderitemProps {
  id: number;
  order: number;
  dish: number;
  quantity: number;
  price: number;
  note?: string;
  status: statusType;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type statusType = 'pending' | 'cancelled' | 'completed';

export class Orderitem {
  private constructor(private readonly props: OrderitemProps) {}
    get id()         { return this.props.id; }
    get order()   { return this.props.order; } 
    get dish()   { return this.props.dish; }
    get quantity()       { return this.props.quantity; }
    get price()    { return this.props.price; }
    get note()    { return this.props.note; }
    get status()    { return this.props.status; }
    get cancelReason()    { return this.props.cancelReason; }
    get createdAt()    { return this.props.createdAt; }
    get updatedAt()    { return this.props.updatedAt; }
    static create(props: OrderitemProps) {
    return new Orderitem(props);
    }
    toJSON() {
      return {
        id: this.id,
        order: this.order,
        dish: this.dish,
        quantity: this.quantity,
        price: this.price,
        note: this.note,
        status: this.status,
        cancelReason: this.cancelReason,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }
    static fromJSON(json: OrderitemProps): Orderitem {
      return new Orderitem({
        id: json.id,
        order: json.order,
        dish: json.dish,
        quantity: json.quantity,
        price: json.price,
        note: json.note,
        status: json.status,
        cancelReason: json.cancelReason,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt
    });
  }
}
 