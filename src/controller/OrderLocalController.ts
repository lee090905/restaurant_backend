import { Request, Response } from "express";
import { ITableRepository } from "../../Entities/Table/ITableRepository";
import { IOrderRepository } from "../../Entities/Order/IOrderRepository";
import { IOrderitemRepository } from "../../Entities/Orderitem/IOrderitemRepository";
import { IDishRepository } from "../../Entities/Dish/IDishRepository";
import { PlaceOrderLocal } from "../../Application/use-cases/user/PlaceOrderLocal";

export class OrderLocalController {
    constructor(
            private readonly tableRepository: ITableRepository,
            private readonly orderRepository: IOrderRepository,
            private readonly orderItemRepository: IOrderitemRepository,
            private readonly dishRepository: IDishRepository
    ) {}

    placeOrderLocal = async (req: Request, res: Response) => {
        try {
            const body = req.body as {
                items: {
                    dish_id: number;
                    quantity: number;
                    note: string;
                }[];
                table_id: number
            };

            if (!body || !body.items || !body.table_id) {
                return res.status(400).json({
                    success: false,
                    message: "Dữ liệu không hợp lệ"
                });
            }

            const action = new PlaceOrderLocal(
                this.tableRepository,
                this.orderItemRepository,
                this.orderRepository,
                this.dishRepository
            );

            const order = await action.execute({
                items: body.items,
                table_id: body.table_id
            });

            return res.status(200).json({
                success: true,
                order
            });
            
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: error.message || "Đặt món thất bại"
            });
        }
    }
}