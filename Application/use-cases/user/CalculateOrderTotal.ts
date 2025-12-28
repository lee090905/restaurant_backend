// tính tiền => in (orderitems,orderid,tableid) out(tổng tiền , mở bàn)
import { ITableRepository } from "../../../Entities/Table/ITableRepository"
import { IOrderRepository } from "../../../Entities/Order/IOrderRepository"
import { IDishRepository } from "../../../Entities/Dish/IDishRepository"

interface PlaceOrderItemData {
    dish_id: number
    quantity: number
}

interface CalculateOrderTotalData {
    items: PlaceOrderItemData[]
    order_id: number
    table_id: number
    total?: number
}

export class CalculateOrderTotal {
    constructor(
        private readonly tableRepository: ITableRepository,
        private readonly orderRepository: IOrderRepository,
        private readonly dishRepository: IDishRepository
    ){}

    async execute(data: CalculateOrderTotalData): Promise<number> {
        const order = await this.orderRepository.findById(data.order_id)
        if (!order) {
            throw new Error("Order not found")
        }
        let total = 0
        for (const element of data.items) {
            const item = element
            const dish = await this.dishRepository.findById(item.dish_id)
            if (!dish) {
                throw new Error(`Dish with id ${item.dish_id} not found`)
            }
            total += dish.price * item.quantity
        }
        
        const table = await this.tableRepository.findById(data.table_id)
        if (!table) {
            throw new Error("Table not found")
        }
        await this.tableRepository.update({
            id: data.table_id,
            status: 'open'
        })

        await this.orderRepository.update({
            id: data.order_id,
            status: 'closed',
        })

        return total
    }
}