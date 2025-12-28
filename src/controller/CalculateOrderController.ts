import { Request, Response } from "express";
import { ITableRepository } from "../../Entities/Table/ITableRepository";
import { IOrderitemRepository } from "../../Entities/Orderitem/IOrderitemRepository";
import { IOrderRepository } from "../../Entities/Order/IOrderRepository";
import { IDishRepository } from "../../Entities/Dish/IDishRepository";
import { CalculateOrderTotal } from "../../Application/use-cases/user/CalculateOrderTotal";

export class CalculateOrderController {
    constructor(
            private readonly tableRepository: ITableRepository,
            private readonly orderRepository: IOrderRepository,
            private readonly orderItemRepository: IOrderitemRepository,
            private readonly dishRepository: IDishRepository
    ) {}

    calculateOrderTotal = async (req: Request, res: Response) => {
        try {
            const body = req.body as {
                items: {
                    dish_id: number;
                    quantity: number;
                }[];
                order_id: number;
                table_id: number
            };
            const calculateOrderTotal = new CalculateOrderTotal(
                this.tableRepository,
                this.orderRepository,
                this.dishRepository
            );
            const totalAmount = await calculateOrderTotal.execute(body);

            res.status(200).json({
                message: "Order total calculated and table opened successfully",
                total: totalAmount,
                table_id: body.table_id,
                order_id: body.order_id
            });
        } catch (error) {
            res.status(400).send({ error: (error as Error).message });
        }
    }
}