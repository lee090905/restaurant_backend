import { TableReservation } from "./Tablereservation";

export interface TableReservationCreateData {
  reservedAt: Date;
  status?: 'reserved' | 'cancelled' | 'completed';
  note?: string;
}

export interface TableReservationUpdateData {
  reservedAt?: Date;
  status?: 'reserved' | 'cancelled' | 'completed';
  note?: string;
}

export interface ITableReservationRepository {
  create(data: TableReservationCreateData): Promise<TableReservation>;
  update(data: TableReservationUpdateData): Promise<TableReservation>;
  delete(id: number): Promise<void>;
  paginate(page: number, limit: number): Promise<TableReservation[]>;
  findById(id: number): Promise<TableReservation>;
}
