export interface TableProps {
  id: number;
  name: string;
  status: TableStatus;
  area: areaType;
  createdAt: Date;
  updatedAt: Date;
}

export type areaType = '1' | '2' | '3';

export type TableStatus = 'open' | 'close';

export class Table {
  private constructor(private readonly props: TableProps) {}
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get status() { return this.props.status; }
    get area() { return this.props.area; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    static create(props: TableProps) {
      return new Table(props);
    }
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        status: this.status,
        area: this.area,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }
    static fromJSON(json: TableProps): Table {
      return new Table({
        id: json.id,
        name: json.name,
        status: json.status,
        area: json.area,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt
      });
    }
}