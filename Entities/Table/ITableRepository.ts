import { areaType, Table,TableStatus } from "../Table/Table";

export interface ITableRepository {
    findById(id: number): Promise<Table>;
    create(table: TableCreateData): Promise<Table>;
    update(table: TableUpdateData): Promise<Table>;
    delete(id: number): Promise<void>;
    paginate(page: number, limit: number): Promise<Table[]>;
}

export interface TableUpdateData {
    id: number;
    name?: string;
    area?: areaType;
    status?: TableStatus;
}
export interface TableCreateData {
    name: string;
    area: areaType;
    status?: TableStatus;
}