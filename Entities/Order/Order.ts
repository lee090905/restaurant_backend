
export interface OrderProps {
  id: number;
  table: number;
  openedAt: Date;
  closedAt?: Date;
  status: OrderStatus;
  note?: string;
}

export type OrderStatus = 'open' | 'waiting_payment' | 'closed';

export class Order {
  private constructor(private readonly props: OrderProps) {}
    get id() { return this.props.id; }
    get table() { return this.props.table; }
    get openedAt() { return this.props.openedAt; }
    get closedAt() { return this.props.closedAt; }
    get status() { return this.props.status; }
    get note() { return this.props.note; }
    static create(props: OrderProps) {
      return new Order(props);
    }
    toJSON() {
        return {
        id: this.id,
        table: this.table,
        openedAt: this.openedAt,
        closedAt: this.closedAt,
        status: this.status,
        note: this.note,
      }
    }
    static fromJSON(json: OrderProps): Order {
      return new Order({
        id: json.id,
        table: json.table,
        openedAt: json.openedAt,
        closedAt: json.closedAt,
        status: json.status,
        note: json.note,
      });
    }
}