export interface TableReservationProps {
  id: number;
  reservedAt: Date;
  status: 'reserved' | 'cancelled' | 'completed';
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TableReservation {
  private constructor(private readonly props: TableReservationProps) {}
  get id() { return this.props.id; }
  get reservedAt() { return this.props.reservedAt; }
  get status() { return this.props.status; }
  get note() { return this.props.note; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  static create(props: TableReservationProps) { return new TableReservation(props); }
  toJSON() { return { ...this.props }; }
  static fromJSON(json: any) {
    return new TableReservation({
      id: json.id,
      reservedAt: new Date(json.reservedAt),
      status: json.status,
      note: json.note,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt
    });
  }
}
