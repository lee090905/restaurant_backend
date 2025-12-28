import { Orderitem, statusType } from "./Orderitem";

export interface OrderitemCreateData {
    order: number;
    dish: number;
    quantity: number;
    price: number;
    note?: string;
    status: statusType;
    cancelReason?: string;
}

export interface OrderitemUpdateData {
    id: number;
    order?: number;
    dish?: number;
    quantity?: number;
    price?: number;
    note?: string;
    status?: statusType;
    cancelReason?: string;
}

export interface IOrderitemRepository {
    create(orderitem: OrderitemCreateData): Promise<Orderitem>;
    update(orderitem: OrderitemUpdateData): Promise<Orderitem>;
    delete(id: number): Promise<void>;
    paginate(page: number, limit: number): Promise<Orderitem[]>;
    findById(id: number): Promise<Orderitem | null>;
}